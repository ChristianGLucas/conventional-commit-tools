import { CommitMessageRequest } from '../gen/messages_pb';
import { detectBreakingChange } from './detect_breaking_change';
import { ctx, SPEC_EXAMPLES } from './testkit';

describe('DetectBreakingChange', () => {
  it.each(SPEC_EXAMPLES)('matches the spec example: $name', (ex) => {
    const input = new CommitMessageRequest();
    input.setMessage(ex.message);
    const result = detectBreakingChange(ctx, input);
    expect(result.getBreaking()).toBe(ex.breaking);
    expect(result.getSource()).toBe(ex.breakingSource);
  });

  it('extracts the BREAKING CHANGE footer description', () => {
    const input = new CommitMessageRequest();
    input.setMessage(
      'feat: allow provided config object to extend other configs\n\n' +
        'BREAKING CHANGE: `extends` key in config file is now used for extending other config files',
    );
    const result = detectBreakingChange(ctx, input);
    expect(result.getBreaking()).toBe(true);
    expect(result.getDescription()).toBe('`extends` key in config file is now used for extending other config files');
  });

  it('breaking=false, source="none", not a crash, for an empty message', () => {
    const input = new CommitMessageRequest();
    input.setMessage('');
    expect(() => detectBreakingChange(ctx, input)).not.toThrow();
    const result = detectBreakingChange(ctx, input);
    expect(result.getBreaking()).toBe(false);
    expect(result.getSource()).toBe('none');
  });
});
