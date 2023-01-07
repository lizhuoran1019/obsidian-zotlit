import type {
  AnnotationType,
  TagType,
  BooleanInt,
  LibraryType,
  AttachmentType,
  CreatorFieldMode,
} from "./misc.js";
/*
 * This file was generated by a tool.
 * Rerun sql-ts to regenerate this file.
 */
export interface BaseFieldMappings {
  baseFieldID: number | null;
  fieldID: number | null;
  itemTypeID: number | null;
}
export interface BaseFieldMappingsCombined {
  baseFieldID: number | null;
  fieldID: number | null;
  itemTypeID: number | null;
}
export interface Charsets {
  charset: string | null;
  charsetID: number | null;
}
export interface CollectionItems {
  collectionID: number;
  itemID: number;
  orderIndex: number;
}
export interface CollectionRelations {
  collectionID: number;
  object: string;
  predicateID: number;
}
export interface Collections {
  clientDateModified: string;
  collectionID: number | null;
  collectionName: string;
  key: string;
  libraryID: number;
  parentCollectionID: number | null;
  synced: number;
  version: number;
}
export interface Creators {
  creatorID: number | null;
  fieldMode: CreatorFieldMode | null;
  firstName: string | null;
  lastName: string | null;
}
export interface CreatorTypes {
  creatorType: string | null;
  creatorTypeID: number | null;
}
export interface CustomBaseFieldMappings {
  baseFieldID: number | null;
  customFieldID: number | null;
  customItemTypeID: number | null;
}
export interface CustomFields {
  customFieldID: number | null;
  fieldName: string | null;
  label: string | null;
}
export interface CustomItemTypeFields {
  customFieldID: number | null;
  customItemTypeID: number;
  fieldID: number | null;
  hide: number;
  orderIndex: number;
}
export interface CustomItemTypes {
  customItemTypeID: number | null;
  display: number | null;
  icon: string | null;
  label: string | null;
  typeName: string | null;
}
export interface DeletedCollections {
  collectionID: number | null;
  dateDeleted: string;
}
export interface DeletedItems {
  dateDeleted: string;
  itemID: number | null;
}
export interface DeletedSearches {
  dateDeleted: string;
  savedSearchID: number | null;
}
export interface FeedItems {
  guid: string;
  itemID: number | null;
  readTime: string | null;
  translatedTime: string | null;
}
export interface Feeds {
  cleanupReadAfter: number | null;
  cleanupUnreadAfter: number | null;
  lastCheck: string | null;
  lastCheckError: string | null;
  lastUpdate: string | null;
  libraryID: number | null;
  name: string;
  refreshInterval: number | null;
  url: string;
}
export interface FieldFormats {
  fieldFormatID: number | null;
  isInteger: number | null;
  regex: string | null;
}
export interface Fields {
  fieldFormatID: number | null;
  fieldID: number | null;
  fieldName: string | null;
}
export interface FieldsCombined {
  custom: number;
  fieldFormatID: number | null;
  fieldID: number;
  fieldName: string;
  label: string | null;
}
export interface FileTypeMimeTypes {
  fileTypeID: number | null;
  mimeType: string | null;
}
export interface FileTypes {
  fileType: string | null;
  fileTypeID: number | null;
}
export interface FulltextItems {
  indexedChars: number | null;
  indexedPages: number | null;
  itemID: number | null;
  synced: number;
  totalChars: number | null;
  totalPages: number | null;
  version: number;
}
export interface FulltextItemWords {
  itemID: number | null;
  wordID: number | null;
}
export interface FulltextWords {
  word: string | null;
  wordID: number | null;
}
export interface GroupItems {
  createdByUserID: number | null;
  itemID: number | null;
  lastModifiedByUserID: number | null;
}
export interface Groups {
  description: string;
  groupID: number | null;
  libraryID: number;
  name: string;
  version: number;
}
export interface ItemAnnotations {
  authorName: string | null;
  color: string | null;
  comment: string | null;
  isExternal: BooleanInt;
  itemID: number | null;
  pageLabel: string | null;
  parentItemID: number;
  position: string;
  sortIndex: string;
  text: string | null;
  type: AnnotationType;
}
export interface ItemAttachments {
  charsetID: number | null;
  contentType: string | null;
  itemID: number | null;
  lastProcessedModificationTime: number | null;
  linkMode: AttachmentType | null;
  parentItemID: number | null;
  path: string | null;
  storageHash: string | null;
  storageModTime: number | null;
  syncState: number | null;
}
export interface ItemCreators {
  creatorID: number;
  creatorTypeID: number;
  itemID: number;
  orderIndex: number;
}
export interface ItemData {
  fieldID: number | null;
  itemID: number | null;
  valueID: number | null;
}
export interface ItemDataValues {
  value: unknown | null;
  valueID: number | null;
}
export interface ItemNotes {
  itemID: number | null;
  note: string | null;
  parentItemID: number | null;
  title: string | null;
}
export interface ItemRelations {
  itemID: number;
  object: string;
  predicateID: number;
}
export interface Items {
  clientDateModified: string;
  dateAdded: string;
  dateModified: string;
  itemID: number | null;
  itemTypeID: number;
  key: string;
  libraryID: number;
  synced: number;
  version: number;
}
export interface ItemTags {
  itemID: number;
  tagID: number;
  type: TagType;
}
export interface ItemTypeCreatorTypes {
  creatorTypeID: number | null;
  itemTypeID: number | null;
  primaryField: number | null;
}
export interface ItemTypeFields {
  fieldID: number | null;
  hide: number | null;
  itemTypeID: number | null;
  orderIndex: number | null;
}
export interface ItemTypeFieldsCombined {
  fieldID: number;
  hide: number | null;
  itemTypeID: number;
  orderIndex: number;
}
export interface ItemTypes {
  display: number | null;
  itemTypeID: number | null;
  templateItemTypeID: number | null;
  typeName: string | null;
}
export interface ItemTypesCombined {
  custom: number;
  display: number;
  itemTypeID: number;
  typeName: string;
}
export interface Libraries {
  archived: number;
  editable: number;
  filesEditable: number;
  lastSync: number;
  libraryID: number | null;
  storageVersion: number;
  type: LibraryType;
  version: number;
}
export interface Proxies {
  autoAssociate: number | null;
  multiHost: number | null;
  proxyID: number | null;
  scheme: string | null;
}
export interface ProxyHosts {
  hostID: number | null;
  hostname: string | null;
  proxyID: number | null;
}
export interface PublicationsItems {
  itemID: number | null;
}
export interface RelationPredicates {
  predicate: string | null;
  predicateID: number | null;
}
export interface RetractedItems {
  data: string | null;
  flag: number | null;
  itemID: number | null;
}
export interface SavedSearchConditions {
  condition: string;
  operator: string | null;
  required: unknown | null;
  savedSearchID: number;
  searchConditionID: number;
  value: string | null;
}
export interface SavedSearches {
  clientDateModified: string;
  key: string;
  libraryID: number;
  savedSearchID: number | null;
  savedSearchName: string;
  synced: number;
  version: number;
}
export interface Settings {
  key: string | null;
  setting: string | null;
  value: unknown | null;
}
export interface StorageDeleteLog {
  dateDeleted: string;
  key: string;
  libraryID: number;
}
export interface SyncCache {
  data: string | null;
  key: string;
  libraryID: number;
  syncObjectTypeID: number;
  version: number;
}
export interface SyncDeleteLog {
  dateDeleted: string;
  key: string;
  libraryID: number;
  syncObjectTypeID: number;
}
export interface SyncedSettings {
  libraryID: number;
  setting: string;
  synced: number;
  value: unknown;
  version: number;
}
export interface SyncObjectTypes {
  name: string | null;
  syncObjectTypeID: number | null;
}
export interface SyncQueue {
  key: string;
  lastCheck: string | null;
  libraryID: number;
  syncObjectTypeID: number;
  tries: number | null;
}
export interface Tags {
  name: string;
  tagID: number | null;
}
export interface TranslatorCache {
  fileName: string | null;
  lastModifiedTime: number | null;
  metadataJSON: string | null;
}
export interface Users {
  name: string;
  userID: number | null;
}
export interface Version {
  schema: string | null;
  version: number;
}
