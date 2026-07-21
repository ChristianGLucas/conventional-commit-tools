import { CommitMessageRequest } from '../gen/messages_pb';
import { extractMentions } from './extract_mentions';
import { ctx } from './testkit';

describe('ExtractMentions', () => {
  it('extracts every @mention in order', () => {
    const input = new CommitMessageRequest();
    input.setMessage('fix: thanks @octocat and @foo-bar for the report');
    const result = extractMentions(ctx, input);
    expect(result.getMentionsList()).toEqual(['octocat', 'foo-bar']);
  });

  it('returns an empty list when there are no mentions', () => {
    const input = new CommitMessageRequest();
    input.setMessage('docs: correct spelling of CHANGELOG');
    expect(extractMentions(ctx, input).getMentionsList()).toEqual([]);
  });

  it('returns an empty list, not a crash, for an empty message', () => {
    const input = new CommitMessageRequest();
    input.setMessage('');
    expect(() => extractMentions(ctx, input)).not.toThrow();
    expect(extractMentions(ctx, input).getMentionsList()).toEqual([]);
  });
});
