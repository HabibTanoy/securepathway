export const ASSIGNMENTS = {
  "pa-w1": {
    id: "pa-w1", title: "Week 1 — Intelligence Cycle Application",
    time: "2 hours", words: "500–800 words",
    scenario: `You have received the following request from a colleague in the Procurement team:

"We are about to sign a £2M contract with a new IT services provider, Nexus Digital Solutions Ltd. I've heard some rumours that the company's founder has had some issues in the past but I can't find anything specific. Can you look into it? We need to sign by end of next week."`,
    parts: [
      { title: "Part 1 — Requirements Clarification (100–150 words)", desc: "Before starting any work, what questions would you ask the requester to clarify the requirement? List at least five specific questions and explain why each one matters." },
      { title: "Part 2 — Collection Plan (150–200 words)", desc: "Based on the information provided, outline your collection plan: what sources would you use? What specific information are you trying to find? What are the known limitations?" },
      { title: "Part 3 — GDPR Compliance Gate (100–150 words)", desc: "What steps must you take before beginning research on the named founder? What lawful basis would you document, and why?" },
      { title: "Part 4 — Output Planning (150–200 words)", desc: "What type of report would you produce? What would the executive summary look like? What SLA would you apply and why?" }
    ]
  },
  "pa-w2": {
    id: "pa-w2", title: "Week 2 — ORP and Due Diligence Methodology",
    time: "3 hours", words: "800–1,200 words",
    scenario: `Case Reference: CMS-2026-0042
Service Type: Due Diligence (DDRS) + Online Risk Profile (ORP)
Subject: Meridian Consulting Group Ltd and its founder, Marcus Holt
Requester: Legal Team
Purpose: Pre-contract due diligence before awarding a £500K advisory contract
SLA: 5 business days

Background: Meridian Consulting Group Ltd is a UK-registered management consultancy, founded in 2018 by Marcus Holt who serves as CEO and sole director. The company has no website but has been recommended by a mutual contact. Marcus Holt previously worked at a major financial institution (name not provided). The company has no public financial statements available.`,
    parts: [
      { title: "Part 1 — Structure your findings", desc: "Use the standard DDRS and ORP report formats. Corporate structure, financial health, and adverse media for the entity; professional background, public presence, and reputational flags for the individual." },
      { title: "Part 2 — Apply the risk rating framework", desc: "Assign a risk rating for both the entity and the individual with specific justification drawn from your findings." },
      { title: "Part 3 — Recommendation", desc: "Make a clear recommendation: proceed / proceed with conditions / do not proceed. Be specific about what conditions, if any, apply." },
      { title: "Part 4 — Source list and GDPR documentation", desc: "List all sources consulted with NATO grades. Document the lawful basis and any data minimisation decisions." }
    ]
  }
};

// ─── ATOMS ───────────────────────────────────────────────────────────────────

// ─── STORAGE HELPERS ──────────────────────────────────────────
async function storeGet(key) {
  try { const r = await window.storage.get(key); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function storeSet(key, val) {
  try { await window.storage.set(key, JSON.stringify(val)); } catch {}
}

// ─── PLATFORM HELPERS ─────────────────────────────────────────;
