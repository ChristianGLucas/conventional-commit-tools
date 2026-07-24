import { CommitMessageRequest, ParseCommitResult, ConventionalCommit } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseRawCommit, toConventionalCommit, errorMessage } from './lib';

/**
 * Parse one raw commit message into its full structured representation:
 * type, scope, subject, body, footer trailers, breaking-change marker/footer,
 * issue references, @mentions, and revert info (if it is a
 * `Revert "..."` commit). `commit.header_matched` is false when the first
 * line does not conform to Conventional Commits' "type(scope)!: subject"
 * form — every other field is still populated best-effort from whatever the
 * underlying parser (conventional-commits-parser) could extract, so a
 * non-conventional message still returns useful structure. `ok` is false
 * (with `error` set and `commit` at its zero value) only for a hard input
 * problem: an empty message. Deterministic; never throws.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseCommit(ax: AxiomContext, input: CommitMessageRequest): ParseCommitResult {
  const out = new ParseCommitResult();
  try {
    const raw = parseRawCommit(input.getMessage());
    out.setCommit(toConventionalCommit(raw));
    out.setOk(true);
    return out;
  } catch (e) {
    out.setOk(false);
    out.setError(errorMessage(e, 'parsing commit message'));
    out.setCommit(new ConventionalCommit());
    return out;
  }
}
