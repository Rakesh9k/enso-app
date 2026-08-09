export function xpForEvent(event: string): number {
  const map: Record<string, number> = { PARTNER_APPROVED: 100, FIRST_CHECK_IN: 10, DAY_7_RETAINED: 25, PAID_CONVERSION: 50 };
  return map[event] || 0;
}
