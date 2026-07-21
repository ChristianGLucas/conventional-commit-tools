// Shared parsing, bounds, and small helpers for the conventional-commit-tools
// nodes. Not a node and not a test file, so it is neither registered nor
// collected by `axiom validate`/`axiom test`.
//
// The algorithmically hard part — tokenizing a raw commit message into
// header/body/footer/notes/mentions/references/revert — is entirely owned by
// conventional-commits-parser (the parser used by the conventional-changelog
// toolchain, MIT). What lives here is: (a) one shared, correctly-configured
// CommitParser instance (its default options target the legacy AngularJS
// commit convention, not the Conventional Commits v1.0.0 spec's `!` breaking
// marker — see HEADER_PATTERN below), (b) turning its raw output into this
// package's canonical ConventionalCommit message, (c) a small amount of
// genuinely new glue the library does not do at all: splitting its footer
// blob into structured token/value trailers per the spec's footer grammar,
// and deriving a semver release-type from type+breaking. None of this
// re-implements anything the library already does — it is composition atop
// an already-isolated footer string / already-computed fields.
//
// conventional-commits-parser@7 ships ESM-only (package.json "type":
// "module", exports map with no "require" condition) while this package
// compiles to CommonJS (Axiom's frozen TS node signature/build). Two normal
// approaches were tried and both failed for real, verified reasons before
// landing on this one:
//   1. A static `import` compiles to `require()` under `module: "commonjs"`,
//      which Node rejects with ERR_PACKAGE_PATH_NOT_EXPORTED (no "require"
//      export condition).
//   2. A dynamic `import()` hidden from TypeScript's CJS rewrite (via
//      `new Function('s','return import(s)')`) DOES work under a plain
//      `node` process (confirmed by hand) — but fails under `axiom test`'s
//      Jest runner with "A dynamic import callback was invoked without
//      --experimental-vm-modules", a Jest sandboxing limitation this
//      package cannot configure around (`axiom test` invokes the jest
//      binary directly, not through a package.json script where a
//      NODE_OPTIONS override could be injected).
// The fix that works in both the test runner and the deployed runtime:
// `vendor/conventional-commits-parser/index.cjs` is CommitParser.js (the
// ~450-line parsing engine this package actually uses — the class has ZERO
// external dependencies of its own; only the package's separate stream.js/
// CLI entry points pull in @simple-libs/stream-utils and argue-cli, which
// this package never imports) rebuilt from the installed
// conventional-commits-parser@7.1.0 into plain CommonJS with `esbuild
// --bundle --format=cjs` — a pure module-format transpile, not a rewrite:
// every line of parsing logic is byte-for-byte the same algorithm, just
// syntactically CommonJS instead of ESM. The upstream MIT LICENSE.md is
// copied alongside it for attribution. This is `require()`-d directly below
// like any ordinary CJS dependency — no dynamic import, no async voodoo,
// works identically under Jest, `axiom dev`, and the deployed sidecar.
import {
  ConventionalCommit,
  Footer,
  IssueReference,
  ValidationIssue,
} from '../gen/messages_pb';

interface CommitParserInstance {
  parse(input: string): unknown;
}
type CommitParserCtor = new (options: Record<string, unknown>) => CommitParserInstance;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { CommitParser } = require('../vendor/conventional-commits-parser/index.cjs') as {
  CommitParser: CommitParserCtor;
};

/** Ceiling for a single raw commit message. Real commit messages (even a
 * verbose one with a full body and several footers) are well under a few KB;
 * this leaves generous headroom while still bounding parse cost on the raw
 * input, before any regex work runs. */
export const MAX_MESSAGE_CHARS = 100_000;

/** Ceiling for a multi-commit log blob (ParseCommitLog / SummarizeCommits). */
export const MAX_LOG_CHARS = 2_000_000;

/** Default cap on how many commits ParseCommitLog/SummarizeCommits will
 * parse when the caller passes max_commits <= 0. */
export const DEFAULT_MAX_COMMITS = 500;

/** Absolute cap on commits parsed per call, regardless of what the caller
 * requests via max_commits — protects against an adversarially large
 * max_commits value driving unbounded work. */
export const HARD_MAX_COMMITS = 2000;

/** Default subject max length, matching commitlint's common
 * header-max-length convention. */
export const DEFAULT_SUBJECT_MAX_LENGTH = 100;

/** Defense-in-depth ceiling on a single subject string, independent of the
 * caller-supplied max_length (which only controls the *validation* rule). */
export const MAX_SUBJECT_CHARS = 20_000;

export class BoundsError extends Error {}

export function checkMessageLen(message: string): void {
  if (message.length > MAX_MESSAGE_CHARS) {
    throw new BoundsError(`message is longer than ${MAX_MESSAGE_CHARS} characters`);
  }
}

export function errorMessage(e: unknown, context: string): string {
  if (e instanceof Error) {
    return `${context}: ${e.message}`;
  }
  return `${context}: ${String(e)}`;
}

export function mkIssue(code: string, message: string, severity: 'error' | 'warning'): ValidationIssue {
  const vi = new ValidationIssue();
  vi.setCode(code);
  vi.setMessage(message);
  vi.setSeverity(severity);
  return vi;
}

// The library's own default headerPattern (`/^(\w*)(?:\((.*)\))?: (.*)$/`,
// AngularJS-era) has no capture group for the Conventional Commits v1.0.0
// `!` breaking-change marker (e.g. "feat(api)!: ..."), so a `!`-marked
// header simply fails to match at all under the defaults. This override adds
// an explicit optional 4th group for it, captured into a `breaking` field
// alongside type/scope/subject. fieldPattern is explicitly disabled (it
// targets the legacy AngularJS "-Reviewed-by-" dash-wrapped field
// convention, not the "token: value" / "token #value" footer trailer syntax
// this package parses itself via parseFooters below).
const HEADER_PATTERN = /^(\w*)(?:\(([\w$@.\-*/ ]*)\))?(!)?: (.*)$/;
const HEADER_CORRESPONDENCE = ['type', 'scope', 'breaking', 'subject'];

let sharedParser: CommitParserInstance | null = null;
function getParser(): CommitParserInstance {
  if (!sharedParser) {
    sharedParser = new CommitParser({
      headerPattern: HEADER_PATTERN,
      headerCorrespondence: HEADER_CORRESPONDENCE,
      fieldPattern: undefined,
    });
  }
  return sharedParser;
}

export interface RawReference {
  raw: string;
  action: string | null;
  owner: string | null;
  repository: string | null;
  issue: string;
  prefix: string;
}

export interface RawCommit {
  header: string | null;
  body: string | null;
  footer: string | null;
  notes: { title: string; text: string }[];
  mentions: string[];
  references: RawReference[];
  revert: { header?: string | null; hash?: string | null } | null;
  type?: string | null;
  scope?: string | null;
  breaking?: string | null;
  subject?: string | null;
}

/**
 * Parse one raw commit message with the shared, spec-configured
 * CommitParser. Throws BoundsError on an oversized message and a plain Error
 * ("empty commit message") on blank input — conventional-commits-parser
 * itself throws a bare TypeError on blank input; this normalizes both cases
 * so every node's catch block produces one consistent, structured failure
 * mode instead of leaking the library's own exception type.
 */
export function parseRawCommit(message: string): RawCommit {
  checkMessageLen(message);
  if (!message.trim()) {
    throw new Error('empty commit message');
  }
  return getParser().parse(message) as unknown as RawCommit;
}

// Matches the first line of a NEW footer trailer: "Token: value" (spec form)
// or "Token #value" (the alternate hash form the spec allows for issue-style
// trailers, e.g. "Closes #123"). "BREAKING CHANGE" is the one two-word
// token the spec permits; every other token is a single hyphen-joined word.
const TRAILER_COLON = /^([A-Za-z][A-Za-z0-9-]*|BREAKING CHANGE): (.*)$/;
const TRAILER_HASH = /^([A-Za-z][A-Za-z0-9-]*|BREAKING CHANGE) (#.*)$/;

/**
 * Split a footer blob (conventional-commits-parser's already-isolated
 * `footer` string — everything after the body that looked like footer
 * material) into structured token/value trailers. A line that does not
 * start a new trailer is folded into the previous trailer's value as a
 * continuation line (joined by "\n"), matching git's own trailer-folding
 * behavior; a blank line ends the current trailer's continuation.
 */
export function parseFooters(footerRaw: string | null | undefined): Footer[] {
  const footers: Footer[] = [];
  if (!footerRaw) return footers;
  let current: Footer | null = null;
  for (const line of footerRaw.split(/\r?\n/)) {
    if (line.trim() === '') {
      current = null;
      continue;
    }
    const m = line.match(TRAILER_COLON) || line.match(TRAILER_HASH);
    if (m) {
      const f = new Footer();
      f.setToken(m[1]);
      f.setValue(m[2]);
      footers.push(f);
      current = f;
    } else if (current) {
      current.setValue(`${current.getValue()}\n${line}`);
    }
  }
  return footers;
}

/**
 * Whether a parsed commit is a breaking change, its description, and how it
 * was signaled: the `!` marker after type/scope, a `BREAKING CHANGE:` (or
 * `BREAKING-CHANGE:`) footer note, or both. Either signal alone is
 * sufficient per the Conventional Commits v1.0.0 spec.
 */
export function computeBreaking(raw: RawCommit): { breaking: boolean; description: string; source: string } {
  const markerBreaking = raw.breaking === '!';
  const note = raw.notes.find((n) => /^BREAKING[ -]CHANGE$/i.test(n.title));
  const footerBreaking = !!note;
  let source = 'none';
  if (markerBreaking && footerBreaking) source = 'both';
  else if (markerBreaking) source = 'marker';
  else if (footerBreaking) source = 'footer';
  return { breaking: markerBreaking || footerBreaking, description: note ? note.text : '', source };
}

/**
 * The semver release type a commit implies, using the same vocabulary as
 * semver-tools' Increment node (release_type = "major"/"minor"/"patch", plus
 * "none" for a commit that implies no release) so the two packages compose:
 * breaking -> major, feat -> minor, fix -> patch, everything else -> none.
 */
export function releaseTypeFor(type: string, breaking: boolean): { releaseType: string; reason: string } {
  if (breaking) return { releaseType: 'major', reason: 'breaking change' };
  const t = (type || '').toLowerCase();
  if (t === 'feat') return { releaseType: 'minor', reason: 'feat commit' };
  if (t === 'fix') return { releaseType: 'patch', reason: 'fix commit' };
  return {
    releaseType: 'none',
    reason: t ? `"${t}" commits do not trigger a release` : 'no recognized type',
  };
}

function toIssueReference(r: RawReference): IssueReference {
  const ir = new IssueReference();
  ir.setRaw(r.raw ?? '');
  ir.setAction(r.action ?? '');
  ir.setIssue(r.issue ?? '');
  ir.setPrefix(r.prefix ?? '');
  ir.setOwner(r.owner ?? '');
  ir.setRepository(r.repository ?? '');
  return ir;
}

/** Convert conventional-commits-parser's raw output into this package's
 * canonical ConventionalCommit message. `header_matched` is false when the
 * first line did not conform to "type(scope)!: subject" — every other field
 * (body, footer, notes, references, mentions, revert) is still populated
 * from whatever the library could extract, so a non-conventional message
 * still returns useful best-effort structure rather than an all-empty one. */
export function toConventionalCommit(raw: RawCommit): ConventionalCommit {
  const out = new ConventionalCommit();
  out.setHeader(raw.header ?? '');
  out.setHeaderMatched(raw.type !== undefined && raw.type !== null);
  out.setType(raw.type ?? '');
  out.setScope(raw.scope ?? '');
  const { breaking, description, source } = computeBreaking(raw);
  out.setBreaking(breaking);
  out.setBreakingDescription(description);
  out.setBreakingSource(source);
  out.setSubject(raw.subject ?? '');
  out.setBody(raw.body ?? '');
  out.setFooterRaw(raw.footer ?? '');
  out.setFootersList(parseFooters(raw.footer));
  out.setReferencesList((raw.references ?? []).map(toIssueReference));
  out.setMentionsList(raw.mentions ?? []);
  out.setIsRevert(raw.revert != null);
  out.setRevertHeader(raw.revert?.header ?? '');
  out.setRevertHash(raw.revert?.hash ?? '');
  return out;
}

/** Best-effort ConventionalCommit for a fragment that failed to parse (e.g.
 * a blank fragment surviving the split, or one exceeding MAX_MESSAGE_CHARS)
 * inside a multi-commit log — keeps ParseCommitLog/SummarizeCommits at
 * "structured result, never throws" even per-fragment. */
export function placeholderCommit(fragment: string): ConventionalCommit {
  const c = new ConventionalCommit();
  c.setHeader((fragment.split(/\r?\n/)[0] ?? '').slice(0, 500));
  c.setHeaderMatched(false);
  return c;
}

/**
 * Split a multi-commit log blob on a caller-supplied delimiter into
 * individual commit-message fragments, bounded on both total log size and
 * commit count. `max_commits <= 0` uses DEFAULT_MAX_COMMITS; any requested
 * value is clamped to HARD_MAX_COMMITS regardless, and fragments beyond the
 * cap are counted in `skipped`, not parsed.
 */
export function splitLog(
  log: string,
  delimiter: string,
  maxCommits: number,
): { messages: string[]; skipped: number; error?: string } {
  if (log.length > MAX_LOG_CHARS) {
    return { messages: [], skipped: 0, error: `log is longer than ${MAX_LOG_CHARS} characters` };
  }
  if (!delimiter) {
    return { messages: [], skipped: 0, error: 'delimiter must not be empty' };
  }
  const cap = maxCommits > 0 ? Math.min(maxCommits, HARD_MAX_COMMITS) : DEFAULT_MAX_COMMITS;
  const parts = log
    .split(delimiter)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const messages = parts.slice(0, cap);
  return { messages, skipped: parts.length - messages.length };
}
