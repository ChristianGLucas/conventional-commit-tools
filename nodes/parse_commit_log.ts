import { ParseCommitLogRequest, ParseCommitLogResult, ConventionalCommit } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { splitLog, parseRawCommit, toConventionalCommit, placeholderCommit } from './lib';

/**
 * Parse a blob of multiple commit messages — separated by a caller-supplied
 * `delimiter` (required; e.g. "\n---\n" or a git-log-friendly separator) —
 * into an array of structured commits, in order. `max_commits` (<= 0 uses a
 * default of 500) caps how many fragments are parsed; anything beyond the
 * cap — and always beyond a hard ceiling of 2000, regardless of what's
 * requested — is counted in `skipped`, not parsed. The whole log is bounded
 * at 2,000,000 characters. A fragment that fails to parse (essentially only
 * possible via an individually oversized fragment) still yields a
 * best-effort commit with `header_matched=false` rather than being dropped.
 * `error` is set (with empty `commits`) only for a log-level problem: an
 * empty `delimiter`, or the log exceeding the size bound. Deterministic;
 * never throws.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseCommitLog(ax: AxiomContext, input: ParseCommitLogRequest): ParseCommitLogResult {
  const out = new ParseCommitLogResult();
  const { messages, skipped, error } = splitLog(input.getLog(), input.getDelimiter(), input.getMaxCommits());
  if (error) {
    out.setError(error);
    out.setCount(0);
    out.setSkipped(0);
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
  out.setSkipped(skipped);
  return out;
}
