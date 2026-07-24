import { ValidateSubjectRequest } from '../gen/messages_pb';
import { validateSubject } from './validate_subject';
import { ctx } from './testkit';

describe('ValidateSubject', () => {
  it('a clean, short, lowercase subject is valid with no issues', () => {
    const input = new ValidateSubjectRequest();
    input.setSubject('add Polish language');
    const result = validateSubject(ctx, input);
    expect(result.getValid()).toBe(true);
    expect(result.getIssuesList()).toEqual([]);
    expect(result.getLength()).toBe(19);
  });

  it('flags an empty subject', () => {
    const input = new ValidateSubjectRequest();
    input.setSubject('');
    const result = validateSubject(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getIssuesList().map((i) => i.getCode())).toContain('EMPTY_SUBJECT');
  });

  it('flags a subject over the default 100-character max_length', () => {
    const input = new ValidateSubjectRequest();
    input.setSubject('a'.repeat(101));
    const result = validateSubject(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getIssuesList().map((i) => i.getCode())).toContain('TOO_LONG');
  });

  it('honors a caller-supplied max_length', () => {
    const input = new ValidateSubjectRequest();
    input.setSubject('a'.repeat(30));
    input.setMaxLength(20);
    const result = validateSubject(ctx, input);
    expect(result.getIssuesList().map((i) => i.getCode())).toContain('TOO_LONG');
  });

  it('flags a trailing period', () => {
    const input = new ValidateSubjectRequest();
    input.setSubject('add a thing.');
    const result = validateSubject(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getIssuesList().map((i) => i.getCode())).toContain('TRAILING_PERIOD');
  });

  it('flags leading/trailing whitespace', () => {
    const input = new ValidateSubjectRequest();
    input.setSubject('  add a thing');
    const result = validateSubject(ctx, input);
    expect(result.getValid()).toBe(false);
    expect(result.getIssuesList().map((i) => i.getCode())).toContain('LEADING_OR_TRAILING_WHITESPACE');
  });

  it('warns (does not error) on a capitalized first letter', () => {
    const input = new ValidateSubjectRequest();
    input.setSubject('Add a thing');
    const result = validateSubject(ctx, input);
    expect(result.getValid()).toBe(true);
    const warning = result.getIssuesList().find((i) => i.getCode() === 'CAPITALIZED_FIRST_LETTER');
    expect(warning).toBeDefined();
    expect(warning!.getSeverity()).toBe('warning');
  });
});
