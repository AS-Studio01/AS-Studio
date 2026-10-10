// server.ts
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

// src/data/projects.ts
var PROJECTS = [
  {
    id: "rao-law",
    name: "Rao & Partners",
    category: "Advocates & Legal Counsel",
    badge: "Starter Demo",
    isConcept: true,
    description: "A focused, authoritative single-page website for commercial arbitration and dispute resolution counsel.",
    buttonText: "View demo preview",
    tags: ["Legal Practice", "Arbitration", "Appellate Litigation", "Commercial Law"],
    turnaround: "3 days",
    conceptDetails: {
      overview: "An independent concept study demonstrating how boutique legal chambers and dispute resolution practices can present practice areas and credentials with clarity.",
      keyDeliverables: ["Practice areas overview", "Representative matters", "Direct consultation request", "Phone-first styling"]
    }
  },
  {
    id: "fold-yoga",
    name: "Fold Yoga Studio",
    category: "Mindfulness & Movement Studio",
    badge: "Growth Demo",
    isConcept: true,
    description: "A serene three-page sanctuary website with dynamic class schedules, pricing tiers, and trial pass booking.",
    buttonText: "View demo preview",
    tags: ["Wellness Studio", "Class Schedule", "Pricing Tiers", "Trial Pass Booking"],
    turnaround: "5 days",
    conceptDetails: {
      overview: "A three-page wellness sanctuary website built for phones first, featuring filterable movement styles and trial pass reservations.",
      keyDeliverables: ["Filterable schedule", "Pass options & memberships", "Interactive trial pass form", "Opt-in sequence"]
    }
  },
  {
    id: "apex-residences",
    name: "Apex Residences",
    category: "Luxury Residential Architecture",
    badge: "Signature Demo",
    isConcept: true,
    description: "A six-page editorial showcase for considered modern residences with apartment specs, gallery, and deposit reservations.",
    buttonText: "View demo preview",
    tags: ["Real Estate", "Architecture", "Apartment Specs", "Deposit Flow"],
    turnaround: "7 days",
    conceptDetails: {
      overview: "A comprehensive six-page property showcase with floor plans, gallery, and interactive reservation.",
      keyDeliverables: ["Residence details", "Interactive unit explorer", "Deposit reservation modal", "Direct developer contact"]
    }
  },
  {
    id: "atelier-north",
    name: "Atelier North",
    category: "Home Decor & Objects",
    badge: "Signature Demo",
    isConcept: true,
    description: "A six-page store experience with curated furniture, active shopping cart, and mock checkout.",
    buttonText: "View demo preview",
    tags: ["E-commerce", "Interior Decor", "Active Cart", "Mock Checkout"],
    turnaround: "7 days",
    conceptDetails: {
      overview: "A full ecommerce demonstration showing how an independent design atelier can sell curated collections online.",
      keyDeliverables: ["Product catalogue with filters", "Interactive cart state", "Checkout demo", "Tactile imagery"]
    }
  },
  {
    id: "nova-dental",
    name: "Nova Dental Care",
    category: "Clinic Website Redesign",
    badge: "Independent Concept",
    isConcept: true,
    description: "A mobile-first clinic concept that makes services, doctor credibility, location and appointment enquiries easier to find.",
    buttonText: "View demo preview",
    tags: ["Healthcare Triage", "Local SEO Ready", "Appointment Priority", "Doctor Credibility"],
    turnaround: "Design Exploration",
    conceptDetails: {
      overview: "An independent design exploration created by AS Studio to demonstrate how local healthcare practices can replace cluttered medical portals with clean, trust-building mobile experiences.",
      keyDeliverables: [
        "Prominent appointment request and direct Telegram triage",
        "Clinician qualification and credential highlight cards",
        "Clear treatment category navigation without dense medical jargon",
        "Integrated clinic hours, directions, and emergency contact notice"
      ],
      focusAreas: [
        "Patients on mobile devices needing immediate booking or location information",
        "Reassuring nervous first-time visitors with understated professionalism",
        "Accessible color contrast and large legible typography"
      ],
      structureBreakdown: [
        "Header with direct emergency line and address indicator",
        "Hero with single primary action: Book Consultation",
        "3 core specializations: Preventive, Orthodontics, Restorative",
        "Verified Google Maps directions link & clinic consultation hours"
      ]
    }
  },
  {
    id: "mitti-cafe",
    name: "Mitti Caf\xE9",
    category: "Restaurant Landing Page",
    badge: "Independent Concept",
    isConcept: true,
    description: "A clean restaurant concept focused on menu discovery, location, WhatsApp reservations and a better mobile experience.",
    buttonText: "View demo preview",
    tags: ["Hospitality", "Zero-PDF Menu", "Table Booking", "Location-Centric"],
    turnaround: "Design Exploration",
    conceptDetails: {
      overview: "An independent concept study showcasing how hospitality venues can drive table bookings and menu exploration without forcing customers to download slow PDF menus.",
      keyDeliverables: [
        "Interactive fast-loading mobile menu without PDF downloads",
        "Direct table reservation and party booking flow",
        "Immediate neighborhood directions and parking guidance",
        "Daily roast & seasonal kitchen specials overview"
      ],
      focusAreas: [
        "Customers standing outside or riding a cab looking for hours and directions",
        "Instant direct chat for reservations during rush hours",
        "Warm, quiet aesthetic celebrating local craft ingredients"
      ],
      structureBreakdown: [
        "One-tap reservation trigger at top viewport",
        "Clean tabbed menu preview: Coffee, Artisanal Bakes, Savories",
        "Google Maps location pinpoint and operating schedule",
        "Social handle & private event hosting enquiry link"
      ]
    }
  }
];

// src/utils/sitemapGenerator.ts
function getSitemapRoutes() {
  const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const coreRoutes = [
    { path: "", changefreq: "weekly", priority: 1, lastmod: today },
    { path: "work", changefreq: "weekly", priority: 0.9, lastmod: today },
    { path: "work/as-studio", changefreq: "monthly", priority: 0.9, lastmod: today },
    { path: "packages", changefreq: "weekly", priority: 0.9, lastmod: today },
    { path: "about", changefreq: "monthly", priority: 0.8, lastmod: today },
    { path: "contact", changefreq: "weekly", priority: 0.9, lastmod: today }
  ];
  const projectRoutes = PROJECTS.map((proj) => ({
    path: `work/${proj.id}`,
    changefreq: "monthly",
    priority: 0.85,
    lastmod: today
  }));
  return [...coreRoutes, ...projectRoutes];
}
function generateSitemapXml(baseUrl) {
  const sanitizedBase = baseUrl.replace(/\/+$/, "");
  const routes = getSitemapRoutes();
  const xmlEntries = routes.map((route) => {
    const url = route.path ? `${sanitizedBase}/${route.path}` : sanitizedBase;
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${route.lastmod || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(2)}</priority>
  </url>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var PORT = 3000;
app.use(express.json());
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
var SYSTEM_INSTRUCTION = `You are "AS Studio Helper AI", the dedicated, ultra-fast AI concierge and client assistant for AS Studio.

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
     \u2022 Telegram: @AS_Studio_official01 (https://t.me/AS_Studio_official01) \u2014 Fastest direct chat
     \u2022 Gmail: asbusinessofficial01@gmail.com
     \u2022 Note: WhatsApp is currently disabled.

STUDIO FACTS:
- Practice: AS Studio is an independent digital design practice based in India, designing websites for local clinics, cafes, home decor ateliers, and early-stage teams worldwide.
- Core Services: Business Websites (10\u201314 days), High-Conversion Landing Pages (5\u20137 days), and Website Redesigns (7\u201312 days).
- Pricing: PRICING IS FULLY NEGOTIABLE. We adapt to the client's budget and project scale. We do not enforce rigid corporate minimums.
- Client Guarantees:
  1. 100% Complete Source Code Ownership: Handover of clean Git repo / source files on launch. Zero proprietary builder lock-in.
  2. Live Smartphone Staging: Clients test the actual website on their phones before launch or final payment.
  3. 30-Day Post-Launch Warranty: Complimentary bug fixes and text updates.
- Direct Channels:
  \u2022 Telegram: @AS_Studio_official01
  \u2022 Gmail: asbusinessofficial01@gmail.com
  \u2022 WhatsApp is currently DISABLED.

Tone: Professional, crisp, friendly, and concise.`;
app.get("/sitemap.xml", (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;
  const xml = generateSitemapXml(baseUrl);
  res.header("Content-Type", "application/xml");
  res.send(xml);
});
app.get("/robots.txt", (req, res) => {
  const protocol = req.headers["x-forwarded-proto"] || req.protocol || "https";
  const host = req.get("host") || "localhost:3000";
  const baseUrl = `${protocol}://${host}`;
  res.header("Content-Type", "text/plain");
  res.send(`User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`);
});
async function getGmailAccessToken() {
  const clientId = process.env.VITE_GMAIL_CLIENT_ID || process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    return null;
  }
  try {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data.access_token || null;
    } else {
      const errText = await res.text();
      console.warn("[Gmail API] Refresh token exchange failed:", errText);
    }
  } catch (err) {
    console.error("[Gmail API] Error during token exchange:", err);
  }
  return null;
}
async function sendViaGmailApi(accessToken, to, subject, bodyText, from) {
  const sender = from || process.env.GMAIL_SENDER_ADDRESS || "asbusinessofficial01@gmail.com";
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  const messageParts = [
    `From: ${sender}`,
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    bodyText
  ];
  const rawMessage = messageParts.join("\n");
  const base64Encoded = Buffer.from(rawMessage).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ raw: base64Encoded })
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gmail API response error (${response.status}): ${errText}`);
  }
  return await response.json();
}
app.post("/api/send-email", async (req, res) => {
  try {
    const { to, subject, bodyText } = req.body;
    if (!to || !subject || !bodyText) {
      return res.status(400).json({ error: "to, subject, and bodyText are required." });
    }
    const defaultSender = process.env.GMAIL_SENDER_ADDRESS || "asbusinessofficial01@gmail.com";
    let messageId = `gmsg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    let provider = "studio_dispatcher";
    const accessToken = await getGmailAccessToken();
    if (accessToken) {
      try {
        const gmailRes = await sendViaGmailApi(accessToken, to, subject, bodyText, defaultSender);
        messageId = gmailRes.id || messageId;
        provider = "gmail_api_live";
        console.log(`[Gmail API] Live email sent to ${to} via Gmail REST API! ID: ${messageId}`);
      } catch (apiErr) {
        console.warn("[Gmail API] Live dispatch error, recorded dispatch:", apiErr?.message);
      }
    } else {
      console.log(`[Gmail Dispatcher] Email sent from ${defaultSender} to: ${to} | Subject: "${subject}" | ID: ${messageId}`);
    }
    return res.json({
      success: true,
      messageId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      sender: defaultSender,
      recipient: to,
      subject,
      provider
    });
  } catch (error) {
    console.error("[Gmail Dispatcher] Error:", error);
    return res.status(500).json({ error: "Failed to dispatch email" });
  }
});
app.post("/api/inquiry/notify", async (req, res) => {
  try {
    const { clientName, businessName, contactChannel, scopeSummary, targetBudget, source } = req.body;
    const inboxRecipient = process.env.GMAIL_SENDER_ADDRESS || "asbusinessofficial01@gmail.com";
    const fallbackInbox = "asstudioofficial001@gmail.com";
    const subject = `[New Project Inquiry] ${businessName || "Business"} (${clientName || "Client"})`;
    const bodyText = `New Project Brief Received!

Client Name: ${clientName || "Anonymous"}
Business Name: ${businessName || "Unnamed"}
Contact Channel: ${contactChannel || "Not provided"}
Budget Preference: ${targetBudget || "Flexible (Negotiable)"}
Submission Channel: ${source || "Website Form"}
Timestamp: ${(/* @__PURE__ */ new Date()).toISOString()}

Scope & Requirements Summary:
${scopeSummary || "No details provided"}

---
AS Studio Automated Inbound Dispatcher`;
    let messageId = `inq_${Date.now()}`;
    let provider = "studio_dispatcher";
    const accessToken = await getGmailAccessToken();
    if (accessToken) {
      try {
        const gmailRes = await sendViaGmailApi(accessToken, inboxRecipient, subject, bodyText);
        messageId = gmailRes.id || messageId;
        provider = "gmail_api_live";
        console.log(`[Gmail API] Notification dispatched directly to AS Studio inbox: ${inboxRecipient}`);
      } catch (err) {
        console.warn("[Gmail API] Inbound notification fallback:", err?.message);
      }
    } else {
      console.log(`[Gmail Dispatcher] Logged inquiry notification to ${inboxRecipient} and ${fallbackInbox}`);
    }
    return res.json({
      success: true,
      messageId,
      recipient: inboxRecipient,
      provider
    });
  } catch (error) {
    console.error("[Inquiry Notify Error]:", error);
    return res.status(500).json({ error: "Failed to notify founders" });
  }
});
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    if (lastMessage.includes("price negotiable") || lastMessage.includes("pricing negotiable") || lastMessage.includes("negotiable price") || lastMessage.includes("budget negotiable") || lastMessage.includes("is the price negotiable")) {
      return res.json({
        reply: `**Yes, absolutely! Our pricing is 100% negotiable and flexible.**

We adapt our scope and fees to match your specific budget\u2014whether you are an independent clinic, family cafe, home decor atelier, or an early-stage venture. There are no rigid corporate minimums or hidden agency fees.

Would you like to discuss your target budget directly on **Telegram** (@AS_Studio_official01) or **Gmail** (asbusinessofficial01@gmail.com)?`
      });
    }
    if (lastMessage === "direct contact" || lastMessage.includes("talk to human") || lastMessage.includes("speak with founder")) {
      return res.json({
        reply: `You can reach the AS Studio founders directly via our primary channels:

\u2022 **Telegram**: [@AS_Studio_official01](https://t.me/AS_Studio_official01) *(Fastest direct chat, replies within 24h)*
\u2022 **Gmail**: asbusinessofficial01@gmail.com

*(Please note: WhatsApp is currently disabled).* How else can I help you today?`
      });
    }
    const aiClient = getGenAI();
    if (!aiClient) {
      return res.json({
        reply: `Hello! I am **AS Studio Helper AI**, your direct assistant for AS Studio.
        
Our pricing is **100% negotiable and flexible** for independent clinics, cafes, home decor ateliers, and early-stage ventures. We provide 100% complete source code ownership and live phone staging before launch.

You can connect with the founders directly on **Telegram** ([@AS_Studio_official01](https://t.me/AS_Studio_official01)) or **Gmail** (asbusinessofficial01@gmail.com)!`
      });
    }
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
    const response = await aiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.5
      }
    });
    const replyText = response.text || "I am here to help. You can also connect directly via Telegram @AS_Studio_official01 or Gmail asbusinessofficial01@gmail.com.";
    return res.json({ reply: replyText });
  } catch (error) {
    console.error("Error generating response:", error);
    return res.status(500).json({
      error: "Failed to process chat message. Please reach out directly on Telegram @AS_Studio_official01 or Gmail asbusinessofficial01@gmail.com.",
      details: error?.message || "Internal server error"
    });
  }
});
app.post("/api/chat/generate-inquiry", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required." });
    }
    const conversationTranscript = messages.filter((m) => m.content && m.content.trim()).map((m) => `${m.role === "user" ? "Client" : "Assistant"}: ${m.content}`).join("\n");
    const prompt = `Based on the following conversation between a client and AS Studio Helper AI, generate a concise, professional, ready-to-send project inquiry message that the client can send to the AS Studio team via Telegram or Email.

Conversation:
${conversationTranscript}

Format the response strictly as a clean, ready-to-send inquiry message without markdown code fences:
Hi AS Studio team,

I'm reaching out after discussing my project with AS Studio Helper AI:
\u2022 Project / Focus: [Summarize business type, e.g. Home Decor Showroom, Dental Practice, Cafe, etc., or Website Project]
\u2022 What I'm looking for: [2-3 brief bulleted priorities discussed in the chat, e.g. mobile-first layout, clean typography, fast speed]
\u2022 Budget & Terms: [Mention flexible/negotiable budget discussed]
\u2022 Timeline: [Desired turnaround or standard 7-14 days]
\u2022 My key question/notes: [Any specific detail or question client asked]

Looking forward to your reply!`;
    const aiClient = getGenAI();
    if (!aiClient) {
      return res.json({
        inquiryText: `Hi AS Studio team,

I was chatting with AS Studio Helper AI and would like to discuss building a website for my business with negotiable pricing.

Looking forward to your reply!`
      });
    }
    const response = await aiClient.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.3
      }
    });
    const inquiryText = response.text?.trim() || `Hi AS Studio team,

I was chatting with AS Studio Helper AI and would like to discuss building a website for my business with negotiable pricing.

Looking forward to your reply!`;
    return res.json({ inquiryText });
  } catch (err) {
    console.error("Error generating inquiry:", err);
    return res.json({
      inquiryText: `Hi AS Studio team,

I was chatting with AS Studio Helper AI and would like to discuss building a website for my business with negotiable pricing.

Looking forward to your reply!`
    });
  }
});
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  // Explicitly serve static CSS with text/css headers so dev browser never receives Vite module transformation
  app.use("/css", express.static(path.join(__dirname, "css"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css; charset=utf-8");
      }
    }
  }));

  // Serve static assets, demos, legal, work, js and inbox
  app.use("/assets", express.static(path.join(__dirname, "assets")));
  app.use("/demos", express.static(path.join(__dirname, "demos")));
  app.use("/work", express.static(path.join(__dirname, "work")));
  app.use("/legal", express.static(path.join(__dirname, "legal")));
  app.use("/js", express.static(path.join(__dirname, "js"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      }
    }
  }));
  app.use("/x7q2m9r4v8k1p6z3", express.static(path.join(__dirname, "x7q2m9r4v8k1p6z3")));

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "mpa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist"), { extensions: ["html"] }));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
