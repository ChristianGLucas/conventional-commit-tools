import { CommitMessageRequest, DetermineReleaseTypeResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { parseRawCommit, computeBreaking, releaseTypeFor, errorMessage } from './lib';

/**
 * Determine the semver release type a single commit implies: a breaking
 * change (marker or footer) -> "major", "feat" -> "minor", "fix" -> "patch",
 * anything else -> "none". The "major"/"minor"/"patch" values share
 * semver-tools' Increment node's `release_type` vocabulary — but Increment's
 * own release-type whitelist does NOT include "none", so a caller composing
 * the two should branch on `release_type != "none"` before calling Increment
 * (a commit that implies no release should simply not trigger a bump, not be
 * passed through as an invalid release type). On an empty message, returns
 * release_type="none" with `reason` explaining why — never throws.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function determineReleaseType(ax: AxiomContext, input: CommitMessageRequest): DetermineReleaseTypeResult {
  const out = new DetermineReleaseTypeResult();
  try {
    const raw = parseRawCommit(input.getMessage());
    const { breaking } = computeBreaking(raw);
    const { releaseType, reason } = releaseTypeFor(raw.type ?? '', breaking);
    out.setReleaseType(releaseType);
    out.setReason(reason);
  } catch (e) {
    out.setReleaseType('none');
    out.setReason(errorMessage(e, 'could not parse commit message'));
  }
  return out;
}
