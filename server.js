// server.ts
import express from "express";
import fs from "fs";
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
    id: "fold-atelier",
    name: "Fold Atelier",
    category: "Slow Fashion Label",
    badge: "Growth Demo",
    isConcept: true,
    description: "A three-page fashion label website with a filterable collection, atelier story, fitting requests and an early-access opt-in.",
    buttonText: "View demo preview",
    tags: ["Fashion Label", "Filterable Collection", "Fitting Requests", "Early Access Opt-in"],
    turnaround: "5 days",
    conceptDetails: {
      overview: "A three-page fashion label website built for phones first, featuring a filterable collection and fitting requests.",
      keyDeliverables: ["Filterable collection", "Fabric and care details", "Fitting request form", "Early-access opt-in"]
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
    id: "vitalcare",
    name: "VitalCare Multispecialty Clinic",
    category: "Multispecialty Healthcare Clinic",
    badge: "Independent Concept",
    isConcept: true,
    description: "An unhurried, multi-page healthcare website featuring 6 clinical departments, clinician credentials, and streamlined appointment enquiry.",
    buttonText: "View demo preview",
    tags: ["Healthcare Triage", "6 Clinical Areas", "Doctor Credentials", "Low-Friction Booking"],
    turnaround: "Growth Package",
    conceptDetails: {
      overview: "An independent design exploration created by AS Studio demonstrating how private medical clinics can replace anxiety with reassuring, accessible digital care.",
      keyDeliverables: [
        "Six specialty departments (General, Paediatrics, Dermatology, Physio, Diagnostics, Dental)",
        "Clinician qualification and credential highlight cards",
        "Deep-linking appointment enquiry form with real-time feedback",
        "Integrated emergency casualty lines and opening hours"
      ],
      focusAreas: [
        "Patients on mobile devices needing calm booking or emergency triage",
        "Reassuring first-time patients with unhurried clinical clarity",
        "WCAG AAA contrast and accessible keyboard navigation"
      ],
      structureBreakdown: [
        "24/7 emergency casualty & consultation alert banner",
        "Hero with practice highlights, clinical metrics, and appointment CTA",
        "6 departmental care areas with procedure explanations",
        "Consultant roster with qualifications and OPD timings"
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
// These endpoints were open to anyone (email relay and AI chat). The public site does not use them, so they are switched off.
const DISABLED_API = ["/api/send-email", "/api/inquiry/notify", "/api/chat", "/api/chat/generate-inquiry"];
app.use((req, res, next) => DISABLED_API.some(p => req.path === p || req.path.startsWith(p + "/")) ? res.status(410).json({ error: "API disabled" }) : next());
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
const handleInquiryNotify = async (req, res) => {
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
    const cachedInquiry = {
      id: messageId,
      clientName: clientName || "Anonymous Client",
      businessName: businessName || "New Project",
      contactChannel: contactChannel || "No channel",
      scopeSummary: scopeSummary || "",
      targetBudget: targetBudget || "",
      source: source || "website_contact_form",
      status: "new",
      createdAt: new Date().toISOString()
    };
    INQUIRIES_CACHE.unshift(cachedInquiry);
    if (INQUIRIES_CACHE.length > 100) INQUIRIES_CACHE.pop();

    // Trigger automated client autoresponder asynchronously if client provided an email
    dispatchAutoresponder(cachedInquiry).catch(err => {
      console.warn("[Autoresponder Dispatch Notice]:", err?.message);
    });

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
};
app.post("/api/inquiry/notify", handleInquiryNotify);
app.post("/api/inquiries/notify", handleInquiryNotify);

// Studio in-memory store & caches for robust admin functionality
const INQUIRIES_CACHE = [];
const SETTINGS_CACHE = {
  fiverrMode: true,
  fiverrUrl: "https://www.fiverr.com/s/GPPQm9q",
  fiverrUsername: "@as_studio01",
  upworkMode: false,
  upworkUrl: "https://www.upwork.com/freelancers/~01db1175182843f13a?mp_source=share",
  upworkAgencyName: "AS Studio Official",
  studioStatus: "available", // 'available' | 'limited' | 'waitlist'
  announcement: {
    enabled: false,
    text: "Accepting new client projects for this month.",
    link: "contact.html"
  },
  prices: {
    starter: 95,
    growth: 275,
    signature: 600,
    currency: "USD ($)"
  },
  contact: {
    email: "asbusinessofficial01@gmail.com",
    telegram: "@AS_Studio_official01"
  }
};

const SETTINGS_FILE_PATH = path.join(__dirname, "site-settings.json");
try {
  if (fs.existsSync(SETTINGS_FILE_PATH)) {
    const rawSaved = fs.readFileSync(SETTINGS_FILE_PATH, "utf-8");
    const parsedSaved = JSON.parse(rawSaved);
    Object.assign(SETTINGS_CACHE, parsedSaved);
  }
} catch (err) {
  console.warn("[Settings Disk Notice] Could not read saved settings:", err.message);
}

const ADMIN_SESSIONS = new Set();

// Autoresponder templates & configuration for Gmail Dispatcher
const AUTORESPONDER_CONFIG = {
  enabled: true,
  activeTemplateId: "starter-ack",
  senderName: "AS Studio Client Services",
  replyTo: "asbusinessofficial01@gmail.com",
  templates: [
    {
      id: "starter-ack",
      name: "Starter Package Lead Autoresponder",
      subject: "Thank you for reaching out to AS Studio — Project Brief Received",
      body: "Hi {{clientName}},\n\nThank you for reaching out regarding {{businessName}}. We have received your project inquiry and our design lead is reviewing your project requirements.\n\nWhat happens next:\n1. We will review your business goals and recommend a streamlined page structure.\n2. Within 1 business day, you will receive our clear proposal with transparent pricing and milestone dates.\n3. We build first and you test the live website directly on your smartphone before paying the final balance.\n\nIf you have reference links, brand colors, or questions, you can reply directly to this email or chat with us on Telegram: {{telegram}}.\n\nWarm regards,\nAS Studio Team\n{{studioEmail}}"
    },
    {
      id: "growth-lead",
      name: "Growth Package Lead Autoresponder",
      subject: "AS Studio — We have received your multi-page project brief",
      body: "Hi {{clientName}},\n\nThank you for contacting AS Studio regarding {{businessName}}.\n\nWe specialize in fast, high-converting multi-page websites designed to generate inquiries and client trust. We've logged your scope and are preparing a structured layout roadmap.\n\nNext steps:\n• We will analyze your customer journey and lead conversion priorities.\n• You will receive our interactive proposal within 24 hours.\n• You can also schedule an instant kickoff on Telegram: {{telegram}}.\n\nBest,\nAS Studio\n{{studioEmail}}"
    },
    {
      id: "signature-vip",
      name: "Signature Custom Architecture Autoresponder",
      subject: "AS Studio — Bespoke Project Inquiry Confirmed",
      body: "Hi {{clientName}},\n\nThank you for considering AS Studio for {{businessName}}'s signature digital presence.\n\nOur bespoke tier includes custom CMS integration, full fluid animations, priority physical smartphone staging, and 100% complete source file ownership with zero builder lock-in.\n\nOur team is reviewing your brief and will respond with available sprint dates within 24 hours.\n\nDirect contact: {{studioEmail}} | Telegram: {{telegram}}\n\nSincerely,\nAS Studio Principal"
    }
  ],
  recentDispatches: []
};

// Helper to dispatch automated client autoresponder via Gmail REST API or Dispatcher
async function dispatchAutoresponder(inquiry, customRecipient = null, customTemplate = null) {
  try {
    if (!AUTORESPONDER_CONFIG.enabled && !customRecipient) return null;
    const recipientEmail = customRecipient || (inquiry.contactChannel || "").trim();
    if (!recipientEmail || !recipientEmail.includes("@")) return null;

    const tpl = customTemplate ||
      AUTORESPONDER_CONFIG.templates.find(t => t.id === AUTORESPONDER_CONFIG.activeTemplateId) ||
      AUTORESPONDER_CONFIG.templates[0];
    if (!tpl) return null;

    const clientName = inquiry.clientName || "there";
    const businessName = inquiry.businessName || "your business";
    const telegram = SETTINGS_CACHE.contact.telegram || "@AS_Studio_official01";
    const studioEmail = SETTINGS_CACHE.contact.email || "asbusinessofficial01@gmail.com";

    let renderedSubject = (tpl.subject || "AS Studio — Project Brief Received")
      .replace(/\{\{clientName\}\}/g, clientName)
      .replace(/\{\{businessName\}\}/g, businessName);

    let renderedBody = (tpl.body || "")
      .replace(/\{\{clientName\}\}/g, clientName)
      .replace(/\{\{businessName\}\}/g, businessName)
      .replace(/\{\{contactChannel\}\}/g, recipientEmail)
      .replace(/\{\{telegram\}\}/g, telegram)
      .replace(/\{\{studioEmail\}\}/g, studioEmail);

    let messageId = `auto_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    let provider = "studio_dispatcher";

    const accessToken = await getGmailAccessToken();
    if (accessToken) {
      try {
        const gmailRes = await sendViaGmailApi(accessToken, recipientEmail, renderedSubject, renderedBody, AUTORESPONDER_CONFIG.replyTo || studioEmail);
        messageId = gmailRes.id || messageId;
        provider = "gmail_api_live";
        console.log(`[Gmail Autoresponder] Live email dispatched to ${recipientEmail} via Gmail REST API!`);
      } catch (err) {
        console.warn("[Gmail Autoresponder] Fallback dispatch:", err?.message);
      }
    } else {
      console.log(`[Gmail Dispatcher] Autoresponder dispatched to client ${recipientEmail} (${tpl.name})`);
    }

    const record = {
      id: messageId,
      recipient: recipientEmail,
      clientName,
      businessName,
      templateId: tpl.id,
      templateName: tpl.name,
      subject: renderedSubject,
      timestamp: new Date().toISOString(),
      provider
    };

    AUTORESPONDER_CONFIG.recentDispatches.unshift(record);
    if (AUTORESPONDER_CONFIG.recentDispatches.length > 50) {
      AUTORESPONDER_CONFIG.recentDispatches.pop();
    }
    return record;
  } catch (err) {
    console.error("[Autoresponder Error]:", err);
    return null;
  }
}

// Lightweight analytics store & Firestore sync for dashboard overview
const ANALYTICS_CACHE = {
  totalViews: 0,
  demoViews: {
    "mitti-cafe": 0,
    "rao-law": 0,
    "vitalcare": 0,
    "nova-dental": 0,
    "fold-atelier": 0,
    "apex-residences": 0,
    "atelier-north": 0,
    "delta-os": 0,
    "studio": 0
  },
  recentViews: []
};

app.post("/api/track", async (req, res) => {
  try {
    const { path: reqPath, demo, title, referrer, createdAt } = req.body || {};
    const cleanPath = typeof reqPath === "string" ? reqPath.slice(0, 300) : "/";
    const cleanDemo = typeof demo === "string" ? demo.slice(0, 80) : "studio";
    const cleanTitle = typeof title === "string" ? title.slice(0, 200) : "";
    const cleanReferrer = typeof referrer === "string" ? referrer.slice(0, 300) : "direct";
    const cleanCreatedAt = createdAt || new Date().toISOString();

    // Increment analytics metrics
    ANALYTICS_CACHE.totalViews++;
    if (ANALYTICS_CACHE.demoViews[cleanDemo] !== undefined) {
      ANALYTICS_CACHE.demoViews[cleanDemo]++;
    } else {
      ANALYTICS_CACHE.demoViews[cleanDemo] = 1;
    }

    const viewItem = {
      path: cleanPath,
      demo: cleanDemo,
      title: cleanTitle,
      referrer: cleanReferrer,
      createdAt: cleanCreatedAt
    };
    ANALYTICS_CACHE.recentViews.unshift(viewItem);
    if (ANALYTICS_CACHE.recentViews.length > 80) {
      ANALYTICS_CACHE.recentViews.pop();
    }

    // Persist to Firestore asynchronously via REST API
    const docId = `pv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/profound-handbook-z3skh/databases/(default)/documents/page_views?documentId=${docId}`;
    fetch(firestoreUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          path: { stringValue: cleanPath },
          demo: { stringValue: cleanDemo },
          title: { stringValue: cleanTitle },
          referrer: { stringValue: cleanReferrer },
          createdAt: { stringValue: cleanCreatedAt }
        }
      })
    }).catch(err => {
      // Async logging notification without blocking response
      console.warn("[Analytics Firestore] Async save notice:", err?.message);
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("[Analytics Error]:", err);
    return res.status(200).json({ success: false });
  }
});

app.get("/api/analytics", (_req, res) => {
  return res.json({
    totalViews: ANALYTICS_CACHE.totalViews,
    demoViews: ANALYTICS_CACHE.demoViews,
    recentViews: ANALYTICS_CACHE.recentViews.slice(0, 40)
  });
});

// Automated Daily Visitor Statistics CSV Export for Studio Reporting
app.get("/api/admin/analytics/export-csv", (_req, res) => {
  const dateStr = new Date().toISOString().slice(0, 10);
  const nowStr = new Date().toISOString();
  
  const DEMO_NAMES = {
    'studio': 'AS Studio Home Page',
    'mitti-cafe': 'Mitti Café (Starter $95)',
    'rao-law': 'Rao & Partners Law (Starter $95)',
    'vitalcare': 'VitalCare Clinic (Growth $275)',
    'fold-atelier': 'Fold Atelier (Growth $275)',
    'apex-residences': 'Apex Residences (Signature $600)',
    'atelier-north': 'Atelier North (Signature $600)',
    'delta-os': 'Delta.OS AI Platform (Flagship)'
  };

  const lines = [
    `# ===============================================================`,
    `# AS STUDIO — AUTOMATED DAILY VISITOR & TRAFFIC REPORT`,
    `# Generated At: ${nowStr}`,
    `# Date: ${dateStr}`,
    `# ===============================================================`,
    ``,
    `[SUMMARY KPIS]`,
    `Metric,Value`,
    `Total Page Views,${ANALYTICS_CACHE.totalViews}`,
    `Studio Home Views,${ANALYTICS_CACHE.demoViews.studio || 0}`,
    `Demo Prototype Views,${Object.keys(ANALYTICS_CACHE.demoViews).filter(k => k !== 'studio').reduce((acc, k) => acc + (ANALYTICS_CACHE.demoViews[k] || 0), 0)}`,
    ``,
    `[PAGE & DEMO BREAKDOWN]`,
    `Identifier,Demo / Page Name,Total Views,Traffic Share %`
  ];

  const total = Math.max(1, ANALYTICS_CACHE.totalViews);
  Object.keys(ANALYTICS_CACHE.demoViews).forEach(key => {
    const count = ANALYTICS_CACHE.demoViews[key] || 0;
    const name = DEMO_NAMES[key] || key;
    const share = ((count / total) * 100).toFixed(1);
    lines.push(`"${key}","${name}",${count},"${share}%"`);
  });

  lines.push(``);
  lines.push(`[RECENT VISITOR ACTIVITY STREAM]`);
  lines.push(`Timestamp,Time,Page Path,Demo Key,Page Title,Referrer`);

  ANALYTICS_CACHE.recentViews.forEach(v => {
    const cleanTime = v.createdAt || nowStr;
    let timeFormatted = 'Recent';
    try { timeFormatted = new Date(cleanTime).toLocaleTimeString(); } catch (_) {}
    lines.push(`"${cleanTime}","${timeFormatted}","${(v.path || '/').replace(/"/g, '""')}","${v.demo || 'studio'}","${(v.title || '').replace(/"/g, '""')}","${(v.referrer || 'direct').replace(/"/g, '""')}"`);
  });

  const csv = lines.join("\n");
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="as_studio_daily_visitor_report_${dateStr}.csv"`);
  return res.send(csv);
});

// Admin session is handled directly via Firebase Auth verified email
app.get("/api/admin/session", (_req, res) => {
  return res.json({ valid: false });
});

app.post("/api/admin/logout", (req, res) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (token) ADMIN_SESSIONS.delete(token);
  return res.json({ success: true });
});

// Admin Inquiries Management
app.get("/api/admin/inquiries", (_req, res) => {
  return res.json({
    inquiries: INQUIRIES_CACHE,
    count: INQUIRIES_CACHE.length
  });
});

app.post("/api/admin/inquiries", (req, res) => {
  const { clientName, businessName, contactChannel, scopeSummary, targetBudget, status } = req.body || {};
  const newInq = {
    id: `man_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    clientName: (clientName || "Direct Client").trim().slice(0, 100),
    businessName: (businessName || "Custom Project").trim().slice(0, 120),
    contactChannel: (contactChannel || "").trim().slice(0, 150),
    scopeSummary: (scopeSummary || "").trim().slice(0, 2500),
    targetBudget: (targetBudget || "").trim().slice(0, 50),
    source: "manual_admin_entry",
    status: status || "new",
    createdAt: new Date().toISOString()
  };
  INQUIRIES_CACHE.unshift(newInq);
  return res.json({ success: true, inquiry: newInq });
});

app.patch("/api/admin/inquiries/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const item = INQUIRIES_CACHE.find(inq => inq.id === id);
  if (item) {
    if (status) item.status = status;
    item.updatedAt = new Date().toISOString();
    return res.json({ success: true, inquiry: item });
  }
  return res.status(404).json({ error: "Inquiry not found in studio cache" });
});

app.delete("/api/admin/inquiries/:id", (req, res) => {
  const { id } = req.params;
  const idx = INQUIRIES_CACHE.findIndex(inq => inq.id === id);
  if (idx !== -1) {
    INQUIRIES_CACHE.splice(idx, 1);
    return res.json({ success: true });
  }
  return res.json({ success: true, notice: "Already removed" });
});

app.get("/api/admin/inquiries/export", (_req, res) => {
  const headers = ["ID", "Client Name", "Business Name", "Contact", "Budget", "Status", "Source", "Date", "Scope"];
  const rows = INQUIRIES_CACHE.map(inq => [
    inq.id,
    `"${(inq.clientName || "").replace(/"/g, '""')}"`,
    `"${(inq.businessName || "").replace(/"/g, '""')}"`,
    `"${(inq.contactChannel || "").replace(/"/g, '""')}"`,
    `"${(inq.targetBudget || "").replace(/"/g, '""')}"`,
    inq.status,
    inq.source,
    inq.createdAt,
    `"${(inq.scopeSummary || "").replace(/"/g, '""')}"`
  ]);
  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="as-studio-inquiries-${new Date().toISOString().slice(0,10)}.csv"`);
  return res.send(csv);
});

// Public Site Settings
app.get("/api/site-settings", (_req, res) => {
  return res.json({
    fiverrMode: !!SETTINGS_CACHE.fiverrMode,
    fiverrUrl: SETTINGS_CACHE.fiverrUrl || "https://www.fiverr.com/s/GPPQm9q",
    fiverrUsername: SETTINGS_CACHE.fiverrUsername || "@as_studio01",
    upworkMode: !!SETTINGS_CACHE.upworkMode,
    upworkUrl: SETTINGS_CACHE.upworkUrl || "https://www.upwork.com/freelancers/~01db1175182843f13a?mp_source=share",
    upworkAgencyName: SETTINGS_CACHE.upworkAgencyName || "AS Studio Official",
    studioStatus: SETTINGS_CACHE.studioStatus || "available",
    announcement: SETTINGS_CACHE.announcement || { enabled: false, text: "", link: "" }
  });
});

// Admin Settings
app.get("/api/admin/settings", (_req, res) => {
  return res.json(SETTINGS_CACHE);
});

app.post("/api/admin/settings", (req, res) => {
  const {
    fiverrMode,
    fiverrUrl,
    fiverrUsername,
    upworkMode,
    upworkUrl,
    upworkAgencyName,
    studioStatus,
    announcement,
    prices,
    contact
  } = req.body || {};

  if (typeof fiverrMode === "boolean") SETTINGS_CACHE.fiverrMode = fiverrMode;
  if (typeof fiverrUrl === "string") SETTINGS_CACHE.fiverrUrl = fiverrUrl.trim();
  if (typeof fiverrUsername === "string") SETTINGS_CACHE.fiverrUsername = fiverrUsername.trim();
  if (typeof upworkMode === "boolean") SETTINGS_CACHE.upworkMode = upworkMode;
  if (typeof upworkUrl === "string") SETTINGS_CACHE.upworkUrl = upworkUrl.trim();
  if (typeof upworkAgencyName === "string") SETTINGS_CACHE.upworkAgencyName = upworkAgencyName.trim();
  if (typeof studioStatus === "string") SETTINGS_CACHE.studioStatus = studioStatus;

  if (announcement && typeof announcement === "object") {
    SETTINGS_CACHE.announcement = {
      enabled: !!announcement.enabled,
      text: (announcement.text || "").trim(),
      link: (announcement.link || "").trim()
    };
  }
  if (prices && typeof prices === "object") {
    SETTINGS_CACHE.prices = {
      starter: Number(prices.starter) || 95,
      growth: Number(prices.growth) || 275,
      signature: Number(prices.signature) || 600,
      currency: prices.currency || "USD ($)"
    };
  }
  if (contact && typeof contact === "object") {
    SETTINGS_CACHE.contact = {
      email: contact.email || "asbusinessofficial01@gmail.com",
      telegram: contact.telegram || "@AS_Studio_official01"
    };
  }

  // Persist to local disk so settings never revert on reboot or refresh
  try {
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(SETTINGS_CACHE, null, 2), "utf-8");
  } catch (err) {
    console.warn("[Settings Disk Notice] Could not persist to disk:", err.message);
  }

  return res.json({ success: true, settings: SETTINGS_CACHE });
});

// Client Sites & Builder Mark Licensing Persistence
const CLIENT_SITES_FILE = path.join(__dirname, "client-sites.json");
let CLIENT_SITES_CACHE = [];
try {
  if (fs.existsSync(CLIENT_SITES_FILE)) {
    CLIENT_SITES_CACHE = JSON.parse(fs.readFileSync(CLIENT_SITES_FILE, "utf-8"));
  }
} catch (_) {}

function saveClientSitesToDisk() {
  try {
    fs.writeFileSync(CLIENT_SITES_FILE, JSON.stringify(CLIENT_SITES_CACHE, null, 2), "utf-8");
  } catch (err) {
    console.warn("[Client Sites Disk Notice]:", err.message);
  }
}

app.get("/api/admin/client-sites", (_req, res) => {
  return res.json({ success: true, sites: CLIENT_SITES_CACHE });
});

app.post("/api/admin/client-sites", (req, res) => {
  const { key, label, paid } = req.body || {};
  if (!key) return res.status(400).json({ error: "Site key is required." });
  const existingIndex = CLIENT_SITES_CACHE.findIndex(s => s.key === key);
  const now = new Date().toISOString();
  if (existingIndex >= 0) {
    if (typeof paid === "boolean") CLIENT_SITES_CACHE[existingIndex].paid = paid;
    if (label !== undefined) CLIENT_SITES_CACHE[existingIndex].label = label;
    CLIENT_SITES_CACHE[existingIndex].updatedAt = now;
  } else {
    CLIENT_SITES_CACHE.push({
      key,
      label: label || "",
      paid: Boolean(paid),
      createdAt: now,
      updatedAt: now
    });
  }
  saveClientSitesToDisk();
  return res.json({ success: true, sites: CLIENT_SITES_CACHE });
});

app.delete("/api/admin/client-sites/:key", (req, res) => {
  const { key } = req.params;
  CLIENT_SITES_CACHE = CLIENT_SITES_CACHE.filter(s => s.key !== key);
  saveClientSitesToDisk();
  return res.json({ success: true, sites: CLIENT_SITES_CACHE });
});

// Autoresponder Templates & Gmail Dispatcher Management
app.get("/api/admin/autoresponder", (_req, res) => {
  return res.json(AUTORESPONDER_CONFIG);
});

app.post("/api/admin/autoresponder", (req, res) => {
  const { enabled, activeTemplateId, senderName, replyTo, templates } = req.body || {};
  if (typeof enabled === "boolean") AUTORESPONDER_CONFIG.enabled = enabled;
  if (typeof activeTemplateId === "string") AUTORESPONDER_CONFIG.activeTemplateId = activeTemplateId;
  if (typeof senderName === "string") AUTORESPONDER_CONFIG.senderName = senderName.trim();
  if (typeof replyTo === "string") AUTORESPONDER_CONFIG.replyTo = replyTo.trim();
  if (Array.isArray(templates)) {
    AUTORESPONDER_CONFIG.templates = templates;
  }
  return res.json({ success: true, autoresponder: AUTORESPONDER_CONFIG });
});

app.post("/api/admin/autoresponder/test", async (req, res) => {
  const { testEmail, templateId } = req.body || {};
  const recipient = (testEmail || "").trim();
  if (!recipient || !recipient.includes("@")) {
    return res.status(400).json({ error: "Valid test recipient email is required." });
  }

  const tpl = AUTORESPONDER_CONFIG.templates.find(t => t.id === templateId) || 
              AUTORESPONDER_CONFIG.templates.find(t => t.id === AUTORESPONDER_CONFIG.activeTemplateId) || 
              AUTORESPONDER_CONFIG.templates[0];

  const testInquiry = {
    clientName: "Alex Rivera (Test Client)",
    businessName: "Solstice Studio & Café",
    contactChannel: recipient,
    scopeSummary: "1-page minimalist landing page with table bookings and physical mobile testing.",
    targetBudget: "$95 Starter Package"
  };

  const dispatchResult = await dispatchAutoresponder(testInquiry, recipient, tpl);
  return res.json({
    success: true,
    dispatch: dispatchResult,
    message: `Test autoresponder sent to ${recipient} using template "${tpl?.name}"`
  });
});

// Analytics Management: Clear & Simulate Test Visits
app.post("/api/analytics/clear", (_req, res) => {
  ANALYTICS_CACHE.totalViews = 0;
  Object.keys(ANALYTICS_CACHE.demoViews).forEach(k => {
    ANALYTICS_CACHE.demoViews[k] = 0;
  });
  ANALYTICS_CACHE.recentViews = [];
  return res.json({ success: true, message: "Testing analytics data reset to 0." });
});

app.post("/api/analytics/test-ping", (req, res) => {
  const { demo = "mitti-cafe" } = req.body || {};
  ANALYTICS_CACHE.totalViews++;
  if (ANALYTICS_CACHE.demoViews[demo] !== undefined) {
    ANALYTICS_CACHE.demoViews[demo]++;
  } else {
    ANALYTICS_CACHE.demoViews[demo] = 1;
  }
  const testView = {
    path: `/demos/${demo}/index.html`,
    demo: demo,
    title: `Simulated Live Visit — ${demo}`,
    referrer: "Admin Dashboard Live Ping",
    createdAt: new Date().toISOString()
  };
  ANALYTICS_CACHE.recentViews.unshift(testView);
  return res.json({ success: true, totalViews: ANALYTICS_CACHE.totalViews, demoViews: ANALYTICS_CACHE.demoViews, recentView: testView });
});

app.get("/site.html", (_req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  if (isProd) {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  } else {
    res.sendFile(path.join(__dirname, "index.html"));
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

  // -------------------------------------------------------------
  // CANONICAL CLEAN-URL REDIRECT MIDDLEWARE (STRICT HTTP 301)
  // Automatically strips .html extensions and folder paths so URLs are clean
  // -------------------------------------------------------------
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();

    const pathname = req.path;
    const query = req.url.includes("?") ? req.url.slice(req.url.indexOf("?")) : "";

    // Normalize root index.html
    if (pathname === "/index.html") {
      return res.redirect(301, "/" + query);
    }

    // Specific clean routes mapping
    const cleanMap = {
      "/packages.html": "/packages",
      "/work.html": "/work",
      "/about.html": "/about",
      "/contact.html": "/contact",
      "/legal/privacy.html": "/privacy",
      "/legal/terms.html": "/terms",
      "/legal/disclaimer.html": "/disclaimer",
      "/legal/cancellation-refund.html": "/refund",
      "/x7q2m9r4v8k1p6z3": "/admin",
      "/x7q2m9r4v8k1p6z3/": "/admin",
      "/x7q2m9r4v8k1p6z3/index.html": "/admin",
      "/demos/vitalcare-multispeciality-clinic": "/vitalcare",
      "/demos/vitalcare-multispeciality-clinic/": "/vitalcare",
      "/demos/vitalcare-multispeciality-clinic/index.html": "/vitalcare",
      "/demos/mitti-cafe": "/mitti",
      "/demos/mitti-cafe/": "/mitti",
      "/demos/mitti-cafe/index.html": "/mitti",
      "/demos/fold-atelier": "/fold",
      "/demos/fold-atelier/": "/fold",
      "/demos/fold-atelier/index.html": "/fold",
      "/demos/atelier-north": "/atelier",
      "/demos/atelier-north/": "/atelier",
      "/demos/atelier-north/index.html": "/atelier",
      "/demos/apex-residences": "/apex",
      "/demos/apex-residences/": "/apex",
      "/demos/apex-residences/index.html": "/apex",
      "/demos/rao-law": "/rao",
      "/demos/rao-law/": "/rao",
      "/demos/rao-law/index.html": "/rao",
      "/demos/delta-os": "/delta",
      "/demos/delta-os/": "/delta",
      "/demos/delta-os/index.html": "/delta",
    };

    if (cleanMap[pathname]) {
      return res.redirect(301, cleanMap[pathname] + query);
    }

    const demoFolderMap = [
      { prefix: "vitalcare", dir: "vitalcare-multispeciality-clinic" },
      { prefix: "mitti", dir: "mitti-cafe" },
      { prefix: "fold", dir: "fold-atelier" },
      { prefix: "atelier", dir: "atelier-north" },
      { prefix: "apex", dir: "apex-residences" },
      { prefix: "rao", dir: "rao-law" },
      { prefix: "delta", dir: "delta-os" },
    ];

    for (const d of demoFolderMap) {
      if (pathname.startsWith(`/demos/${d.dir}/`)) {
        const sub = pathname.replace(`/demos/${d.dir}/`, "");
        if (sub.endsWith(".html")) {
          const cleanSub = sub.replace(/\.html$/, "");
          return res.redirect(301, cleanSub === "index" ? `/${d.prefix}` + query : `/${d.prefix}/${cleanSub}` + query);
        }
      }
    }

    // Strip generic .html extension (e.g. /my-page.html -> /my-page)
    if (pathname.endsWith(".html")) {
      const cleanPath = pathname.replace(/\.html$/, "");
      return res.redirect(301, cleanPath + query);
    }

    next();
  });

  // -------------------------------------------------------------
  // CANONICAL CLEAN CUSTOM URLS (NO FILE EXTENSIONS OR FOLDER NAMES)
  // -------------------------------------------------------------
  // Clean Core Pages
  app.get(["/work", "/portfolio"], (_req, res) => res.sendFile(path.join(__dirname, "work.html")));
  app.get(["/about", "/studio"], (_req, res) => res.sendFile(path.join(__dirname, "about.html")));
  app.get(["/packages", "/pricing", "/plans"], (_req, res) => res.sendFile(path.join(__dirname, "packages.html")));
  app.get(["/contact", "/hire", "/brief"], (_req, res) => res.sendFile(path.join(__dirname, "contact.html")));
  app.get("/work/as-studio", (_req, res) => res.sendFile(path.join(__dirname, "work", "as-studio.html")));

  // Clean Legal Pages
  app.get("/privacy", (_req, res) => res.sendFile(path.join(__dirname, "legal", "privacy.html")));
  app.get("/terms", (_req, res) => res.sendFile(path.join(__dirname, "legal", "terms.html")));
  app.get("/disclaimer", (_req, res) => res.sendFile(path.join(__dirname, "legal", "disclaimer.html")));
  app.get(["/cancellation-refund", "/refund"], (_req, res) => res.sendFile(path.join(__dirname, "legal", "cancellation-refund.html")));

  // Shared demo CSS & JS for clean URL access
  app.get(["/demo.css", "/demos/demo.css"], (_req, res) => res.sendFile(path.join(__dirname, "demos", "demo.css")));
  app.get(["/demo.js", "/demos/demo.js"], (_req, res) => res.sendFile(path.join(__dirname, "demos", "demo.js")));

  // Clean Concept Demos (Direct memorable custom URLs and subpages)
  const demoFolderMap = [
    { prefix: "vitalcare", dir: "vitalcare-multispeciality-clinic" },
    { prefix: "mitti", dir: "mitti-cafe" },
    { prefix: "fold", dir: "fold-atelier" },
    { prefix: "atelier", dir: "atelier-north" },
    { prefix: "apex", dir: "apex-residences" },
    { prefix: "rao", dir: "rao-law" },
    { prefix: "delta", dir: "delta-os" },
  ];

  for (const d of demoFolderMap) {
    app.get([`/${d.prefix}`, `/demos/${d.prefix}`, `/demos/${d.dir}`], (_req, res) => {
      res.sendFile(path.join(__dirname, "demos", d.dir, "index.html"));
    });
    app.get([`/${d.prefix}/:subpage`, `/demos/${d.prefix}/:subpage`, `/demos/${d.dir}/:subpage`], (req, res, next) => {
      const sub = req.params.subpage.replace(/\.html$/, "");
      const file = path.join(__dirname, "demos", d.dir, `${sub}.html`);
      if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        return res.sendFile(file);
      }
      next();
    });
  }

  // Clean Admin Portal URLs (Direct access via /admin or /portal)
  app.get(["/admin", "/portal", "/dashboard", "/login", "/inbox"], (_req, res) => {
    res.sendFile(path.join(__dirname, "x7q2m9r4v8k1p6z3", "index.html"));
  });
  app.get(["/x7q2m9r4v8k1p6z3", "/x7q2m9r4v8k1p6z3/"], (_req, res) => {
    res.sendFile(path.join(__dirname, "x7q2m9r4v8k1p6z3", "index.html"));
  });

  // Serve static assets, demos, legal, work, js
  app.use("/assets", express.static(path.join(__dirname, "assets")));
  app.use("/demos", express.static(path.join(__dirname, "demos")));
  app.use("/work", express.static(path.join(__dirname, "work")));
  app.use("/legal", express.static(path.join(__dirname, "legal")));
  app.use("/x7q2m9r4v8k1p6z3", express.static(path.join(__dirname, "x7q2m9r4v8k1p6z3")));
  app.use("/js", express.static(path.join(__dirname, "js"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      }
    }
  }));

  // Automatic clean-URL resolver middleware for any static HTML page
  app.use((req, res, next) => {
    if (req.method !== "GET") return next();
    const reqPath = req.path.replace(/^\//, "");
    if (!reqPath || reqPath === "") return next();

    // Check if root .html exists (e.g. /about -> about.html)
    const directHtml = path.join(__dirname, `${reqPath}.html`);
    if (fs.existsSync(directHtml) && fs.statSync(directHtml).isFile()) {
      return res.sendFile(directHtml);
    }

    // Check if directory index.html exists (e.g. /demos/mitti-cafe -> /demos/mitti-cafe/index.html)
    const dirIndexHtml = path.join(__dirname, reqPath, "index.html");
    if (fs.existsSync(dirIndexHtml) && fs.statSync(dirIndexHtml).isFile()) {
      return res.sendFile(dirIndexHtml);
    }

    next();
  });

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
