import { ParseCommitLogRequest, ParseCommitLogResult, ConventionalCommit } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { splitLog, parseRawCommit, toConventionalCommit, placeholderCommit } from './lib';

/**
 * Parse a blob of multiple commit messages — separated by a caller-supplied
 * `delimiter` (required; e.g. "\n---\n" or a git-log-friendly separator) —
 * into an array of structured commits, in order. A fragment that fails to
 * parse still yields a best-effort commit with `header_matched=false` rather
 * than being dropped. `error` is set (with empty `commits`) only for a
 * log-level problem: an empty `delimiter`. Deterministic; never throws.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseCommitLog(ax: AxiomContext, input: ParseCommitLogRequest): ParseCommitLogResult {
  const out = new ParseCommitLogResult();
  const { messages, error } = splitLog(input.getLog(), input.getDelimiter());
  if (error) {
    out.setError(error);
    out.setCount(0);
    out.setCommitsList([]);
    return out;
  }

  const commits: ConventionalCommit[] = messages.map((msg) => {
    try {
      return toConventionalCommit(parseRawCommit(msg));
    } catch {
      return placeholderCommit(msg);
    }
  });

  out.setCommitsList(commits);
  out.setCount(commits.length);
  return out;
}
