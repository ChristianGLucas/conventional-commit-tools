import { ParseCommitLogRequest } from '../gen/messages_pb';
import { parseCommitLog } from './parse_commit_log';
import { ctx, SPEC_EXAMPLES } from './testkit';

const DELIM = '\n===COMMIT===\n';

describe('ParseCommitLog', () => {
  it('parses a delimiter-joined log of every spec example, in order', () => {
    const log = SPEC_EXAMPLES.map((e) => e.message).join(DELIM);
    const input = new ParseCommitLogRequest();
    input.setLog(log);
    input.setDelimiter(DELIM);
    const result = parseCommitLog(ctx, input);
    expect(result.getError()).toBe('');
    expect(result.getCount()).toBe(SPEC_EXAMPLES.length);
    expect(result.getSkipped()).toBe(0);
    const types = result.getCommitsList().map((c) => c.getType());
    expect(types).toEqual(SPEC_EXAMPLES.map((e) => e.type));
  });

  it('ignores blank fragments left by consecutive delimiters', () => {
    const input = new ParseCommitLogRequest();
    input.setLog(`feat: a${DELIM}${DELIM}fix: b`);
    input.setDelimiter(DELIM);
    const result = parseCommitLog(ctx, input);
    expect(result.getCount()).toBe(2);
  });

  it('caps at max_commits and reports the rest as skipped', () => {
    const log = ['feat: a', 'feat: b', 'feat: c', 'feat: d'].join(DELIM);
    const input = new ParseCommitLogRequest();
    input.setLog(log);
    input.setDelimiter(DELIM);
    input.setMaxCommits(2);
    const result = parseCommitLog(ctx, input);
    expect(result.getCount()).toBe(2);
    expect(result.getSkipped()).toBe(2);
  });

  it('returns a structured error, not a crash, for an empty delimiter', () => {
    const input = new ParseCommitLogRequest();
    input.setLog('feat: a');
    input.setDelimiter('');
    expect(() => parseCommitLog(ctx, input)).not.toThrow();
    const result = parseCommitLog(ctx, input);
    expect(result.getError().length).toBeGreaterThan(0);
    expect(result.getCommitsList()).toEqual([]);
  });

  it('returns a structured error, not a crash, for an oversized log', () => {
    const input = new ParseCommitLogRequest();
    input.setLog('feat: a'.repeat(400_000));
    input.setDelimiter(DELIM);
    expect(() => parseCommitLog(ctx, input)).not.toThrow();
    const result = parseCommitLog(ctx, input);
    expect(result.getError()).toMatch(/longer than/);
  });
});
