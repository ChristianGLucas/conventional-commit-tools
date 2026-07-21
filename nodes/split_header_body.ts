import { CommitMessageRequest, SplitHeaderBodyResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { checkMessageLen } from './lib';

/**
 * Split a raw commit message into its header (first line) and body
 * (everything after the first blank-line-delimited gap, trimmed) — a purely
 * structural split that works even on a non-conventional message, unlike
 * every other node in this package. Both fields are trimmed of surrounding
 * whitespace. A message with only one line returns an empty body. An
 * empty/oversized message (over 100,000 characters) returns both fields
 * empty — never throws.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function splitHeaderBody(ax: AxiomContext, input: CommitMessageRequest): SplitHeaderBodyResult {
  const out = new SplitHeaderBodyResult();
  const message = input.getMessage();
  try {
    checkMessageLen(message);
  } catch {
    out.setHeader('');
    out.setBody('');
    return out;
  }

  const normalized = message.replace(/\r\n/g, '\n');
  const newlineIndex = normalized.indexOf('\n');
  if (newlineIndex === -1) {
    out.setHeader(normalized.trim());
    out.setBody('');
    return out;
  }
  out.setHeader(normalized.slice(0, newlineIndex).trim());
  out.setBody(normalized.slice(newlineIndex + 1).replace(/^\n+/, '').trim());
  return out;
}
