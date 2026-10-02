export const STUDIO_CONTACT = {
  email: 'asbusinessofficial01@gmail.com',
  telegramHandle: '@AS_Studio_official01',
  telegramUrl: 'https://t.me/AS_Studio_official01',
  whatsappStatus: 'Disabled',
  whatsappNotice: 'WhatsApp communication is currently disabled. Please reach out via Gmail or Telegram.',
  discordStatus: 'Placeholder for now',
  turnaroundTime: 'Reply within 24 hours',
  location: 'Serving founders and businesses across India & globally',
};

export function buildMailtoLink(subject?: string, body?: string): string {
  const defaultSubject = 'Website Project Inquiry — AS Studio';
  const defaultBody = 'Hi AS Studio team,\n\nI would like to discuss a website project for my business.\n\nBusiness name:\nCurrent website (if any):\nMain objective:';
  
  const sub = encodeURIComponent(subject || defaultSubject);
  const b = encodeURIComponent(body || defaultBody);
  return `mailto:${STUDIO_CONTACT.email}?subject=${sub}&body=${b}`;
}

export function buildTelegramLink(message?: string): string {
  if (message) {
    return `https://t.me/AS_Studio_official01?text=${encodeURIComponent(message)}`;
  }
  return STUDIO_CONTACT.telegramUrl;
}
