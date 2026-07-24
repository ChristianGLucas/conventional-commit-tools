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

  it('returns a structured error, not a crash, for an empty delimiter', () => {
    const input = new ParseCommitLogRequest();
    input.setLog('feat: a');
    input.setDelimiter('');
    expect(() => parseCommitLog(ctx, input)).not.toThrow();
    const result = parseCommitLog(ctx, input);
    expect(result.getError().length).toBeGreaterThan(0);
    expect(result.getCommitsList()).toEqual([]);
  });
});
