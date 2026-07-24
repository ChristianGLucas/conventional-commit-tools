import { CommitMessageRequest } from '../gen/messages_pb';
import { splitHeaderBody } from './split_header_body';
import { ctx } from './testkit';

describe('SplitHeaderBody', () => {
  it('splits a header + blank line + body', () => {
    const input = new CommitMessageRequest();
    input.setMessage('feat: add a thing\n\nMore detail here.\nSecond line.');
    const result = splitHeaderBody(ctx, input);
    expect(result.getHeader()).toBe('feat: add a thing');
    expect(result.getBody()).toBe('More detail here.\nSecond line.');
  });

  it('returns an empty body for a header-only, single-line message', () => {
    const input = new CommitMessageRequest();
    input.setMessage('docs: correct spelling of CHANGELOG');
    const result = splitHeaderBody(ctx, input);
    expect(result.getHeader()).toBe('docs: correct spelling of CHANGELOG');
    expect(result.getBody()).toBe('');
  });

  it('works on a non-conventional message too (purely structural)', () => {
    const input = new CommitMessageRequest();
    input.setMessage('WIP\n\nnot conventional at all');
    const result = splitHeaderBody(ctx, input);
    expect(result.getHeader()).toBe('WIP');
    expect(result.getBody()).toBe('not conventional at all');
  });

  it('trims surrounding whitespace on both header and body', () => {
    const input = new CommitMessageRequest();
    input.setMessage('  feat: add a thing  \n\n  body text  \n');
    const result = splitHeaderBody(ctx, input);
    expect(result.getHeader()).toBe('feat: add a thing');
    expect(result.getBody()).toBe('body text');
  });
});
