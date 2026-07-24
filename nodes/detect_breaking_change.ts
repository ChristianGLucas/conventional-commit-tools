import { CommitMessageRequest, DetectBreakingChangeResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseRawCommit, computeBreaking } from './lib';

/**
 * Detect whether a raw commit message is a breaking change: either a `!`
 * immediately after the type/scope (e.g. "feat(api)!: ...") or a
 * `BREAKING CHANGE:` / `BREAKING-CHANGE:` footer, per the Conventional
 * Commits v1.0.0 spec. `source` reports which signal(s) were present
 * ("marker" | "footer" | "both" | "none"); `description` is the breaking
 * -change footer's text if there is one, else empty. An empty message
 * yields breaking=false, source="none" — never throws.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function detectBreakingChange(ax: AxiomContext, input: CommitMessageRequest): DetectBreakingChangeResult {
  const out = new DetectBreakingChangeResult();
  try {
    const raw = parseRawCommit(input.getMessage());
    const { breaking, description, source } = computeBreaking(raw);
    out.setBreaking(breaking);
    out.setDescription(description);
    out.setSource(source);
  } catch {
    out.setBreaking(false);
    out.setDescription('');
    out.setSource('none');
  }
  return out;
}
