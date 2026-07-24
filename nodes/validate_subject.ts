import { ValidateSubjectRequest, ValidateSubjectResult, ValidationIssue } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { mkIssue, DEFAULT_SUBJECT_MAX_LENGTH } from './lib';

/**
 * Validate a commit subject line (the description after "type(scope): ")
 * against the common, well-defined mechanical rules — deliberately NOT
 * imperative-mood (that requires judgment, not a mechanical check): must be
 * non-empty; must not exceed `max_length` (<= 0 uses the common commitlint
 * default of 100); must not have leading/trailing whitespace; must not end
 * with a period. A subject starting with an uppercase letter is flagged as a
 * "warning" (the lowercase-first-letter convention is common but not
 * universal), not an "error" — `valid` is true iff no `error`-severity issue
 * was found. Deterministic; never throws.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function validateSubject(ax: AxiomContext, input: ValidateSubjectRequest): ValidateSubjectResult {
  const out = new ValidateSubjectResult();
  const subject = input.getSubject();
  out.setLength(subject.length);

  const maxLength = input.getMaxLength() > 0 ? input.getMaxLength() : DEFAULT_SUBJECT_MAX_LENGTH;
  const trimmed = subject.trim();
  const issues: ValidationIssue[] = [];

  if (!trimmed) {
    issues.push(mkIssue('EMPTY_SUBJECT', 'subject is empty', 'error'));
  }
  if (subject.length > maxLength) {
    issues.push(mkIssue('TOO_LONG', `subject is ${subject.length} characters, exceeds max_length ${maxLength}`, 'error'));
  }
  if (subject !== trimmed) {
    issues.push(mkIssue('LEADING_OR_TRAILING_WHITESPACE', 'subject has leading or trailing whitespace', 'error'));
  }
  if (trimmed.endsWith('.')) {
    issues.push(mkIssue('TRAILING_PERIOD', 'subject should not end with a period', 'error'));
  }
  if (trimmed && /^[A-Z]/.test(trimmed)) {
    issues.push(mkIssue('CAPITALIZED_FIRST_LETTER', 'subject starts with an uppercase letter (convention is lowercase)', 'warning'));
  }

  out.setValid(!issues.some((i) => i.getSeverity() === 'error'));
  out.setIssuesList(issues);
  return out;
}
