import { CommitMessageRequest, ExtractScopeResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseRawCommit } from './lib';

/**
 * Extract just the parenthesized scope (e.g. "api" from "feat(api): ...")
 * from a raw commit message's header. `found` is false (with `scope` empty)
 * when the header has no scope, doesn't conform to "type(scope)!: subject"
 * at all, or the message is empty — never throws.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractScope(ax: AxiomContext, input: CommitMessageRequest): ExtractScopeResult {
  const out = new ExtractScopeResult();
  try {
    const raw = parseRawCommit(input.getMessage());
    const scope = raw.scope ?? '';
    out.setScope(scope);
    out.setFound(scope.length > 0);
  } catch {
    out.setScope('');
    out.setFound(false);
  }
  return out;
}
