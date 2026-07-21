import { ValidateCommitRequest, ValidateCommitResult, ConventionalCommit, ValidationIssue } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseRawCommit, toConventionalCommit, mkIssue, errorMessage } from './lib';

/**
 * Validate a raw commit message against the Conventional Commits v1.0.0
 * specification and report exactly why it fails, if it does. Checks: the
 * header matches "type(scope)!: subject"; `type` is present (and, unless
 * `allow_any_type_case` is set, lowercase — the overwhelming real-world
 * convention, matching commitlint's default); `subject` is non-empty. A
 * commit marked breaking (`!` or a `BREAKING CHANGE:` footer) with no
 * breaking-change description is flagged as a warning, not an error — the
 * spec allows `!` alone with no accompanying footer text. `valid` is true
 * iff no `error`-severity issue was found. `commit` is always the best-effort
 * parse, even when invalid, so a caller can inspect what *was* extracted.
 * Deterministic; never throws.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateCommit(ax: AxiomContext, input: ValidateCommitRequest): ValidateCommitResult {
  const out = new ValidateCommitResult();
  const issues: ValidationIssue[] = [];

  let commit: ConventionalCommit;
  try {
    commit = toConventionalCommit(parseRawCommit(input.getMessage()));
  } catch (e) {
    issues.push(mkIssue('UNPARSEABLE_MESSAGE', errorMessage(e, 'parsing commit message'), 'error'));
    out.setValid(false);
    out.setIssuesList(issues);
    out.setCommit(new ConventionalCommit());
    return out;
  }

  if (!commit.getHeaderMatched()) {
    issues.push(mkIssue('INVALID_HEADER_FORMAT', 'header does not match "type(scope)!: subject"', 'error'));
  } else {
    const type = commit.getType();
    if (!type) {
      issues.push(mkIssue('MISSING_TYPE', 'commit type is empty', 'error'));
    } else if (!input.getAllowAnyTypeCase() && type !== type.toLowerCase()) {
      issues.push(mkIssue('TYPE_NOT_LOWERCASE', `type "${type}" is not lowercase`, 'error'));
    }
    if (!commit.getSubject().trim()) {
      issues.push(mkIssue('EMPTY_SUBJECT', 'subject is empty', 'error'));
    }
  }

  if (commit.getBreaking() && !commit.getBreakingDescription().trim()) {
    issues.push(mkIssue(
      'EMPTY_BREAKING_DESCRIPTION',
      'commit is marked breaking but has no description (consider adding a "BREAKING CHANGE:" footer)',
      'warning',
    ));
  }

  out.setValid(!issues.some((i) => i.getSeverity() === 'error'));
  out.setIssuesList(issues);
  out.setCommit(commit);
  return out;
}
