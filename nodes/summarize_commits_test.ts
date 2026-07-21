import { SummarizeCommitsRequest } from '../gen/messages_pb';
import { summarizeCommits } from './summarize_commits';
import { ctx } from './testkit';

const DELIM = '\n===COMMIT===\n';

describe('SummarizeCommits', () => {
  it('counts by type and finds the one breaking change', () => {
    const log = [
      'feat: add thing one',
      'fix: fix thing two',
      'fix: fix thing three',
      'docs: update readme',
      'feat(api)!: remove legacy endpoint\n\nBREAKING CHANGE: the /v1 endpoint is gone',
    ].join(DELIM);
    const input = new SummarizeCommitsRequest();
    input.setLog(log);
    input.setDelimiter(DELIM);
    const result = summarizeCommits(ctx, input);

    expect(result.getTotal()).toBe(5);
    const counts = Object.fromEntries(result.getCountsByTypeList().map((c) => [c.getType(), c.getCount()]));
    expect(counts).toEqual({ feat: 2, fix: 2, docs: 1 });
    expect(result.getBreakingChangesList()).toHaveLength(1);
    expect(result.getBreakingChangesList()[0].getScope()).toBe('api');
    // A breaking change is present -> overall release type must be "major"
    // regardless of the other commits present (major > minor > patch > none).
    expect(result.getOverallReleaseType()).toBe('major');
  });

  it('overall_release_type is the highest-precedence type present, with no breaking changes', () => {
    const log = ['fix: a bug', 'docs: a doc', 'chore: housekeeping'].join(DELIM);
    const input = new SummarizeCommitsRequest();
    input.setLog(log);
    input.setDelimiter(DELIM);
    const result = summarizeCommits(ctx, input);
    expect(result.getOverallReleaseType()).toBe('patch');
    expect(result.getBreakingChangesList()).toEqual([]);
  });

  it('overall_release_type is "none" when nothing implies a release', () => {
    const log = ['docs: a doc', 'chore: housekeeping'].join(DELIM);
    const input = new SummarizeCommitsRequest();
    input.setLog(log);
    input.setDelimiter(DELIM);
    const result = summarizeCommits(ctx, input);
    expect(result.getOverallReleaseType()).toBe('none');
  });

  it('non-conventional fragments are counted under "(none)"', () => {
    const log = ['not conventional at all', 'feat: a real one'].join(DELIM);
    const input = new SummarizeCommitsRequest();
    input.setLog(log);
    input.setDelimiter(DELIM);
    const result = summarizeCommits(ctx, input);
    const counts = Object.fromEntries(result.getCountsByTypeList().map((c) => [c.getType(), c.getCount()]));
    expect(counts['(none)']).toBe(1);
    expect(counts['feat']).toBe(1);
  });

  it('returns a structured error, not a crash, for an empty delimiter', () => {
    const input = new SummarizeCommitsRequest();
    input.setLog('feat: a');
    input.setDelimiter('');
    expect(() => summarizeCommits(ctx, input)).not.toThrow();
    expect(summarizeCommits(ctx, input).getError().length).toBeGreaterThan(0);
  });
});
