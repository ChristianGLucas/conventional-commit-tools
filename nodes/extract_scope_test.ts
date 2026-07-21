import { CommitMessageRequest } from '../gen/messages_pb';
import { extractScope } from './extract_scope';
import { ctx, SPEC_EXAMPLES } from './testkit';

describe('ExtractScope', () => {
  it.each(SPEC_EXAMPLES)('extracts the scope from the spec example: $name', (ex) => {
    const input = new CommitMessageRequest();
    input.setMessage(ex.message);
    const result = extractScope(ctx, input);
    expect(result.getScope()).toBe(ex.scope);
    expect(result.getFound()).toBe(ex.scope.length > 0);
  });

  it('found=false, scope="" when the header has no scope', () => {
    const input = new CommitMessageRequest();
    input.setMessage('docs: correct spelling of CHANGELOG');
    const result = extractScope(ctx, input);
    expect(result.getFound()).toBe(false);
    expect(result.getScope()).toBe('');
  });

  it('found=false, not a crash, for an empty message', () => {
    const input = new CommitMessageRequest();
    input.setMessage('');
    expect(() => extractScope(ctx, input)).not.toThrow();
    expect(extractScope(ctx, input).getFound()).toBe(false);
  });
});
