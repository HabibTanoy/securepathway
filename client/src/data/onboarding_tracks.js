export const TRACKS = {
  "4-week": {
    id: "4-week",
    name: "4-Week Accelerated",
    weeks: 4,
    badge: "ACCELERATED",
    color: "#F59E0B",  // legacy - not used; UI reads colorBg
    colorBg: "#A86410", // accessible (AA on white) - used as trackColor in Onboarding.jsx
    icon: "⚡",
    description: "Fast-track programme covering core intelligence operations skills — report writing, GDPR compliance, and essential research methods.",
    targetAudience: "Experienced professionals with prior research or analysis background",
    idealFor: ["Former LEA / military analysts","Experienced investigators transitioning roles","Research professionals with 3+ years OSINT experience","Graduate analysts with prior placement"],
    weeklyPlan: [
      { week: 1, title: "Foundations of Intelligence Operations", modules: ["w1m1","w1m2","w1m3","w1m4"] },
      { week: 2, title: "Core Report Types — ORP & Due Diligence", modules: ["w2m1","w2m2"] },
      { week: 3, title: "Advanced Research & Monitoring", modules: ["w3m1","w3m2","w4m1"] },
      { week: 4, title: "Specialised Reports, Writing Standards & Assessment", modules: ["w4m2"] },
    ],
    totalModules: 10,
    totalHours: "~7.5 hours of content",
    assignment: "pa-w1",
    platformSteps: ["hub","cases","razor","compliance","reports","scorecard","sop_bot","profile"]
  },
  "8-week": {
    id: "8-week",
    name: "8-Week Standard",
    weeks: 8,
    badge: "STANDARD",
    color: "#4575F7",  // legacy - not used; UI reads colorBg
    colorBg: "#1B4FE4", // accessible (AA on white) - used as trackColor in Onboarding.jsx
    icon: "📘",
    description: "Comprehensive training covering all core intelligence operations skills, advanced research techniques, and specialised report types.",
    targetAudience: "New analysts with basic research skills",
    idealFor: ["Recent graduates in relevant disciplines","Professionals transitioning from related roles (compliance, legal, HR)","Internal promotions into analyst roles","Career changers with strong research background"],
    weeklyPlan: [
      { week: 1, title: "Foundations of Intelligence Operations", modules: ["w1m1","w1m2","w1m3","w1m4"] },
      { week: 2, title: "Core Report Types — ORP & Due Diligence", modules: ["w2m1","w2m2"] },
      { week: 3, title: "Advanced Research & Monitoring", modules: ["w3m1","w3m2","w4m1"] },
      { week: 4, title: "Specialised Reports & Quality Control", modules: ["w4m2"] },
      { week: 5, title: "Financial Crime & Crypto Intelligence", modules: ["w5m1","w5m2"] },
      { week: 6, title: "Advanced OSINT Tradecraft", modules: ["w6m1"] },
      { week: 7, title: "Consolidation & Practice", modules: [] },
      { week: 8, title: "Final Assessment", modules: [] },
    ],
    totalModules: 13,
    totalHours: "~12.5 hours of content",
    assignment: "pa-w2",
    platformSteps: ["hub","cases","razor","compliance","reports","scorecard","sop_bot","dashboard","profile"]
  },
  "12-week": {
    id: "12-week",
    name: "12-Week Foundation",
    weeks: 12,
    badge: "FOUNDATION",
    color: "#10A0A0",  // legacy - not used; UI reads colorBg
    colorBg: "#0C7070", // accessible (AA on white) - used as trackColor in Onboarding.jsx
    icon: "🎓",
    description: "Full foundation programme covering all intelligence operations skills from first principles, including advanced specialisations and operational workflows.",
    targetAudience: "Complete beginners with no prior intelligence or research experience",
    idealFor: ["School / university leavers entering security","Career changers with no prior research experience","Operations staff transitioning into analyst roles","Any role requiring a full structured foundation"],
    weeklyPlan: [
      { week: 1, title: "Foundations of Intelligence Operations", modules: ["w1m1","w1m2","w1m3","w1m4"] },
      { week: 2, title: "Core Report Types — ORP & Due Diligence", modules: ["w2m1","w2m2"] },
      { week: 3, title: "Advanced Research & Monitoring", modules: ["w3m1","w3m2","w4m1"] },
      { week: 4, title: "Specialised Reports & Quality Control", modules: ["w4m2"] },
      { week: 5, title: "Financial Crime & Crypto Intelligence", modules: ["w5m1","w5m2"] },
      { week: 6, title: "Advanced OSINT Tradecraft", modules: ["w6m1"] },
      { week: 7, title: "Consolidation & Practice I", modules: [] },
      { week: 8, title: "Consolidation & Practice II", modules: [] },
      { week: 9, title: "Advanced Compliance & Frameworks", modules: ["w9m1"] },
      { week: 10, title: "Operational Workflows & Stakeholder Management", modules: ["w10m1"] },
      { week: 11, title: "Quality Assurance & Peer Review", modules: ["w11m1"] },
      { week: 12, title: "Final Assessment & Operational Excellence", modules: ["w12m1"] },
    ],
    totalModules: 17,
    totalHours: "~18 hours of content",
    assignment: "pa-w2",
    platformSteps: ["hub","cases","razor","compliance","reports","scorecard","sop_bot","dashboard","profile"]
  }
};

// ─── PLATFORM TOUR STEPS (from OnboardingWizard.tsx) ──────────────────────────;
