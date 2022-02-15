import Fuse from "fuse.js";
import log from "loglevel";
import { FileSystemAdapter, Notice } from "obsidian";
import indexCitation from "web-worker:./index-citation";

import { PromiseWebWorker, PromiseWorker } from "../promise-worker";
import { RegularItem } from "../zotero-types";
import ZoteroPlugin from "../zt-main";
import type { Input, Output } from "./get-index";
import getIndex from "./get-index";

export default class ZoteroDb {
  fuse: Fuse<RegularItem> | null = null;
  items: Record<string, RegularItem> = {};

  indexCitationWorker: PromiseWorker<Input, Output> | null = null;

  constructor(private plugin: ZoteroPlugin) {
    plugin.register(this.close.bind(this));
  }

  private get props() {
    return {
      dbPath: this.plugin.settings.zoteroDbPath,
      libraryID: 1,
    };
  }

  private get ConfigPath() {
    const { adapter, configDir } = this.plugin.app.vault;
    if (adapter instanceof FileSystemAdapter) {
      return adapter.getFullPath(configDir);
    } else throw new Error("Unsupported adapter");
  }

  async init() {
    if (this.indexCitationWorker) {
      this.indexCitationWorker.terminate();
      this.indexCitationWorker = null;
    }
    await this.refresh();
  }
  async initWithWorker() {
    new Notice("Initializing ZoteroDB with worker...");
    let start = Date.now();
    if (!this.indexCitationWorker) {
      this.indexCitationWorker = new PromiseWebWorker<Input, Output>(
        indexCitation(this.ConfigPath),
      );
    }
    await this.refresh();
    new Notice("ZoteroDB Initialization complete.");
    log.debug(
      `ZoteroDB Initialization complete. Took ${(Date.now() - start) / 1e3}s`,
    );
  }
  async refresh() {
    if (this.indexCitationWorker) {
      this.initIndexAndFuse(
        await this.indexCitationWorker.postMessage(this.props),
      );
    } else {
      this.initIndexAndFuse(await getIndex(this.props));
    }
  }

  initIndexAndFuse(args: Output) {
    const [items, fuseOptions, index] = args;
    this.items = items.reduce(
      (record, item) => ((record[item.key] = item), record),
      {} as Record<string, RegularItem>,
    );
    this.fuse = new Fuse(items, fuseOptions, Fuse.parseIndex(index));
  }

  search(query: string[], matchField: string, limit = 20) {
    if (!this.fuse) return [];
    let exp = query.map<Fuse.Expression>((s) => ({ [matchField]: s }));
    return this.fuse.search({ $and: exp }, { limit });
  }
  getAll(limit = 20): Fuse.FuseResult<RegularItem>[] {
    let docs = (this.fuse?.getIndex() as any).docs as RegularItem[] | undefined;
    if (!docs) return [];
    docs = docs.slice(0, limit);
    return docs.map((item, index) => ({
      item,
      refIndex: index,
    }));
  }

  close() {
    this.indexCitationWorker?.terminate();
    this.indexCitationWorker = null;
  }
}
