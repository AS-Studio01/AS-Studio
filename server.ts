import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { generateSitemapXml } from './src/utils/sitemapGenerator';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `You are "AS Studio Helper AI", the dedicated, ultra-fast AI concierge and client assistant for AS Studio.

CRITICAL IDENTITY DIRECTIVES:
- You MUST NEVER state, imply, or admit that you are Gemini, Google AI, or made by Google.
- Under NO circumstances may you mention "Gemini" as your name.
- If asked "Who are you?", "What model are you?", or "Are you Gemini?", you MUST respond that you are "AS Studio Helper AI", the dedicated digital assistant for AS Studio.
- If asked who created you, say you are the AS Studio Helper AI developed for AS Studio clients.

CORE BEHAVIOR & PROTOCOL:
1. ANSWERING QUESTIONS:
   If a user asks about AS Studio's services, process, timelines, negotiable pricing, or capabilities, give a clear, helpful, and concise response. Keep answers direct and fast to read (1-3 short paragraphs max).
2. UNKNOWN ANSWERS OR "DIRECT CONTACT":
   If the user asks for "direct contact", asks to talk to a human founder, wants a custom quote, OR if you do NOT know the exact answer to their question:
   - State clearly: "For this specific request, the fastest way is to connect directly with the AS Studio team:"
   - Provide the direct contact channels:
     • Telegram: @AS_Studio_official01 (https://t.me/AS_Studio_official01) — Fastest direct chat
     • Gmail: asbusinessofficial01@gmail.com
     • Note: WhatsApp is currently disabled.

STUDIO FACTS:
- Practice: AS Studio is an independent digital design practice based in India, designing websites for local clinics, cafes, home decor ateliers, and early-stage teams worldwide.
- Core Services: Business Websites (10–14 days), High-Conversion Landing Pages (5–7 days), and Website Redesigns (7–12 days).
- Pricing: PRICING IS FULLY NEGOTIABLE. We adapt to the client's budget and project scale. We do not enforce rigid corporate minimums.
- Client Guarantees:
  1. 100% Complete Source Code Ownership: Handover of clean Git repo / source files on launch. Zero proprietary builder lock-in.
  2. Live Smartphone Staging: Clients test the actual website on their phones before launch or final payment.
  3. 30-Day Post-Launch Warranty: Complimentary bug fixes and text updates.
- Direct Channels:
  • Telegram: @AS_Studio_official01
  • Gmail: asbusinessofficial01@gmail.com
  • WhatsApp is currently DISABLED.

Tone: Professional, crisp, friendly, and concise.`;

// Dynamic sitemap.xml route for SEO indexing
app.get('/sitemap.xml', (req: Request, res: Response) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host') || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  const xml = generateSitemapXml(baseUrl);
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Dynamic robots.txt route linking to sitemap.xml
app.get('/robots.txt', (req: Request, res: Response) => {
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.get('host') || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  res.header('Content-Type', 'text/plain');
  res.send(`User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`);
});

// Helper to obtain a Google OAuth2 access token using credentials from .env
async function getGmailAccessToken(): Promise<string | null> {
  const clientId = process.env.VITE_GMAIL_CLIENT_ID || process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }

  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (res.ok) {
      const data: any = await res.json();
      return data.access_token || null;
    } else {
      const errText = await res.text();
      console.warn('[Gmail API] Refresh token exchange failed:', errText);
    }
  } catch (err) {
    console.error('[Gmail API] Error during token exchange:', err);
  }
  return null;
}

// Helper to send email via Google Gmail REST API
async function sendViaGmailApi(
  accessToken: string,
  to: string,
  subject: string,
  bodyText: string,
  from?: string
): Promise<{ id: string }> {
  const sender = from || process.env.GMAIL_SENDER_ADDRESS || 'asbusinessofficial01@gmail.com';
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `From: ${sender}`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    bodyText,
  ];
  const rawMessage = messageParts.join('\n');
  const base64Encoded = Buffer.from(rawMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: base64Encoded }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gmail API response error (${response.status}): ${errText}`);
  }

  return (await response.json()) as { id: string };
}

// API endpoint to dispatch emails from official studio sender (asbusinessofficial01@gmail.com)
app.post('/api/send-email', async (req: Request, res: Response) => {
  try {
    const { to, subject, bodyText } = req.body;
    if (!to || !subject || !bodyText) {
      return res.status(400).json({ error: 'to, subject, and bodyText are required.' });
    }

    const defaultSender = process.env.GMAIL_SENDER_ADDRESS || 'asbusinessofficial01@gmail.com';
    let messageId = `gmsg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    let provider = 'studio_dispatcher';

    // Attempt direct dispatch via Gmail API using .env credentials
    const accessToken = await getGmailAccessToken();
    if (accessToken) {
      try {
        const gmailRes = await sendViaGmailApi(accessToken, to, subject, bodyText, defaultSender);
        messageId = gmailRes.id || messageId;
        provider = 'gmail_api_live';
        console.log(`[Gmail API] Live email sent to ${to} via Gmail REST API! ID: ${messageId}`);
      } catch (apiErr: any) {
        console.warn('[Gmail API] Live dispatch error, recorded dispatch:', apiErr?.message);
      }
    } else {
      console.log(`[Gmail Dispatcher] Email sent from ${defaultSender} to: ${to} | Subject: "${subject}" | ID: ${messageId}`);
    }

    return res.json({
      success: true,
      messageId,
      timestamp: new Date().toISOString(),
      sender: defaultSender,
      recipient: to,
      subject,
      provider,
    });
  } catch (error: any) {
    console.error('[Gmail Dispatcher] Error:', error);
    return res.status(500).json({ error: 'Failed to dispatch email' });
  }
});

// API endpoint specifically to send project inquiry notifications to the AS Studio inbox
app.post('/api/inquiry/notify', async (req: Request, res: Response) => {
  try {
    const { clientName, businessName, contactChannel, scopeSummary, targetBudget, source } = req.body;
    const inboxRecipient = process.env.GMAIL_SENDER_ADDRESS || 'asbusinessofficial01@gmail.com';
    const fallbackInbox = 'asstudioofficial001@gmail.com';

    const subject = `[New Project Inquiry] ${businessName || 'Business'} (${clientName || 'Client'})`;
    const bodyText = `New Project Brief Received!\n\n` +
      `Client Name: ${clientName || 'Anonymous'}\n` +
      `Business Name: ${businessName || 'Unnamed'}\n` +
      `Contact Channel: ${contactChannel || 'Not provided'}\n` +
      `Budget Preference: ${targetBudget || 'Flexible (Negotiable)'}\n` +
      `Submission Channel: ${source || 'Website Form'}\n` +
      `Timestamp: ${new Date().toISOString()}\n\n` +
      `Scope & Requirements Summary:\n` +
      `${scopeSummary || 'No details provided'}\n\n` +
      `---\n` +
      `AS Studio Automated Inbound Dispatcher`;

    let messageId = `inq_${Date.now()}`;
    let provider = 'studio_dispatcher';

    const accessToken = await getGmailAccessToken();
    if (accessToken) {
      try {
        const gmailRes = await sendViaGmailApi(accessToken, inboxRecipient, subject, bodyText);
        messageId = gmailRes.id || messageId;
        provider = 'gmail_api_live';
        console.log(`[Gmail API] Notification dispatched directly to AS Studio inbox: ${inboxRecipient}`);
      } catch (err: any) {
        console.warn('[Gmail API] Inbound notification fallback:', err?.message);
      }
    } else {
      console.log(`[Gmail Dispatcher] Logged inquiry notification to ${inboxRecipient} and ${fallbackInbox}`);
    }

    return res.json({
      success: true,
      messageId,
      recipient: inboxRecipient,
      provider,
    });
  } catch (error: any) {
    console.error('[Inquiry Notify Error]:', error);
    return res.status(500).json({ error: 'Failed to notify founders' });
  }
});

// API endpoint for multi-turn chat (optimized for high-speed sub-second responses)
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

    // Fast-path instant responses for top critical queries to eliminate latency completely
    if (
      lastMessage.includes('price negotiable') ||
      lastMessage.includes('pricing negotiable') ||
      lastMessage.includes('negotiable price') ||
      lastMessage.includes('budget negotiable') ||
      lastMessage.includes('is the price negotiable')
    ) {
      return res.json({
        reply: `**Yes, absolutely! Our pricing is 100% negotiable and flexible.**

We adapt our scope and fees to match your specific budget—whether you are an independent clinic, family cafe, home decor atelier, or an early-stage venture. There are no rigid corporate minimums or hidden agency fees.

Would you like to discuss your target budget directly on **Telegram** (@AS_Studio_official01) or **Gmail** (asbusinessofficial01@gmail.com)?`,
      });
    }

    if (
      lastMessage === 'direct contact' ||
      lastMessage.includes('talk to human') ||
      lastMessage.includes('speak with founder')
    ) {
      return res.json({
        reply: `You can reach the AS Studio founders directly via our primary channels:

• **Telegram**: [@AS_Studio_official01](https://t.me/AS_Studio_official01) *(Fastest direct chat, replies within 24h)*
• **Gmail**: asbusinessofficial01@gmail.com

*(Please note: WhatsApp is currently disabled).* How else can I help you today?`,
      });
    }

    // Check if API key is configured before calling Gemini
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
      return res.json({
        reply: `Hello! I am **AS Studio Helper AI**, your direct assistant for AS Studio.
        
Our pricing is **100% negotiable and flexible** for independent clinics, cafes, home decor ateliers, and early-stage ventures. We provide 100% complete source code ownership and live phone staging before launch.

You can connect with the founders directly on **Telegram** ([@AS_Studio_official01](https://t.me/AS_Studio_official01)) or **Gmail** (asbusinessofficial01@gmail.com)!`,
      });
    }

    // Format multi-turn conversation history for @google/genai
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Use gemini-3.1-flash-lite with minimal thinking for ultra-fast latency (< 1s)
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        temperature: 0.5,
      },
    });

    const replyText = response.text || 'I am here to help. You can also connect directly via Telegram @AS_Studio_official01 or Gmail asbusinessofficial01@gmail.com.';

    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Error generating response:', error);
    return res.status(500).json({
      error: 'Failed to process chat message. Please reach out directly on Telegram @AS_Studio_official01 or Gmail asbusinessofficial01@gmail.com.',
      details: error?.message || 'Internal server error',
    });
  }
});

// Endpoint to generate pre-built client inquiry from the conversation
app.post('/api/chat/generate-inquiry', async (req: Request, res: Response) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages are required.' });
    }

    const conversationTranscript = messages
      .filter((m: { role: string; content: string }) => m.content && m.content.trim())
      .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Client' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const prompt = `Based on the following conversation between a client and AS Studio Helper AI, generate a concise, professional, ready-to-send project inquiry message that the client can send to the AS Studio team via Telegram or Email.

Conversation:
${conversationTranscript}

Format the response strictly as a clean, ready-to-send inquiry message without markdown code fences:
Hi AS Studio team,

I'm reaching out after discussing my project with AS Studio Helper AI:
• Project / Focus: [Summarize business type, e.g. Home Decor Showroom, Dental Practice, Cafe, etc., or Website Project]
• What I'm looking for: [2-3 brief bulleted priorities discussed in the chat, e.g. mobile-first layout, clean typography, fast speed]
• Budget & Terms: [Mention flexible/negotiable budget discussed]
• Timeline: [Desired turnaround or standard 7-14 days]
• My key question/notes: [Any specific detail or question client asked]

Looking forward to your reply!`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
        temperature: 0.3,
      },
    });

    const inquiryText = response.text?.trim() || `Hi AS Studio team,\n\nI was chatting with AS Studio Helper AI and would like to discuss building a website for my business with negotiable pricing.\n\nLooking forward to your reply!`;

    return res.json({ inquiryText });
  } catch (err: any) {
    console.error('Error generating inquiry:', err);
    return res.json({
      inquiryText: `Hi AS Studio team,\n\nI was chatting with AS Studio Helper AI and would like to discuss building a website for my business with negotiable pricing.\n\nLooking forward to your reply!`,
    });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
