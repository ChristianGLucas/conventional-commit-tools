import { CommitMessageRequest, ParseRevertResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseRawCommit } from './lib';

/**
 * Detect whether a raw commit message is a git-generated revert commit
 * (`Revert "<original header>"\n\nThis reverts commit <hash>.`) and, if so,
 * extract the original commit's header and the reverted commit's hash.
 * `is_revert` is false (with the other fields empty) for an ordinary commit,
 * or on an empty message — never throws.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseRevert(ax: AxiomContext, input: CommitMessageRequest): ParseRevertResult {
  const out = new ParseRevertResult();
  try {
    const raw = parseRawCommit(input.getMessage());
    const isRevert = raw.revert != null;
    out.setIsRevert(isRevert);
    out.setRevertedHeader(raw.revert?.header ?? '');
    out.setRevertedHash(raw.revert?.hash ?? '');
  } catch {
    out.setIsRevert(false);
    out.setRevertedHeader('');
    out.setRevertedHash('');
  }
  return out;
}
