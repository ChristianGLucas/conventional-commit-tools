import { CommitMessageRequest } from '../gen/messages_pb';
import { extractFooters } from './extract_footers';
import { ctx } from './testkit';

describe('ExtractFooters', () => {
  it('extracts colon-form and hash-form trailers, in order, with folded continuations', () => {
    const input = new CommitMessageRequest();
    input.setMessage(
      'fix: prevent racing of requests\n\n' +
        'Some body text.\n\n' +
        'Closes #99\n' +
        'Refs #100\n' +
        'Reviewed-by: Bob\n' +
        'Multiline-note: first line\n' +
        'second line',
    );
    const result = extractFooters(ctx, input);
    const footers = result.getFootersList().map((f) => [f.getToken(), f.getValue()]);
    expect(footers).toEqual([
      ['Closes', '#99'],
      ['Refs', '#100'],
      ['Reviewed-by', 'Bob'],
      ['Multiline-note', 'first line\nsecond line'],
    ]);
  });

  it('returns an empty list when there is no footer', () => {
    const input = new CommitMessageRequest();
    input.setMessage('docs: correct spelling of CHANGELOG');
    expect(extractFooters(ctx, input).getFootersList()).toEqual([]);
  });

  it('returns an empty list, not a crash, for an empty message', () => {
    const input = new CommitMessageRequest();
    input.setMessage('');
    expect(() => extractFooters(ctx, input)).not.toThrow();
    expect(extractFooters(ctx, input).getFootersList()).toEqual([]);
  });
});
