import "./style.less";

import { dirname } from "path";
import type { AttachmentInfo } from "@obzt/database";
import type { Annotation, JournalArticleItem } from "@obzt/zotero-type";
import type { FuzzyMatch } from "obsidian";
import { Modal, Notice } from "obsidian";
import { render } from "preact";
import {
  FuzzySuggestModalWithPromise,
  ZoteroItemSuggestModal,
} from "../suggester/index.js";
import type ZoteroPlugin from "../zt-main";
import { AnnotationContext, AnnotationList } from "./annot-list.js";

const instructions = [
  { command: "↑↓", purpose: "to navigate" },
  { command: "↵", purpose: "select literature to import citation" },
  { command: "esc", purpose: "to dismiss" },
];
export class LiteratureSelectModal extends ZoteroItemSuggestModal {
  constructor(public plugin: ZoteroPlugin) {
    super(plugin);
    this.setInstructions(instructions);
    this.titleEl.setText("Select Annotations to Import");
  }

  async select(): Promise<{
    attachment: AttachmentInfo;
    annotations: Annotation[];
  } | void> {
    const result = await (this.promise ?? this.open());
    if (!result) return;
    const { libraryID, itemID, title } = result.value
      .item as JournalArticleItem;
    if (!itemID) throw new Error("No itemID for selected attachment " + title);
    const attachments = await this.plugin.db.getAttachments(itemID, libraryID);
    if (attachments.length === 0) {
      new Notice(`No attachment found for this literature ${title}`);
      return;
    }

    let targetAttachment: AttachmentInfo;
    if (attachments.length === 1) {
      targetAttachment = attachments[0];
    } else {
      const result = await new AttachmentSelectModal(attachments).open();
      if (!result) return;
      targetAttachment = result.value.item;
    }
    if (!targetAttachment.itemID) {
      new Notice(
        `Failed to get attachment: itemID missing for ${
          targetAttachment.path ?? targetAttachment.key
        }`,
      );
      return;
    }

    const annotations = await this.plugin.db.getAnnotations(
      targetAttachment.itemID,
      libraryID,
    );
    const selectedAnnots = await new AnnotationSelectModal(
      annotations,
      this.plugin,
    ).open();
    if (selectedAnnots && selectedAnnots.length > 0) {
      return { attachment: targetAttachment, annotations: selectedAnnots };
    }
  }
}

class AttachmentSelectModal extends FuzzySuggestModalWithPromise<AttachmentInfo> {
  constructor(public attachments: AttachmentInfo[]) {
    super(app);
  }
  getItems(): AttachmentInfo[] {
    return this.attachments;
  }
  renderSuggestion(item: FuzzyMatch<AttachmentInfo>, el: HTMLElement): void {
    el.addClass("mod-complex");
    const contentEl = el
      .createDiv("suggestion-content")
      .createDiv("suggestion-title")
      .createSpan();
    const auxEl = el.createDiv("suggestion-aux");
    super.renderSuggestion(item, contentEl);
    auxEl
      .createEl("kbd", "suggestion-hotkey")
      .setText((item.item.count ?? 0).toString());
  }

  getItemText(item: AttachmentInfo): string {
    return item.path?.replace(/^storage:/, "") ?? item.key;
  }

  // get result in promise
  onChooseItem(): void {
    return;
  }
}

export class AnnotationSelectModal extends Modal {
  buttonContainerEl = this.modalEl.createDiv("modal-button-container");
  constructor(public annotations: Annotation[], public plugin: ZoteroPlugin) {
    super(app);
    this.modalEl.addClass("select-annot-modal");
    this.titleEl.setText("Select Annotations to Import");
  }
  resolve: ((value: Annotation[] | null) => void) | null = null;
  open() {
    super.open();
    return new Promise<Annotation[] | null>((resolve) => {
      this.resolve = resolve;
    });
  }
  onOpen(): void {
    render(
      <AnnotationContext.Provider
        value={{
          buttonContainer: this.buttonContainerEl,
          zoteroDataDir: dirname(this.plugin.settings.zoteroDbPath),
        }}
      >
        <AnnotationList
          annotations={this.annotations}
          onSelectDone={this.onSelectDone.bind(this)}
        />
      </AnnotationContext.Provider>,
      this.contentEl,
    );
  }
  onSelectDone(annotations: Annotation[]) {
    this.resolve?.(annotations);
    this.resolve = null;
    this.close();
  }

  onClose() {
    if (this.resolve) {
      this.resolve(null);
      this.resolve = null;
    }
  }
}
