/**
 * GMAIL SERVICE PLACEHOLDER
 * ==============================================================================
 * This is a ready-to-replace placeholder module for Google Workspace / Gmail.
 * When you are ready to configure Gmail, you can replace the dummy
 * functions below with your real Google Workspace Gmail API client (googleapis),
 * OAuth2 tokens, or Nodemailer SMTP configuration.
 * ==============================================================================
 */

export interface EmailMessagePayload {
  to: string;
  from?: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
  replyTo?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId: string;
  timestamp: string;
  provider: 'gmail_api' | 'smtp' | 'placeholder';
}

export interface GmailPlaceholderConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  officialSenderEmail: string;
  isConfigured: boolean;
}

export const GMAIL_PLACEHOLDER_CONFIG: GmailPlaceholderConfig = {
  clientId: import.meta.env.VITE_GMAIL_CLIENT_ID || 'placeholder_gmail_client_id.apps.googleusercontent.com',
  clientSecret: 'placeholder_gmail_client_secret_xxxxxx',
  refreshToken: 'placeholder_gmail_refresh_token_xxxxxx',
  officialSenderEmail: 'asbusinessofficial01@gmail.com',
  isConfigured: false, // Switch to true once Google Workspace OAuth2 tokens are added
};

/**
 * Send an email via Gmail
 * PLACEHOLDER: Replace with gmail.users.messages.send() or nodemailer transporter.sendMail()
 */
export async function sendEmailViaGmail(payload: EmailMessagePayload): Promise<EmailSendResult> {
  console.info('[GMAIL PLACEHOLDER] sendEmailViaGmail called for recipient:', payload.to, {
    subject: payload.subject,
    sender: payload.from || GMAIL_PLACEHOLDER_CONFIG.officialSenderEmail,
  });

  // Simulated delivery confirmation for placeholder mode
  return {
    success: true,
    messageId: `gmail_msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
    provider: 'placeholder',
  };
}

/**
 * Notify AS Studio founders of new client brief
 */
export async function sendInquiryNotificationToFounders(inquiry: {
  clientName: string;
  contactChannel: string;
  scopeSummary: string;
}): Promise<EmailSendResult> {
  return sendEmailViaGmail({
    to: GMAIL_PLACEHOLDER_CONFIG.officialSenderEmail,
    subject: `[New Inquiry] Project Brief from ${inquiry.clientName}`,
    bodyText: `New client brief received:\nClient: ${inquiry.clientName}\nContact: ${inquiry.contactChannel}\nDetails: ${inquiry.scopeSummary}`,
  });
}

/**
 * Send automated receipt to client
 */
export async function sendClientConfirmationReceipt(
  toEmail: string,
  clientName: string
): Promise<EmailSendResult> {
  return sendEmailViaGmail({
    to: toEmail,
    subject: 'AS Studio — We received your project brief',
    bodyText: `Hello ${clientName},\n\nThank you for reaching out to AS Studio. We have received your project details and will review your scope within 24 hours.\n\nWarm regards,\nAS Studio Team`,
  });
}

/**
 * Verify Gmail service status
 */
export async function verifyGmailServiceStatus(): Promise<{
  active: boolean;
  sender: string;
  mode: string;
}> {
  return {
    active: true,
    sender: GMAIL_PLACEHOLDER_CONFIG.officialSenderEmail,
    mode: 'Placeholder Simulated Mode (Ready for OAuth / API tokens)',
  };
}
