import { ValidateCommitRequest } from '../gen/messages_pb';
import { validateCommit } from './validate_commit';
import { ctx, SPEC_EXAMPLES } from './testkit';

describe('ValidateCommit', () => {
  it.each(SPEC_EXAMPLES)('every spec example is valid: $name', (ex) => {
    const input = new ValidateCommitRequest();
    input.setMessage(ex.message);
    const result = validateCommit(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getIssuesList().filter((i) => i.getSeverity() === 'error')).toHaveLength(0);
  });

  it('flags a header with no colon as INVALID_HEADER_FORMAT', () => {
    const input = new ValidateCommitRequest();
    input.setMessage('this is not conventional at all');
    const result = validateCommit(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getIssuesList().map((i) => i.getCode())).toContain('INVALID_HEADER_FORMAT');
  });

  it('flags an uppercase type as TYPE_NOT_LOWERCASE by default', () => {
    const input = new ValidateCommitRequest();
    input.setMessage('Feat: add a thing');
    const result = validateCommit(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getIssuesList().map((i) => i.getCode())).toContain('TYPE_NOT_LOWERCASE');
  });

  it('accepts an uppercase type when allow_any_type_case is set', () => {
    const input = new ValidateCommitRequest();
    input.setMessage('Feat: add a thing');
    input.setAllowAnyTypeCase(true);
    const result = validateCommit(ctx, input);
    expect(result.getIssuesList().map((i) => i.getCode())).not.toContain('TYPE_NOT_LOWERCASE');
  });

  it('flags an empty subject as EMPTY_SUBJECT', () => {
    const input = new ValidateCommitRequest();
    input.setMessage('feat: ');
    const result = validateCommit(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getIssuesList().map((i) => i.getCode())).toContain('EMPTY_SUBJECT');
  });

  it('warns (does not error) on a breaking marker with no BREAKING CHANGE footer', () => {
    const input = new ValidateCommitRequest();
    input.setMessage('feat!: change the api');
    const result = validateCommit(ctx, input);
    expect(result.getValid()).toBe(true);
    const warning = result.getIssuesList().find((i) => i.getCode() === 'EMPTY_BREAKING_DESCRIPTION');
    expect(warning).toBeDefined();
    expect(warning!.getSeverity()).toBe('warning');
  });

  it('is invalid, not a crash, for an empty message', () => {
    const input = new ValidateCommitRequest();
    input.setMessage('');
    expect(() => validateCommit(ctx, input)).not.toThrow();
    const result = validateCommit(ctx, input);
    expect(result.getValid()).toBe(false);
  });
});
