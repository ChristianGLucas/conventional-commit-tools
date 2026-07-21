import { CommitMessageRequest } from '../gen/messages_pb';
import { extractType } from './extract_type';
import { ctx, SPEC_EXAMPLES } from './testkit';

describe('ExtractType', () => {
  it.each(SPEC_EXAMPLES)('extracts the type from the spec example: $name', (ex) => {
    const input = new CommitMessageRequest();
    input.setMessage(ex.message);
    const result = extractType(ctx, input);
    expect(result.getType()).toBe(ex.type);
    expect(result.getFound()).toBe(true);
  });

  it('found=false, type="" for a non-conventional message', () => {
    const input = new CommitMessageRequest();
    input.setMessage('no colon here at all');
    const result = extractType(ctx, input);
    expect(result.getFound()).toBe(false);
    expect(result.getType()).toBe('');
  });

  it('found=false, not a crash, for an empty message', () => {
    const input = new CommitMessageRequest();
    input.setMessage('');
    expect(() => extractType(ctx, input)).not.toThrow();
    expect(extractType(ctx, input).getFound()).toBe(false);
  });
});
