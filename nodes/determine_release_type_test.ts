import { CommitMessageRequest } from '../gen/messages_pb';
import { determineReleaseType } from './determine_release_type';
import { ctx, SPEC_EXAMPLES } from './testkit';

describe('DetermineReleaseType', () => {
  it.each(SPEC_EXAMPLES)('matches the spec example: $name -> $releaseType', (ex) => {
    const input = new CommitMessageRequest();
    input.setMessage(ex.message);
    const result = determineReleaseType(ctx, input);
    expect(result.getReleaseType()).toBe(ex.releaseType);
  });

  it('a breaking fix is still "major" (breaking outranks type)', () => {
    const input = new CommitMessageRequest();
    input.setMessage('fix(core)!: change the return shape\n\nBREAKING CHANGE: callers must update.');
    const result = determineReleaseType(ctx, input);
    expect(result.getReleaseType()).toBe('major');
  });

  it('"none" with a reason for an unrecognized type', () => {
    const input = new CommitMessageRequest();
    input.setMessage('chore: bump dependency');
    const result = determineReleaseType(ctx, input);
    expect(result.getReleaseType()).toBe('none');
    expect(result.getReason().length).toBeGreaterThan(0);
  });

  it('"none", not a crash, for an empty message', () => {
    const input = new CommitMessageRequest();
    input.setMessage('');
    expect(() => determineReleaseType(ctx, input)).not.toThrow();
    expect(determineReleaseType(ctx, input).getReleaseType()).toBe('none');
  });
});
