// // Assessment rubrics
export const ASSESSMENT_RUBRICS = {
  "track-gsoc": {
    title: "SOC Analyst Track Assessment",
    criteria: [
      { id:"triage",    label:"Alert & Case Triage",         weight:25, desc:"Correct prioritisation of cases/alerts using SLA, GDPR gate, and severity criteria." },
      { id:"procedure", label:"Procedural Accuracy",          weight:25, desc:"Correct application of SOPs, workflow stages, and escalation protocols." },
      { id:"gdpr",      label:"GDPR Compliance",              weight:20, desc:"Accurate identification of lawful basis, gate completion, and data subject rights." },
      { id:"writing",   label:"Professional Writing Quality", weight:15, desc:"BLUF structure, fact/assessment separation, confidence language." },
      { id:"judgment",  label:"Analytical Judgment",          weight:15, desc:"Sound reasoning, appropriate caveating, recognition of limitations." },
    ],
    gradeBands: [
      { min:85, label:"Distinction", color:"#0C7956", desc:"Exceptional — exceeds SPS standard" },
      { min:70, label:"Merit",       color:"#1B4FE4", desc:"Strong — meets SPS standard comfortably" },
      { min:60, label:"Pass",        color:"#8D691E", desc:"Satisfactory — meets minimum SPS standard" },
      { min:0,  label:"Fail",        color:"#B8222A", desc:"Does not meet standard — reassessment required" },
    ]
  },
  "track-intel": {
    title: "Intelligence Analyst Track Assessment",
    criteria: [
      { id:"sourcing",  label:"Source Evaluation",            weight:25, desc:"Correct NATO grading, source reliability assessment, collection gap identification." },
      { id:"analysis",  label:"Analytical Rigor",             weight:25, desc:"Bias mitigation, competing hypotheses, ACH application." },
      { id:"product",   label:"Intelligence Product Quality", weight:25, desc:"BLUF, confidence language, fact/assessment separation." },
      { id:"gdpr",      label:"Legal Compliance",             weight:15, desc:"Lawful basis for research, proportionality." },
      { id:"judgment",  label:"Professional Judgment",        weight:10, desc:"Appropriate caveating and escalation decisions." },
    ],
    gradeBands: [
      { min:85, label:"Distinction", color:"#0C7956", desc:"Exceptional — exceeds SPS standard" },
      { min:70, label:"Merit",       color:"#1B4FE4", desc:"Strong — meets SPS standard comfortably" },
      { min:60, label:"Pass",        color:"#8D691E", desc:"Satisfactory — meets minimum SPS standard" },
      { min:0,  label:"Fail",        color:"#B8222A", desc:"Does not meet standard — reassessment required" },
    ]
  },
  "track-pso": {
    title: "Physical Security Foundations — Track Assessment",
    criteria: [
      { id:"legal",     label:"Legal Framework & Powers",         weight:25, desc:"Accurate application of NFOAPA 1997, PSA 2004, and relevant criminal/civil law. Correct identification of lawful authority and its limits." },
      { id:"procedure", label:"Operational Procedures",           weight:25, desc:"Correct application of patrol, access control, occurrence book, use-of-force reporting, and search procedures." },
      { id:"safety",    label:"Fire Safety & Health and Safety",  weight:20, desc:"Accurate fire class/extinguisher matching, TILE assessment, evacuation roles, risk assessment." },
      { id:"comms",     label:"Communications & Reporting",       weight:15, desc:"METHANE, phonetic alphabet, occurrence book format, incident report structure." },
      { id:"judgment",  label:"Professional Judgment",            weight:15, desc:"Proportionate decision-making, appropriate escalation, duty of care application." },
    ],
    gradeBands: [
      { min:85, label:"Distinction", color:"#0C7956", desc:"Exceptional — exceeds SPS-PSO standard" },
      { min:70, label:"Merit",       color:"#1B4FE4", desc:"Strong — meets SPS-PSO standard comfortably" },
      { min:60, label:"Pass",        color:"#8D691E", desc:"Meets minimum SPS-PSO standard" },
      { min:0,  label:"Fail",        color:"#B8222A", desc:"Does not meet standard — reassessment required" },
    ]
  },
  "track-inv": {
    title: "Investigating Analyst — Track Assessment",
    criteria: [
      { id:"framework",  label:"Investigation Framework",         weight:25, desc:"Correct terms of reference, investigation planning, impartiality, legal basis for investigation." },
      { id:"evidence",   label:"Evidence Handling",               weight:25, desc:"Chain of custody, SHA-256 verification, documentation standards, admissibility considerations." },
      { id:"aml",        label:"Financial Crime & AML",           weight:20, desc:"SAR obligations, tipping-off prohibition, PEP/UBO identification, beneficial ownership threshold (25%)." },
      { id:"osint",      label:"Digital & OSINT Methodology",     weight:15, desc:"OSINT process documentation, legal risk awareness, metadata analysis, geolocation corroboration." },
      { id:"reporting",  label:"Report Writing Quality",          weight:15, desc:"ToR adherence, exculpatory evidence included, conclusions referenced to findings, BLUF structure." },
    ],
    gradeBands: [
      { min:85, label:"Distinction", color:"#0C7956", desc:"Exceptional — exceeds SPS standard" },
      { min:70, label:"Merit",       color:"#1B4FE4", desc:"Strong — meets SPS standard comfortably" },
      { min:60, label:"Pass",        color:"#8D691E", desc:"Meets minimum SPS standard" },
      { min:0,  label:"Fail",        color:"#B8222A", desc:"Does not meet standard — reassessment required" },
    ]
  },
  "track-cyber": {
    title: "Cyber Security Analyst — Track Assessment",
    criteria: [
      { id:"triage",     label:"Alert Triage & Prioritisation",  weight:25, desc:"CVSS scoring, EPSS consideration, triage order justification, false positive identification." },
      { id:"mitre",      label:"MITRE ATT&CK Application",       weight:20, desc:"Accurate tactic-to-behaviour mapping, TTPs in scenarios, detection logic grounded in framework." },
      { id:"compliance", label:"Regulatory Compliance",          weight:20, desc:"GDPR Article 33/34 timeline, ISO 27001:2022 controls, DORA incident classification, EU AI Act risk categories." },
      { id:"ir",         label:"Incident Response",              weight:20, desc:"NIST IR lifecycle, order of volatility, containment/eradication/recovery, breach notification triggers." },
      { id:"risk",       label:"Risk & Architecture",            weight:15, desc:"STRIDE application, Zero Trust principles, FAIR quantification, compensating controls rationale." },
    ],
    gradeBands: [
      { min:85, label:"Distinction", color:"#0C7956", desc:"Exceptional — exceeds SPS standard" },
      { min:70, label:"Merit",       color:"#1B4FE4", desc:"Strong — meets SPS standard comfortably" },
      { min:60, label:"Pass",        color:"#8D691E", desc:"Meets minimum SPS standard" },
      { min:0,  label:"Fail",        color:"#B8222A", desc:"Does not meet standard — reassessment required" },
    ]
  },
  "track-lead": {
    title: "Security Leadership — Capstone Assessment",
    criteria: [
      { id:"leadership", label:"Leadership & People Management", weight:25, desc:"Situational leadership application, psychological safety, performance management, JML lifecycle." },
      { id:"governance", label:"Regulatory Governance",          weight:20, desc:"GDPR controller obligations, DPIA triggers, NIS2 scope, EU AI Act governance, board reporting duties." },
      { id:"commercial", label:"Commercial & Financial",         weight:20, desc:"OpEx/CapEx distinction, FAIR-grounded business case, vendor risk, contract negotiation principles." },
      { id:"programme",  label:"Programme Management",          weight:20, desc:"Agile vs waterfall rationale, stakeholder management, executive reporting quality." },
      { id:"strategy",   label:"Strategic Judgment",            weight:15, desc:"Risk appetite framing, cross-functional influence, resource prioritisation under constraint." },
    ],
    gradeBands: [
      { min:85, label:"Distinction", color:"#0C7956", desc:"Exceptional — exceeds SPS standard" },
      { min:70, label:"Merit",       color:"#1B4FE4", desc:"Strong — meets SPS standard comfortably" },
      { min:60, label:"Pass",        color:"#8D691E", desc:"Meets minimum SPS standard" },
      { min:0,  label:"Fail",        color:"#B8222A", desc:"Does not meet standard — reassessment required" },
    ]
  }
};

// ── ADDITIONAL TRACK RUBRICS ──────────────────────────────────────────────────

export const PSO_RUBRIC = {
  id: "track-pso",
  title: "Physical Security Foundations — Track Assessment",
  criteria: [
    { id:"legal",     label:"Legal Framework & Powers",         weight:25, desc:"Accurate application of NFOAPA 1997, PSA 2004, and relevant criminal/civil law. Correct identification of lawful authority and its limits." },
    { id:"procedure", label:"Operational Procedures",           weight:25, desc:"Correct application of patrol, access control, occurrence book, use-of-force reporting, and search procedures." },
    { id:"safety",    label:"Fire Safety & Health and Safety",  weight:20, desc:"Accurate fire class/extinguisher matching, TILE assessment, evacuation role knowledge, risk assessment." },
    { id:"comms",     label:"Communications & Reporting",       weight:15, desc:"METHANE, phonetic alphabet, occurrence book format, incident report structure." },
    { id:"judgment",  label:"Professional Judgment",            weight:15, desc:"Proportionate decision-making, appropriate escalation, duty of care application." },
  ],
  gradeBands: [
    { min:85, label:"Distinction", color:"#0C7956", desc:"Exceptional — exceeds SPS-PSO standard" },
    { min:70, label:"Merit",       color:"#1B4FE4", desc:"Strong — meets SPS-PSO standard comfortably" },
    { min:60, label:"Pass",        color:"#8D691E", desc:"Satisfactory — meets minimum SPS-PSO standard" },
    { min:0,  label:"Fail",        color:"#B8222A", desc:"Does not meet standard — reassessment required" },
  ]
};

export const INV_RUBRIC = {
  id: "track-inv",
  title: "Investigating Analyst — Track Assessment",
  criteria: [
    { id:"framework",  label:"Investigation Framework",          weight:25, desc:"Correct terms of reference, investigation planning, impartiality, legal basis for investigation." },
    { id:"evidence",   label:"Evidence Handling",                weight:25, desc:"Chain of custody, SHA-256 verification, documentation standards, admissibility considerations." },
    { id:"aml",        label:"Financial Crime & AML",            weight:20, desc:"SAR obligations, tipping-off prohibition, PEP/UBO identification, beneficial ownership threshold." },
    { id:"osint",      label:"Digital & OSINT Methodology",      weight:15, desc:"OSINT process documentation, sock-puppet legal risk awareness, metadata analysis, geolocation corroboration." },
    { id:"reporting",  label:"Report Writing Quality",           weight:15, desc:"ToR adherence, exculpatory evidence inclusion, conclusions referenced to findings, BLUF structure." },
  ],
  gradeBands: [
    { min:85, label:"Distinction", color:"#0C7956", desc:"Exceptional — exceeds SPS standard" },
    { min:70, label:"Merit",       color:"#1B4FE4", desc:"Strong — meets SPS standard comfortably" },
    { min:60, label:"Pass",        color:"#8D691E", desc:"Satisfactory — meets minimum SPS standard" },
    { min:0,  label:"Fail",        color:"#B8222A", desc:"Does not meet standard — reassessment required" },
  ]
};

export const CYBER_RUBRIC = {
  id: "track-cyber",
  title: "Cyber Security Analyst — Track Assessment",
  criteria: [
    { id:"triage",     label:"Alert Triage & Prioritisation",   weight:25, desc:"Correct CVSS scoring application, EPSS consideration, triage order justification, false positive identification." },
    { id:"mitre",      label:"MITRE ATT&CK Application",        weight:20, desc:"Accurate tactic-to-behaviour mapping, TTPs identified in scenarios, detection logic grounded in framework." },
    { id:"compliance", label:"Regulatory Compliance",           weight:20, desc:"GDPR Article 33/34 timeline, ISO 27001:2022 controls, DORA incident classification, EU AI Act risk categories." },
    { id:"ir",         label:"Incident Response",               weight:20, desc:"NIST IR lifecycle application, order of volatility, containment/eradication/recovery sequence, breach notification triggers." },
    { id:"risk",       label:"Risk & Architecture",             weight:15, desc:"STRIDE application, Zero Trust principles, FAIR risk quantification, compensating controls rationale." },
  ],
  gradeBands: [
    { min:85, label:"Distinction", color:"#0C7956", desc:"Exceptional — exceeds SPS standard" },
    { min:70, label:"Merit",       color:"#1B4FE4", desc:"Strong — meets SPS standard comfortably" },
    { min:60, label:"Pass",        color:"#8D691E", desc:"Satisfactory — meets minimum SPS standard" },
    { min:0,  label:"Fail",        color:"#B8222A", desc:"Does not meet standard — reassessment required" },
  ]
};

export const LEAD_RUBRIC = {
  id: "track-lead",
  title: "Security Leadership — Capstone Assessment",
  criteria: [
    { id:"leadership", label:"Leadership & People Management",  weight:25, desc:"Situational leadership model application, psychological safety, performance management, JML lifecycle." },
    { id:"governance", label:"Regulatory Governance",           weight:20, desc:"GDPR controller obligations, DPIA triggers, NIS2 scope, EU AI Act governance, board reporting duties." },
    { id:"commercial", label:"Commercial & Financial",          weight:20, desc:"OpEx/CapEx distinction, FAIR-grounded business case, vendor risk, contract negotiation principles." },
    { id:"programme",  label:"Programme Management",            weight:20, desc:"Agile vs waterfall selection rationale, stakeholder management, executive reporting quality." },
    { id:"strategy",   label:"Strategic Judgment",              weight:15, desc:"Risk appetite framing, cross-functional influence, resource prioritisation under constraint." },
  ],
  gradeBands: [
    { min:85, label:"Distinction", color:"#0C7956", desc:"Exceptional — exceeds SPS standard" },
    { min:70, label:"Merit",       color:"#1B4FE4", desc:"Strong — meets SPS standard comfortably" },
    { min:60, label:"Pass",        color:"#8D691E", desc:"Satisfactory — meets minimum SPS standard" },
    { min:0,  label:"Fail",        color:"#B8222A", desc:"Does not meet standard — reassessment required" },
  ]
};

// Combined export for easy import
export const ALL_RUBRICS = {
  "track-pso":   PSO_RUBRIC,
  "track-gsoc":  undefined, // imported from main ASSESSMENT_RUBRICS
  "track-intel": undefined,
  "track-inv":   INV_RUBRIC,
  "track-cyber": CYBER_RUBRIC,
  "track-lead":  LEAD_RUBRIC,
};
