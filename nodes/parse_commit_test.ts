import { CommitMessageRequest } from '../gen/messages_pb';
import { parseCommit } from './parse_commit';
import { ctx, SPEC_EXAMPLES } from './testkit';

describe('ParseCommit', () => {
  it.each(SPEC_EXAMPLES)('matches the spec example: $name', (ex) => {
    const input = new CommitMessageRequest();
    input.setMessage(ex.message);
    const result = parseCommit(ctx, input);
    expect(result.getOk()).toBe(true);
    const commit = result.getCommit()!;
    expect(commit.getType()).toBe(ex.type);
    expect(commit.getScope()).toBe(ex.scope);
    expect(commit.getBreaking()).toBe(ex.breaking);
    expect(commit.getBreakingSource()).toBe(ex.breakingSource);
    expect(commit.getSubject()).toBe(ex.subject);
    expect(commit.getHeaderMatched()).toBe(true);
  });

  it('extracts footer trailers and issue references from a full example', () => {
    const input = new CommitMessageRequest();
    input.setMessage(
      'fix(parser): handle empty scope\n\n' +
        'This fixes a crash when scope is empty.\n\n' +
        'Closes #99\n' +
        'Refs #100\n' +
        'Reviewed-by: Bob',
    );
    const result = parseCommit(ctx, input);
    const commit = result.getCommit()!;
    expect(commit.getBody()).toBe('This fixes a crash when scope is empty.');
    const footers = commit.getFootersList().map((f) => [f.getToken(), f.getValue()]);
    expect(footers).toEqual([
      ['Closes', '#99'],
      ['Refs', '#100'],
      ['Reviewed-by', 'Bob'],
    ]);
    const refs = commit.getReferencesList().map((r) => r.getIssue());
    expect(refs).toContain('99');
    expect(refs).toContain('100');
  });

  it('extracts @mentions', () => {
    const input = new CommitMessageRequest();
    input.setMessage('fix: thanks @octocat and @foo-bar for the report');
    const commit = parseCommit(ctx, input).getCommit()!;
    expect(commit.getMentionsList()).toEqual(['octocat', 'foo-bar']);
  });

  it('parses a revert commit and reports the reverted header/hash', () => {
    const input = new CommitMessageRequest();
    input.setMessage('Revert "feat: add foo"\n\nThis reverts commit abc1234.');
    const commit = parseCommit(ctx, input).getCommit()!;
    expect(commit.getIsRevert()).toBe(true);
    expect(commit.getRevertHeader()).toBe('feat: add foo');
    expect(commit.getRevertHash()).toBe('abc1234');
    // A revert's own header doesn't conform to type(scope)!: subject.
    expect(commit.getHeaderMatched()).toBe(false);
  });

  it('returns header_matched=false, not a crash, for a non-conventional message', () => {
    const input = new CommitMessageRequest();
    input.setMessage('just a message with no colon');
    const result = parseCommit(ctx, input);
    expect(result.getOk()).toBe(true);
    const commit = result.getCommit()!;
    expect(commit.getHeaderMatched()).toBe(false);
    expect(commit.getType()).toBe('');
    expect(commit.getHeader()).toBe('just a message with no colon');
  });

  it('returns ok=false with a structured error for an empty message, never throws', () => {
    const input = new CommitMessageRequest();
    input.setMessage('');
    expect(() => parseCommit(ctx, input)).not.toThrow();
    const result = parseCommit(ctx, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError().length).toBeGreaterThan(0);
  });

  it('returns ok=false for a whitespace-only message', () => {
    const input = new CommitMessageRequest();
    input.setMessage('   \n  \n ');
    const result = parseCommit(ctx, input);
    expect(result.getOk()).toBe(false);
  });

  it('returns ok=false with a structured error for an oversized message, never throws', () => {
    const input = new CommitMessageRequest();
    input.setMessage('feat: ' + 'a'.repeat(200_000));
    expect(() => parseCommit(ctx, input)).not.toThrow();
    const result = parseCommit(ctx, input);
    expect(result.getOk()).toBe(false);
    expect(result.getError()).toMatch(/longer than/);
  });

  it('is deterministic: calling twice with the same input yields identical output', () => {
    const input = new CommitMessageRequest();
    input.setMessage('feat(api)!: remove legacy endpoint\n\nBREAKING CHANGE: gone');
    const r1 = parseCommit(ctx, input);
    const r2 = parseCommit(ctx, input);
    expect(r1.getCommit()!.toObject()).toEqual(r2.getCommit()!.toObject());
  });
});
