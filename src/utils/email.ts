export async function sendBrevoEmail(input: { to: string | string[]; subject: string; text: string; html?: string }) {
  const endpoint = (import.meta.env.VITE_EMAIL_API_URL as string | undefined) || 'http://localhost:3000/api/email-smtp/email-send';
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const data = await response.json().catch(() => null) as { error?: string; code?: string; responseCode?: number } | null;
    throw new Error(data?.error || `Email göndərilə bilmədi (${response.status}).`);
  }
}
