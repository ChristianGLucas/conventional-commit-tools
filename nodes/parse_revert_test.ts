import { CommitMessageRequest } from '../gen/messages_pb';
import { parseRevert } from './parse_revert';
import { ctx } from './testkit';

describe('ParseRevert', () => {
  it('detects a standard git revert commit and extracts header + hash', () => {
    const input = new CommitMessageRequest();
    input.setMessage('Revert "feat: add foo"\n\nThis reverts commit abc1234567890.');
    const result = parseRevert(ctx, input);
    expect(result.getIsRevert()).toBe(true);
    expect(result.getRevertedHeader()).toBe('feat: add foo');
    expect(result.getRevertedHash()).toBe('abc1234567890');
  });

  it('is_revert=false for an ordinary commit', () => {
    const input = new CommitMessageRequest();
    input.setMessage('feat: add a thing');
    const result = parseRevert(ctx, input);
    expect(result.getIsRevert()).toBe(false);
    expect(result.getRevertedHeader()).toBe('');
    expect(result.getRevertedHash()).toBe('');
  });

  it('is_revert=false, not a crash, for an empty message', () => {
    const input = new CommitMessageRequest();
    input.setMessage('');
    expect(() => parseRevert(ctx, input)).not.toThrow();
    expect(parseRevert(ctx, input).getIsRevert()).toBe(false);
  });
});
