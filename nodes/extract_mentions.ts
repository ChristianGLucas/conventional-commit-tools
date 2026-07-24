import { CommitMessageRequest, ExtractMentionsResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseRawCommit } from './lib';

/**
 * Extract every @mention (e.g. "@octocat") anywhere in a raw commit message
 * — useful for crediting contributors/reviewers in generated changelogs.
 * Returns an empty list (never throws) on an empty message.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractMentions(ax: AxiomContext, input: CommitMessageRequest): ExtractMentionsResult {
  const out = new ExtractMentionsResult();
  try {
    const raw = parseRawCommit(input.getMessage());
    out.setMentionsList(raw.mentions ?? []);
  } catch {
    out.setMentionsList([]);
  }
  return out;
}
