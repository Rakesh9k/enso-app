export interface ProfileUpdatePayload {
  displayName?: string;
  companion?: string;
  room?: string;
  themePreference?: 'LIGHT' | 'DARK' | 'SYSTEM';
}

export async function updateProfile(payload: ProfileUpdatePayload) {
  const res = await fetch('/api/portal/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update profile');
  return data;
}
