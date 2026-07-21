import { CommitMessageRequest, ExtractIssueReferencesResult, IssueReference } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseRawCommit } from './lib';

/**
 * Extract every issue/PR reference from a raw commit message — anywhere in
 * the header, body, or footer — e.g. "#123", "Closes #45", "fixes
 * octocat/hello-world#123". Each result carries the raw matched text, the
 * reference action if one preceded it ("Closes", "Fixes", "Resolves", ...,
 * empty if none), the issue number, the "#" prefix, and owner/repository if
 * the reference used the "owner/repo#N" cross-repo form. Returns an empty
 * list (never throws) on an empty/oversized message.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractIssueReferences(ax: AxiomContext, input: CommitMessageRequest): ExtractIssueReferencesResult {
  const out = new ExtractIssueReferencesResult();
  try {
    const raw = parseRawCommit(input.getMessage());
    const refs = (raw.references ?? []).map((r) => {
      const ir = new IssueReference();
      ir.setRaw(r.raw ?? '');
      ir.setAction(r.action ?? '');
      ir.setIssue(r.issue ?? '');
      ir.setPrefix(r.prefix ?? '');
      ir.setOwner(r.owner ?? '');
      ir.setRepository(r.repository ?? '');
      return ir;
    });
    out.setReferencesList(refs);
  } catch {
    out.setReferencesList([]);
  }
  return out;
}
