import { SummarizeCommitsRequest, SummarizeCommitsResult, ConventionalCommit, TypeCount } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { splitLog, parseRawCommit, toConventionalCommit, placeholderCommit, releaseTypeFor } from './lib';

const RELEASE_RANK: Record<string, number> = { major: 3, minor: 2, patch: 1, none: 0 };

/**
 * Summarize a multi-commit log (same `log`/`delimiter`/`max_commits`
 * contract as ParseCommitLog) for changelog generation: `total` commits
 * parsed, a count per commit type, the full list of breaking-change commits,
 * and `overall_release_type` — the highest-precedence release type implied
 * by the set (major > minor > patch > none), i.e. the one version bump the
 * whole batch would justify. A commit type of "" (header didn't match
 * Conventional Commits form) is counted under "(none)". `error` is set (with
 * every other field at its zero value) only for a log-level problem: an
 * empty `delimiter`, or the log exceeding the 2,000,000-character bound.
 * Deterministic; never throws.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function summarizeCommits(ax: AxiomContext, input: SummarizeCommitsRequest): SummarizeCommitsResult {
  const out = new SummarizeCommitsResult();
  const { messages, skipped, error } = splitLog(input.getLog(), input.getDelimiter(), input.getMaxCommits());
  if (error) {
    out.setError(error);
    return out;
  }

  const counts = new Map<string, number>();
  const breaking: ConventionalCommit[] = [];
  let overall = 'none';

  for (const msg of messages) {
    let commit: ConventionalCommit;
    try {
      commit = toConventionalCommit(parseRawCommit(msg));
    } catch {
      commit = placeholderCommit(msg);
    }

    const type = commit.getType() || '(none)';
    counts.set(type, (counts.get(type) ?? 0) + 1);
    if (commit.getBreaking()) breaking.push(commit);

    const { releaseType } = releaseTypeFor(commit.getType(), commit.getBreaking());
    if (RELEASE_RANK[releaseType] > RELEASE_RANK[overall]) overall = releaseType;
  }

  const countsByType: TypeCount[] = Array.from(counts.entries()).map(([type, count]) => {
    const tc = new TypeCount();
    tc.setType(type);
    tc.setCount(count);
    return tc;
  });

  out.setTotal(messages.length);
  out.setCountsByTypeList(countsByType);
  out.setBreakingChangesList(breaking);
  out.setOverallReleaseType(overall);
  out.setSkipped(skipped);
  return out;
}
