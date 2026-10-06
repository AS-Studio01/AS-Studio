export interface EmailPayload {
  to?: string;
  subject: string;
  clientName: string;
  businessName: string;
  scopeSummary: string;
  contactChannel: string;
}

export const OFFICIAL_CHANNELS = {
  GMAIL: 'asbusinessofficial01@gmail.com',
  TELEGRAM: 'https://t.me/AS_Studio_official01',
  TELEGRAM_HANDLE: '@AS_Studio_official01',
};

export function generateMailtoUrl(payload: EmailPayload): string {
  const recipient = payload.to || OFFICIAL_CHANNELS.GMAIL;
  const subject = encodeURIComponent(payload.subject || `Project Inquiry: ${payload.businessName} - AS Studio`);
  const body = encodeURIComponent(
    `Hello AS Studio Team,\n\n` +
    `Client Name: ${payload.clientName}\n` +
    `Business: ${payload.businessName}\n` +
    `Preferred Channel: ${payload.contactChannel}\n\n` +
    `Project Scope & Requirements:\n${payload.scopeSummary}\n\n` +
    `Looking forward to connecting!`
  );

  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}

export function openDirectTelegram(prefilledMessage?: string): void {
  const base = OFFICIAL_CHANNELS.TELEGRAM;
  if (!prefilledMessage) {
    window.open(base, '_blank', 'noopener,noreferrer');
    return;
  }
  const url = `${base}?text=${encodeURIComponent(prefilledMessage)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
