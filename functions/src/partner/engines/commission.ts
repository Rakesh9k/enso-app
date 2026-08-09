import { COMMISSION_RATES } from "../config";
export function commissionRateBpsForType(partnerType: string, config: any): number {
  if (partnerType === "THERAPIST") return COMMISSION_RATES.Growth;
  if (partnerType === "COACH") return COMMISSION_RATES.Circle;
  return COMMISSION_RATES.Starter;
}
