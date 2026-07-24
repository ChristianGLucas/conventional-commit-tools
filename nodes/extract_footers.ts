import { CommitMessageRequest, ExtractFootersResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseRawCommit, parseFooters } from './lib';

/**
 * Extract all footers/trailers from a raw commit message as token/value
 * pairs — e.g. "Reviewed-by: Alice" -> {token: "Reviewed-by", value:
 * "Alice"}, "Closes #123" -> {token: "Closes", value: "#123"},
 * "BREAKING CHANGE: ..." -> {token: "BREAKING CHANGE", value: "..."}. A
 * continuation line that doesn't start a new trailer is folded into the
 * previous trailer's value. Returns an empty list (never throws) when the
 * message has no footer, or is empty.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractFooters(ax: AxiomContext, input: CommitMessageRequest): ExtractFootersResult {
  const out = new ExtractFootersResult();
  try {
    const raw = parseRawCommit(input.getMessage());
    out.setFootersList(parseFooters(raw.footer));
  } catch {
    out.setFootersList([]);
  }
  return out;
}
