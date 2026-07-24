import { CommitMessageRequest, ExtractTypeResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseRawCommit } from './lib';

/**
 * Extract just the commit type (e.g. "feat", "fix", "docs", "chore",
 * "refactor", "test") from a raw commit message's header. `found` is false
 * (with `type` empty) when the header doesn't conform to
 * "type(scope)!: subject", or on an empty message — never throws.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractType(ax: AxiomContext, input: CommitMessageRequest): ExtractTypeResult {
  const out = new ExtractTypeResult();
  try {
    const raw = parseRawCommit(input.getMessage());
    const type = raw.type ?? '';
    out.setType(type);
    out.setFound(type.length > 0);
  } catch {
    out.setType('');
    out.setFound(false);
  }
  return out;
}
