// package: christiangeorgelucas.conventional_commit_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class Footer extends jspb.Message {
  getToken(): string;
  setToken(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Footer.AsObject;
  static toObject(includeInstance: boolean, msg: Footer): Footer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Footer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Footer;
  static deserializeBinaryFromReader(message: Footer, reader: jspb.BinaryReader): Footer;
}

export namespace Footer {
  export type AsObject = {
    token: string,
    value: string,
  }
}

export class IssueReference extends jspb.Message {
  getRaw(): string;
  setRaw(value: string): void;

  getAction(): string;
  setAction(value: string): void;

  getIssue(): string;
  setIssue(value: string): void;

  getPrefix(): string;
  setPrefix(value: string): void;

  getOwner(): string;
  setOwner(value: string): void;

  getRepository(): string;
  setRepository(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IssueReference.AsObject;
  static toObject(includeInstance: boolean, msg: IssueReference): IssueReference.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IssueReference, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IssueReference;
  static deserializeBinaryFromReader(message: IssueReference, reader: jspb.BinaryReader): IssueReference;
}

export namespace IssueReference {
  export type AsObject = {
    raw: string,
    action: string,
    issue: string,
    prefix: string,
    owner: string,
    repository: string,
  }
}

export class ValidationIssue extends jspb.Message {
  getCode(): string;
  setCode(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  getSeverity(): string;
  setSeverity(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidationIssue.AsObject;
  static toObject(includeInstance: boolean, msg: ValidationIssue): ValidationIssue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidationIssue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidationIssue;
  static deserializeBinaryFromReader(message: ValidationIssue, reader: jspb.BinaryReader): ValidationIssue;
}

export namespace ValidationIssue {
  export type AsObject = {
    code: string,
    message: string,
    severity: string,
  }
}

export class ConventionalCommit extends jspb.Message {
  getHeader(): string;
  setHeader(value: string): void;

  getHeaderMatched(): boolean;
  setHeaderMatched(value: boolean): void;

  getType(): string;
  setType(value: string): void;

  getScope(): string;
  setScope(value: string): void;

  getBreaking(): boolean;
  setBreaking(value: boolean): void;

  getBreakingDescription(): string;
  setBreakingDescription(value: string): void;

  getBreakingSource(): string;
  setBreakingSource(value: string): void;

  getSubject(): string;
  setSubject(value: string): void;

  getBody(): string;
  setBody(value: string): void;

  getFooterRaw(): string;
  setFooterRaw(value: string): void;

  clearFootersList(): void;
  getFootersList(): Array<Footer>;
  setFootersList(value: Array<Footer>): void;
  addFooters(value?: Footer, index?: number): Footer;

  clearReferencesList(): void;
  getReferencesList(): Array<IssueReference>;
  setReferencesList(value: Array<IssueReference>): void;
  addReferences(value?: IssueReference, index?: number): IssueReference;

  clearMentionsList(): void;
  getMentionsList(): Array<string>;
  setMentionsList(value: Array<string>): void;
  addMentions(value: string, index?: number): string;

  getIsRevert(): boolean;
  setIsRevert(value: boolean): void;

  getRevertHeader(): string;
  setRevertHeader(value: string): void;

  getRevertHash(): string;
  setRevertHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConventionalCommit.AsObject;
  static toObject(includeInstance: boolean, msg: ConventionalCommit): ConventionalCommit.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ConventionalCommit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConventionalCommit;
  static deserializeBinaryFromReader(message: ConventionalCommit, reader: jspb.BinaryReader): ConventionalCommit;
}

export namespace ConventionalCommit {
  export type AsObject = {
    header: string,
    headerMatched: boolean,
    type: string,
    scope: string,
    breaking: boolean,
    breakingDescription: string,
    breakingSource: string,
    subject: string,
    body: string,
    footerRaw: string,
    footersList: Array<Footer.AsObject>,
    referencesList: Array<IssueReference.AsObject>,
    mentionsList: Array<string>,
    isRevert: boolean,
    revertHeader: string,
    revertHash: string,
  }
}

export class CommitMessageRequest extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CommitMessageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CommitMessageRequest): CommitMessageRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CommitMessageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CommitMessageRequest;
  static deserializeBinaryFromReader(message: CommitMessageRequest, reader: jspb.BinaryReader): CommitMessageRequest;
}

export namespace CommitMessageRequest {
  export type AsObject = {
    message: string,
  }
}

export class ParseCommitResult extends jspb.Message {
  hasCommit(): boolean;
  clearCommit(): void;
  getCommit(): ConventionalCommit | undefined;
  setCommit(value?: ConventionalCommit): void;

  getOk(): boolean;
  setOk(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseCommitResult.AsObject;
  static toObject(includeInstance: boolean, msg: ParseCommitResult): ParseCommitResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseCommitResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseCommitResult;
  static deserializeBinaryFromReader(message: ParseCommitResult, reader: jspb.BinaryReader): ParseCommitResult;
}

export namespace ParseCommitResult {
  export type AsObject = {
    commit?: ConventionalCommit.AsObject,
    ok: boolean,
    error: string,
  }
}

export class ValidateCommitRequest extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getAllowAnyTypeCase(): boolean;
  setAllowAnyTypeCase(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateCommitRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateCommitRequest): ValidateCommitRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidateCommitRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateCommitRequest;
  static deserializeBinaryFromReader(message: ValidateCommitRequest, reader: jspb.BinaryReader): ValidateCommitRequest;
}

export namespace ValidateCommitRequest {
  export type AsObject = {
    message: string,
    allowAnyTypeCase: boolean,
  }
}

export class ValidateCommitResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearIssuesList(): void;
  getIssuesList(): Array<ValidationIssue>;
  setIssuesList(value: Array<ValidationIssue>): void;
  addIssues(value?: ValidationIssue, index?: number): ValidationIssue;

  hasCommit(): boolean;
  clearCommit(): void;
  getCommit(): ConventionalCommit | undefined;
  setCommit(value?: ConventionalCommit): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateCommitResult.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateCommitResult): ValidateCommitResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidateCommitResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateCommitResult;
  static deserializeBinaryFromReader(message: ValidateCommitResult, reader: jspb.BinaryReader): ValidateCommitResult;
}

export namespace ValidateCommitResult {
  export type AsObject = {
    valid: boolean,
    issuesList: Array<ValidationIssue.AsObject>,
    commit?: ConventionalCommit.AsObject,
  }
}

export class ExtractTypeResult extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getFound(): boolean;
  setFound(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractTypeResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractTypeResult): ExtractTypeResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractTypeResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractTypeResult;
  static deserializeBinaryFromReader(message: ExtractTypeResult, reader: jspb.BinaryReader): ExtractTypeResult;
}

export namespace ExtractTypeResult {
  export type AsObject = {
    type: string,
    found: boolean,
  }
}

export class ExtractScopeResult extends jspb.Message {
  getScope(): string;
  setScope(value: string): void;

  getFound(): boolean;
  setFound(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractScopeResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractScopeResult): ExtractScopeResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractScopeResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractScopeResult;
  static deserializeBinaryFromReader(message: ExtractScopeResult, reader: jspb.BinaryReader): ExtractScopeResult;
}

export namespace ExtractScopeResult {
  export type AsObject = {
    scope: string,
    found: boolean,
  }
}

export class DetectBreakingChangeResult extends jspb.Message {
  getBreaking(): boolean;
  setBreaking(value: boolean): void;

  getDescription(): string;
  setDescription(value: string): void;

  getSource(): string;
  setSource(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetectBreakingChangeResult.AsObject;
  static toObject(includeInstance: boolean, msg: DetectBreakingChangeResult): DetectBreakingChangeResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetectBreakingChangeResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetectBreakingChangeResult;
  static deserializeBinaryFromReader(message: DetectBreakingChangeResult, reader: jspb.BinaryReader): DetectBreakingChangeResult;
}

export namespace DetectBreakingChangeResult {
  export type AsObject = {
    breaking: boolean,
    description: string,
    source: string,
  }
}

export class ExtractFootersResult extends jspb.Message {
  clearFootersList(): void;
  getFootersList(): Array<Footer>;
  setFootersList(value: Array<Footer>): void;
  addFooters(value?: Footer, index?: number): Footer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractFootersResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractFootersResult): ExtractFootersResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractFootersResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractFootersResult;
  static deserializeBinaryFromReader(message: ExtractFootersResult, reader: jspb.BinaryReader): ExtractFootersResult;
}

export namespace ExtractFootersResult {
  export type AsObject = {
    footersList: Array<Footer.AsObject>,
  }
}

export class ExtractIssueReferencesResult extends jspb.Message {
  clearReferencesList(): void;
  getReferencesList(): Array<IssueReference>;
  setReferencesList(value: Array<IssueReference>): void;
  addReferences(value?: IssueReference, index?: number): IssueReference;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractIssueReferencesResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractIssueReferencesResult): ExtractIssueReferencesResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractIssueReferencesResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractIssueReferencesResult;
  static deserializeBinaryFromReader(message: ExtractIssueReferencesResult, reader: jspb.BinaryReader): ExtractIssueReferencesResult;
}

export namespace ExtractIssueReferencesResult {
  export type AsObject = {
    referencesList: Array<IssueReference.AsObject>,
  }
}

export class DetermineReleaseTypeResult extends jspb.Message {
  getReleaseType(): string;
  setReleaseType(value: string): void;

  getReason(): string;
  setReason(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetermineReleaseTypeResult.AsObject;
  static toObject(includeInstance: boolean, msg: DetermineReleaseTypeResult): DetermineReleaseTypeResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetermineReleaseTypeResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetermineReleaseTypeResult;
  static deserializeBinaryFromReader(message: DetermineReleaseTypeResult, reader: jspb.BinaryReader): DetermineReleaseTypeResult;
}

export namespace DetermineReleaseTypeResult {
  export type AsObject = {
    releaseType: string,
    reason: string,
  }
}

export class SplitHeaderBodyResult extends jspb.Message {
  getHeader(): string;
  setHeader(value: string): void;

  getBody(): string;
  setBody(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SplitHeaderBodyResult.AsObject;
  static toObject(includeInstance: boolean, msg: SplitHeaderBodyResult): SplitHeaderBodyResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SplitHeaderBodyResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SplitHeaderBodyResult;
  static deserializeBinaryFromReader(message: SplitHeaderBodyResult, reader: jspb.BinaryReader): SplitHeaderBodyResult;
}

export namespace SplitHeaderBodyResult {
  export type AsObject = {
    header: string,
    body: string,
  }
}

export class ParseRevertResult extends jspb.Message {
  getIsRevert(): boolean;
  setIsRevert(value: boolean): void;

  getRevertedHeader(): string;
  setRevertedHeader(value: string): void;

  getRevertedHash(): string;
  setRevertedHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseRevertResult.AsObject;
  static toObject(includeInstance: boolean, msg: ParseRevertResult): ParseRevertResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseRevertResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseRevertResult;
  static deserializeBinaryFromReader(message: ParseRevertResult, reader: jspb.BinaryReader): ParseRevertResult;
}

export namespace ParseRevertResult {
  export type AsObject = {
    isRevert: boolean,
    revertedHeader: string,
    revertedHash: string,
  }
}

export class ExtractMentionsResult extends jspb.Message {
  clearMentionsList(): void;
  getMentionsList(): Array<string>;
  setMentionsList(value: Array<string>): void;
  addMentions(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractMentionsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractMentionsResult): ExtractMentionsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractMentionsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractMentionsResult;
  static deserializeBinaryFromReader(message: ExtractMentionsResult, reader: jspb.BinaryReader): ExtractMentionsResult;
}

export namespace ExtractMentionsResult {
  export type AsObject = {
    mentionsList: Array<string>,
  }
}

export class ParseCommitLogRequest extends jspb.Message {
  getLog(): string;
  setLog(value: string): void;

  getDelimiter(): string;
  setDelimiter(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseCommitLogRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ParseCommitLogRequest): ParseCommitLogRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseCommitLogRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseCommitLogRequest;
  static deserializeBinaryFromReader(message: ParseCommitLogRequest, reader: jspb.BinaryReader): ParseCommitLogRequest;
}

export namespace ParseCommitLogRequest {
  export type AsObject = {
    log: string,
    delimiter: string,
  }
}

export class ParseCommitLogResult extends jspb.Message {
  clearCommitsList(): void;
  getCommitsList(): Array<ConventionalCommit>;
  setCommitsList(value: Array<ConventionalCommit>): void;
  addCommits(value?: ConventionalCommit, index?: number): ConventionalCommit;

  getCount(): number;
  setCount(value: number): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseCommitLogResult.AsObject;
  static toObject(includeInstance: boolean, msg: ParseCommitLogResult): ParseCommitLogResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseCommitLogResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseCommitLogResult;
  static deserializeBinaryFromReader(message: ParseCommitLogResult, reader: jspb.BinaryReader): ParseCommitLogResult;
}

export namespace ParseCommitLogResult {
  export type AsObject = {
    commitsList: Array<ConventionalCommit.AsObject>,
    count: number,
    error: string,
  }
}

export class SummarizeCommitsRequest extends jspb.Message {
  getLog(): string;
  setLog(value: string): void;

  getDelimiter(): string;
  setDelimiter(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SummarizeCommitsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SummarizeCommitsRequest): SummarizeCommitsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SummarizeCommitsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SummarizeCommitsRequest;
  static deserializeBinaryFromReader(message: SummarizeCommitsRequest, reader: jspb.BinaryReader): SummarizeCommitsRequest;
}

export namespace SummarizeCommitsRequest {
  export type AsObject = {
    log: string,
    delimiter: string,
  }
}

export class TypeCount extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TypeCount.AsObject;
  static toObject(includeInstance: boolean, msg: TypeCount): TypeCount.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TypeCount, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TypeCount;
  static deserializeBinaryFromReader(message: TypeCount, reader: jspb.BinaryReader): TypeCount;
}

export namespace TypeCount {
  export type AsObject = {
    type: string,
    count: number,
  }
}

export class SummarizeCommitsResult extends jspb.Message {
  getTotal(): number;
  setTotal(value: number): void;

  clearCountsByTypeList(): void;
  getCountsByTypeList(): Array<TypeCount>;
  setCountsByTypeList(value: Array<TypeCount>): void;
  addCountsByType(value?: TypeCount, index?: number): TypeCount;

  clearBreakingChangesList(): void;
  getBreakingChangesList(): Array<ConventionalCommit>;
  setBreakingChangesList(value: Array<ConventionalCommit>): void;
  addBreakingChanges(value?: ConventionalCommit, index?: number): ConventionalCommit;

  getOverallReleaseType(): string;
  setOverallReleaseType(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SummarizeCommitsResult.AsObject;
  static toObject(includeInstance: boolean, msg: SummarizeCommitsResult): SummarizeCommitsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SummarizeCommitsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SummarizeCommitsResult;
  static deserializeBinaryFromReader(message: SummarizeCommitsResult, reader: jspb.BinaryReader): SummarizeCommitsResult;
}

export namespace SummarizeCommitsResult {
  export type AsObject = {
    total: number,
    countsByTypeList: Array<TypeCount.AsObject>,
    breakingChangesList: Array<ConventionalCommit.AsObject>,
    overallReleaseType: string,
    error: string,
  }
}

export class ValidateSubjectRequest extends jspb.Message {
  getSubject(): string;
  setSubject(value: string): void;

  getMaxLength(): number;
  setMaxLength(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateSubjectRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateSubjectRequest): ValidateSubjectRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidateSubjectRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateSubjectRequest;
  static deserializeBinaryFromReader(message: ValidateSubjectRequest, reader: jspb.BinaryReader): ValidateSubjectRequest;
}

export namespace ValidateSubjectRequest {
  export type AsObject = {
    subject: string,
    maxLength: number,
  }
}

export class ValidateSubjectResult extends jspb.Message {
  getValid(): boolean;
  setValid(value: boolean): void;

  clearIssuesList(): void;
  getIssuesList(): Array<ValidationIssue>;
  setIssuesList(value: Array<ValidationIssue>): void;
  addIssues(value?: ValidationIssue, index?: number): ValidationIssue;

  getLength(): number;
  setLength(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidateSubjectResult.AsObject;
  static toObject(includeInstance: boolean, msg: ValidateSubjectResult): ValidateSubjectResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidateSubjectResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidateSubjectResult;
  static deserializeBinaryFromReader(message: ValidateSubjectResult, reader: jspb.BinaryReader): ValidateSubjectResult;
}

export namespace ValidateSubjectResult {
  export type AsObject = {
    valid: boolean,
    issuesList: Array<ValidationIssue.AsObject>,
    length: number,
  }
}

