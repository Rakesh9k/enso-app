export const MAX_CODE_ATTEMPTS = 10;
export function referralCodeCandidate(displayName: string, userId: string, attempt: number): string {
  const base = (displayName || "partner").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase();
  const suffix = userId.slice(0, 4).toUpperCase();
  return attempt === 0 ? `${base}${suffix}` : `${base}${suffix}${attempt}`;
}
export function isValidReferralCode(code: string): boolean { return /^[A-Z0-9]{4,12}$/.test(code); }
