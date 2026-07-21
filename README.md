# conventional-commit-tools

Composable Axiom nodes for deterministic parsing, validation, and structured
extraction of commit messages that follow the
[Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
specification — type, scope, subject/body, breaking-change markers and
footers, issue references, and semver release-type inference. Built for
release automation, changelog generation, and commit-history analysis
agents.

Every node is a pure, stateless, deterministic function: the commit message
is always supplied as text by the caller (no git repo access, no network, no
wall-clock, no randomness). A malformed or non-conventional message returns
a structured result, never a crash.

Wraps the parsing engine of
[`conventional-commits-parser`](https://www.npmjs.com/package/conventional-commits-parser)
(MIT, the parser used by the conventional-changelog toolchain), vendored as
a CommonJS build — see `vendor/conventional-commits-parser/NOTICE.md` for
why and how.

## Nodes

| Node | What it does |
|---|---|
| `ParseCommit` | Full structured parse: type, scope, subject, body, footers, breaking-change info, issue references, mentions, revert info. |
| `ValidateCommit` | Validates a message against the Conventional Commits spec and reports exactly why it fails. |
| `ExtractType` | Extracts just the commit type (`feat`, `fix`, `docs`, ...). |
| `ExtractScope` | Extracts just the parenthesized scope. |
| `DetectBreakingChange` | Detects a `!` marker and/or `BREAKING CHANGE:` footer, and the breaking description. |
| `ExtractFooters` | Extracts every footer/trailer as token/value pairs. |
| `ExtractIssueReferences` | Extracts every issue/PR reference (`#123`, `Closes #45`, `owner/repo#123`). |
| `DetermineReleaseType` | Determines the semver release type a commit implies (`major`/`minor`/`patch`/`none`) — composes directly with `semver-tools`' `Increment` node. |
| `ParseCommitLog` | Parses a delimiter-separated blob of multiple commit messages into structured commits. |
| `SummarizeCommits` | Summarizes a multi-commit log for changelog generation: counts by type, breaking changes, overall release type. |
| `SplitHeaderBody` | Splits any message (conventional or not) into header + body. |
| `ParseRevert` | Detects a git-generated revert commit and extracts the reverted header/hash. |
| `ExtractMentions` | Extracts every `@mention` for changelog attribution. |
| `ValidateSubject` | Validates a subject line: length, trailing period, whitespace, capitalization. |

## License

MIT — see `LICENSE`. Built for the Axiom marketplace.
