import { CommitMessageRequest } from '../gen/messages_pb';
import { extractIssueReferences } from './extract_issue_references';
import { ctx } from './testkit';

describe('ExtractIssueReferences', () => {
  it('extracts a "Closes #N" reference with its action', () => {
    const input = new CommitMessageRequest();
    input.setMessage('fix(parser): handle empty scope\n\nCloses #99');
    const result = extractIssueReferences(ctx, input);
    const refs = result.getReferencesList();
    expect(refs).toHaveLength(1);
    expect(refs[0].getIssue()).toBe('99');
    expect(refs[0].getAction()).toBe('Closes');
    expect(refs[0].getPrefix()).toBe('#');
  });

  it('extracts a bare "#N" reference in the header with no action', () => {
    const input = new CommitMessageRequest();
    input.setMessage('fix: see #42 for context');
    const result = extractIssueReferences(ctx, input);
    const refs = result.getReferencesList();
    expect(refs.some((r) => r.getIssue() === '42')).toBe(true);
  });

  it('extracts a cross-repo "owner/repo#N" reference', () => {
    const input = new CommitMessageRequest();
    input.setMessage('fix: apply upstream patch\n\nFixes octocat/hello-world#123');
    const result = extractIssueReferences(ctx, input);
    const refs = result.getReferencesList();
    const match = refs.find((r) => r.getIssue() === '123');
    expect(match).toBeDefined();
    expect(match!.getOwner()).toBe('octocat');
    expect(match!.getRepository()).toBe('hello-world');
  });

  it('returns an empty list, not a crash, when there are no references', () => {
    const input = new CommitMessageRequest();
    input.setMessage('docs: correct spelling of CHANGELOG');
    expect(extractIssueReferences(ctx, input).getReferencesList()).toEqual([]);
  });

  it('returns an empty list, not a crash, for an empty message', () => {
    const input = new CommitMessageRequest();
    input.setMessage('');
    expect(() => extractIssueReferences(ctx, input)).not.toThrow();
    expect(extractIssueReferences(ctx, input).getReferencesList()).toEqual([]);
  });
});
