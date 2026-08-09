export interface PortalSubscriptionStatus {
  ok: boolean;
  tier?: 'FREE' | 'PREMIUM' | 'PRO';
  isPremium?: boolean;
  source?: string;
  managedBy?: 'APPLE' | 'GOOGLE' | 'UNKNOWN';
  manageUrl?: string | null;
  restoreApplied?: boolean;
  message?: string;
}

const FUNCTION_URL =
  process.env.NEXT_PUBLIC_REVENUECAT_PORTAL_FUNCTION_URL ||
  'https://us-central1-enso-prod-app.cloudfunctions.net/getRevenueCatPortalStatus';

export async function getSubscriptionStatus(idToken: string): Promise<PortalSubscriptionStatus> {
  try {
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ action: 'status' }),
    });
    if (!res.ok) return { ok: false };
    return await res.json();
  } catch {
    return { ok: false };
  }
}

export async function restorePurchases(idToken: string): Promise<PortalSubscriptionStatus> {
  try {
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ action: 'restore' }),
    });
    if (!res.ok) return { ok: false };
    return await res.json();
  } catch {
    return { ok: false };
  }
}

export async function getPlayStorePricing(): Promise<{ monthly: number; yearly: number } | null> {
  try {
    const res = await fetch(
      'https://us-central1-enso-prod-app.cloudfunctions.net/getPlayStorePricing'
    );
    if (!res.ok) return null;
    const data = await res.json();
    return { monthly: data.monthly ?? 299, yearly: data.yearly ?? 2700 };
  } catch {
    return { monthly: 299, yearly: 2700 };
  }
}
