// SecurePathway SOP Library

const SOP_LIBRARY = {
  "analyst-workflow": {
    id: "analyst-workflow", title: "Analyst Workflow", category: "Operations",
    version: "1.0", estimated: 30, type: "sop",
    summary: "End-to-end workflow for analysts from service request receipt to delivery. Covers GDPR gate, research, drafting, QC, and archiving.",
    steps: ["Receive assignment notification in Case Management","Review the service request — confirm scope, subject, GDPR lawful basis","Complete GDPR compliance gate before researching named individuals","Advance workflow stage as work progresses","Conduct research and log all sources","Use AI Assist for draft summaries — review critically before use","QC review: accuracy, completeness, GDPR, formatting, source quality","Deliver output, log AHC hours, archive case"],
    slas: { ORP: "5 days / 48hr hi-pri", IR: "10 days / 72hr hi-pri", DDRS: "5 days / 48hr hi-pri", FinCrime: "7 days / 72hr hi-pri", RA: "7 days / 72hr hi-pri", "GDPR DSAR": "30 calendar days" }
  },
  "case-management": {
    id: "case-management", title: "Case Management", category: "Operations",
    version: "1.0", estimated: 45, type: "sop",
    summary: "How to create, manage, and close cases in the platform. Covers lifecycle stages, roles, and quality standards.",
    steps: ["Navigate to Cases → + New Case","Complete: Case Title, Type, Priority, Assigned Analyst, Due Date, Description","Advance stage as work progresses: Open → In Progress → Pending Review → On Hold → Closed","Log all notes, comments, and evidence against the case","Ensure AHC hours are logged within 24 hours of completing work","Archive closed cases — feeds scorecard and weekly recap"]
  },
  "gdpr-gate": {
    id: "gdpr-gate", title: "GDPR Compliance Gate", category: "Compliance",
    version: "1.0", estimated: 30, type: "sop",
    summary: "Mandatory compliance check before researching named individuals. Covers lawful basis, purpose documentation, and data retention.",
    steps: ["Gate triggers automatically for ORP, IR, DDRS, Monitoring cases involving EU/UK individuals","Confirm subject jurisdiction","Select legal basis: Legitimate Interest (most common), Contract, Legal Obligation, Consent","Document purpose and data minimisation","Set retention period (default 12 months)","Confirm — case advances to gdpr_confirmed stage automatically"],
    retention: { "Subject personal data": "12 months", "Research notes": "12 months", "Final reports": "36 months", "GDPR gate records": "60 months" }
  },
  "razor-sop": {
    id: "razor-sop", title: "RAZOR Intelligence", category: "Intelligence",
    version: "1.0", estimated: 60, type: "sop",
    summary: "Rapid intelligence dissemination product for emerging threats. Designed for speed — produced within hours, not days.",
    triggers: ["Emerging threat requiring immediate stakeholder awareness","Significant security incident in region/sector of interest","Sanctions list update affecting current subjects","Major geopolitical development impacting threat landscape","Monitoring alert triaged as High or Critical priority"],
    steps: ["Navigate to RAZOR Intelligence → + New Intelligence Item","Title: concise headline (e.g. 'RAZOR: Escalating Civil Unrest in Lagos, Nigeria')","Classify: threat level, geography, category","Draft the item: headline finding → context → analyst assessment → recommended action","Assign to reviewer for approval","Distribute to stakeholder list on approval"]
  },
  "osint-search": {
    id: "osint-search", title: "OSINT Search Automation", category: "Intelligence",
    version: "1.0", estimated: 30, type: "sop",
    summary: "Structured framework for OSINT research. Covers search profiles, Boolean search strings, AI-powered deep research, and watchlists.",
    templates: [
      { name: "Person Investigation", searches: ["Google", "LinkedIn", "Social media", "Court records", "Property records", "Employment/Education"] },
      { name: "Entity & Corporate", searches: ["Corporate registry", "UBO search", "Financial filings", "Sanctions", "Adverse media", "Network mapping"] },
      { name: "Domain & Cyber", searches: ["WHOIS lookup", "DNS records", "SSL certificates", "Subdomain enumeration", "Technology stack", "IP geolocation"] },
      { name: "Financial Investigation", searches: ["Bank records", "Property records", "Corporate holdings", "Crypto analysis", "Tax records", "Beneficial ownership"] },
      { name: "Social Media Deep Dive", searches: ["Platform-specific searches", "Archived content", "Username correlation", "Geolocation analysis", "Network mapping"] }
    ]
  },
  "ddrs-individual": {
    id: "ddrs-individual", title: "Due Diligence — Individual", category: "Reports",
    version: "1.0", estimated: 90, type: "sop",
    summary: "Individual Due Diligence Report (DDRS-IND): evidence-based risk assessment of a named individual. Requires full name, DOB, nationality, known employer.",
    sections: ["Subject Identification & Verification","Corporate Affiliations & Directorships","Litigation & Regulatory History","Adverse Media Screening","Sanctions & PEP Screening","Social Media & Digital Footprint","Reputational Risk Summary","Key Judgements & Confidence Indicators","Recommendations"]
  },
  "ddrs-entity": {
    id: "ddrs-entity", title: "Due Diligence — Entity", category: "Reports",
    version: "1.0", estimated: 120, type: "sop",
    summary: "Entity Due Diligence Report (DDRS-ENT): corporate structure, regulatory standing, and risk profile of a named company or organisation.",
    sections: ["Entity Identification & Corporate Structure","Beneficial Ownership & UBO Research","Financial Health & Accounts","Regulatory & Compliance History","Sanctions & Adverse Media","Key People & Associates","Litigation & Legal History","Country Risk & Jurisdictional Considerations","Reputational Risk Summary","Key Judgements & Recommendations"]
  },
  "report-ir": {
    id: "report-ir", title: "Investigation Report", category: "Reports",
    version: "3.0", estimated: 180, type: "sop",
    summary: "Comprehensive intelligence product documenting findings of a structured investigation. Most detailed report type. Used when legal/regulatory proceedings may follow.",
    stages: ["requested → gdpr_confirmed → assigned → scoping → research → analysis → drafting → qc → delivered"],
    sections: ["Executive Summary","Terms of Reference & Methodology","Key Findings (fact only)","Analysis (assessment of facts)","Conclusions","Recommendations","Evidence Schedule & Appendices"]
  },
  "report-orp": {
    id: "report-orp", title: "Online Risk Profile", category: "Reports",
    version: "3.0", estimated: 120, type: "sop",
    summary: "Maps and assesses an individual's digital footprint, online presence, and associated risk indicators. Used for reputational exposure assessment.",
    stages: ["requested → gdpr_confirmed → assigned → research → drafting → qc → delivered"],
    sections: ["Subject Overview","Platform Presence (50+ platforms)","Adverse Content Assessment","PII Exposure Analysis","Dark Web Mention Check","Reputational Risk Rating","Recommended Actions"]
  },
  "report-ra": {
    id: "report-ra", title: "Risk Assessment (TRA/ERA)", category: "Reports",
    version: "3.0", estimated: 150, type: "sop",
    summary: "Travel Risk Assessment (TRA) and Event Risk Assessment (ERA). Evidence-based assessment of threats, vulnerabilities, and recommended mitigations.",
    stages: ["requested → assigned → research → drafting → qc → delivered"],
    sections: ["Country/Venue Overview","Threat Environment","Security Risks","Health & Medical Risks","Transportation Risks","Recommended Mitigations","Emergency Contacts & Protocols"]
  },
  "search-builder": {
    id: "search-builder", title: "Search Builder", category: "Intelligence",
    version: "1.0", estimated: 20, type: "wi",
    summary: "Automates creation of research search URLs based on case type. Tracks completion status and ensures all required sources are checked.",
    searchSets: { ORP: ["Google", "LinkedIn", "Companies House", "Court Records", "Adverse Media", "Social Media"], "Due Diligence": ["Google", "Bing", "LinkedIn", "OpenCorporates", "Sanctions", "PEP", "Adverse Media", "Offshore Leaks"], FinCrime: ["Sanctions", "PEP", "Adverse Media", "OpenCorporates", "Offshore Leaks", "SEC/FCA"], Crypto: ["Blockchain Explorer", "Dark Web", "Data Breaches", "IP Lookup"] }
  },
  "writing-guide": {
    id: "writing-guide", title: "Writing Style Guide", category: "Quality",
    version: "1.0", estimated: 60, type: "wi",
    summary: "Writing standards for all intelligence products. British English, third person, active voice, past tense for events, formal tone, no speculation.",
    rules: ["Use British English throughout (organisation, colour, defence, analyse)","Write in third person — never 'I', 'we', 'our team'","Active voice as default. Passive when actor is unknown","Past tense for completed events; present for current states","Separate FACT from ASSESSMENT from RECOMMENDATION clearly","Quantify where possible ('three incidents' not 'several')","Define acronyms on first use. Short paragraphs (3–5 sentences)","No sensationalism. No inflammatory language. No speculation"]
  },
  "monitoring-searches": {
    id: "monitoring-searches", title: "Monitoring Searches", category: "Intelligence",
    version: "1.0", estimated: 30, type: "sop",
    summary: "Create and manage ongoing OSINT searches against subjects of interest. Alerts when new relevant information is identified.",
    steps: ["Navigate to Monitoring Searches → + New Search","Configure: subject, keywords (include aliases), source categories, regions, language, frequency, linked case","Review results: mark as Relevant / Noted / Dismissed","Relevant results can be escalated to RAZOR or added to linked case","Tune searches regularly to reduce noise: tighten keywords, add exclusions","Set expiry dates — close searches when no longer needed"]
  },
  "hr-investigations": {
    id: "hr-investigations", title: "HR Investigations", category: "Investigations",
    version: "1.0", estimated: 45, type: "sop",
    summary: "HR investigation case management using the 5W methodology. Covers misconduct, discrimination, harassment, whistleblowing, fraud, and more.",
    caseTypes: ["Harassment", "Discrimination", "Misconduct", "Policy Violation", "Theft/Fraud", "Retaliation", "Data Breach", "Social Media Breach", "Substance Misuse", "Workplace Violence"],
    steps: ["Create new case: title, type, priority, initial details","5Ws tab: document Who, What, When, Where, Why","Evidence tab: upload files with descriptions","Timeline tab: auto-generated audit trail (read-only)","Status progression: Open → Under Investigation → Pending Review → Closed","All findings must distinguish fact from inference"]
  },
  "kyc-aml": {
    id: "kyc-aml", title: "KYC/AML Hub", category: "Compliance",
    version: "1.0", estimated: 45, type: "sop",
    summary: "Know Your Customer and Anti-Money Laundering compliance. Customer due diligence, EDD for high-risk profiles, SAR generation.",
    steps: ["Search/filter customer by name or risk level","Open Customer Due Diligence Profile","Review Risk Assessment History","Verify identity via Document Checklist","Assign/update Risk Score","High/Critical score → EDD workflow initiates automatically","Document all EDD activities in customer profile","Generate compliance report for regulatory submission"]
  },
  "country-risk": {
    id: "country-risk", title: "Country Risk Register", category: "Intelligence",
    version: "1.0", estimated: 20, type: "sop",
    summary: "Authoritative record of risk ratings for all countries of operational interest. Feeds into TRA/ERA reports.",
    ratings: { LOW: "Stable environment; standard precautions sufficient", MEDIUM: "Elevated risks; heightened awareness required", HIGH: "Significant threats; enhanced security measures required", CRITICAL: "Extreme risk; senior approval and specialist support needed", UNASSESSED: "No current assessment; do not use for operational decisions" },
    refresh: { HIGH_CRITICAL: "Monthly", MEDIUM: "Quarterly", LOW: "Bi-annually", "Post-significant incident": "Immediate" }
  },
  "jml-tracker": {
    id: "jml-tracker", title: "JML Tracker", category: "Operations",
    version: "1.0", estimated: 35, type: "sop",
    summary: "Joiners, Movers, Leavers management. Onboarding checklists, role transitions, access revocation workflows.",
    joinerChecklist: ["Platform account creation (Day 1)", "Role-based access provisioning (Day 1)", "Mandatory SOP training assigned (Week 1)", "Mentor assigned (Day 1)", "First case supervised walkthrough (Week 2)", "Probation review scheduled (Month 3)"],
    leaverChecklist: ["Revoke platform access", "Transfer case ownership", "Archive personal data", "Collect equipment", "Exit interview scheduled"]
  },
  "hours-pto": {
    id: "hours-pto", title: "Hours & PTO Management", category: "Operations",
    version: "1.0", estimated: 20, type: "sop",
    summary: "Log working hours against tasks and cases. Manage leave requests. All hours logged daily, by Friday 15:00.",
    categories: ["Report Writing", "Research", "Review", "Monitoring", "Training", "Admin", "Meeting"],
    rules: ["Log hours daily — not at end of week", "7 productive hours per day target (8hr minus 1hr lunch)", "All hours logged by Friday 15:00 for weekly recap", "Log in 0.25-hour increments", "Category required for all entries"]
  },
  "scorecard": {
    id: "scorecard", title: "Scorecard & Performance", category: "Operations",
    version: "1.0", estimated: 20, type: "sop",
    summary: "Individual and team performance metrics. Output, quality, and efficiency indicators for workload management and performance reviews.",
    outputMetrics: ["Reports Completed", "Cases Closed", "RAZOR Items Published", "Monitoring Alerts Triaged"],
    qualityMetrics: ["QC Pass Rate", "Report Return Rate", "SLA Compliance Rate", "Average AHC vs PHC Variance"]
  },
  "financial-investigations": {
    id: "financial-investigations", title: "Financial Investigations", category: "Investigations",
    version: "1.0", estimated: 60, type: "sop",
    summary: "Financial crime investigation, PEP screening, sanctions checks (OFAC/EU/UN), SAR generation for MLRO review.",
    steps: ["New Investigation → subject details → select Due Diligence Report type","System auto-screens for PEP status","Sanctions tab: check OFAC, EU, UN lists","Draft SAR for MLRO review if suspicious activity identified","MLRO approves SAR before regulatory submission","Full audit trail maintained for all activities"]
  },
  "threat-intel": {
    id: "threat-intel", title: "Threat Intelligence Feed", category: "Intelligence",
    version: "1.0", estimated: 30, type: "sop",
    summary: "Aggregates and analyses threat intelligence from FinCEN, CISA, FCA, OFAC, FLAME Framework. Maps to MITRE ATT&CK, NIST CSF, ISO 27001.",
    feeds: ["FinCEN — AML advisories and enforcement actions", "CISA — Cyber threat alerts and advisories", "FCA — UK regulatory updates and enforcement", "OFAC — Sanctions updates and designations", "FLAME Framework — Fraud threat taxonomy"],
    steps: ["Monitor dashboard for new alerts (Total/New/Active Feeds)","Triage each alert: acknowledged → investigating → mitigated → dismissed","Document actions taken in response","Map threats to regulatory frameworks","Produce threat intelligence briefing for management when required"]
  },
  "supply-chain-inv": {
    id: "supply-chain-inv", title: "Supply Chain Investigations", category: "Investigations",
    version: "1.0", estimated: 45, type: "sop",
    summary: "Cargo theft, freight fraud, warehouse theft, and supply chain security investigations using the 5W framework.",
    caseTypes: ["Cargo Theft", "Warehouse Theft", "Freight Fraud", "Counterfeit Goods", "Diversion/Misrouting", "Internal Theft", "Hijacking"],
    steps: ["New Investigation: title, incident type, severity, region, incident date/location, route, carrier, value, goods description","5W framework: Who (persons), What (MO), When (timeline), Where (location), Why (motive)","Evidence collection and chain of custody","Recovery tracking and insurance liaison","Law enforcement liaison as required","Final investigation report"]
  },

  "workflow-stages": {
    title: "Case Workflow Stages",
    version: "v2.1",
    lastUpdated: "2026-01",
    category: "Operations",
    summary: "Defines the mandatory workflow stages for each service type and the quality gates between them.",
    steps: [
      "REQUESTED: Service request received from client or internal requester. SLA clock starts on assignment, not on receipt.",
      "GDPR_CONFIRMED: GDPR compliance gate completed — lawful basis confirmed, retention period set, data minimisation checked. Mandatory for all cases involving natural persons. Case cannot advance without this.",
      "ASSIGNED: Case assigned to an analyst. Analyst must acknowledge and set initial PHC estimate within 2 hours of assignment.",
      "SCOPING (IR only): Investigator reviews brief, agrees terms of reference with requester, confirms scope boundaries and any limitations. Required before research begins on Investigation Reports.",
      "RESEARCH: Active information gathering using Search Builder templates and approved sources. All searches logged. AHC tracked in real time.",
      "ANALYSIS: Processing of research findings into conclusions. ACH, link analysis, and source grading applied. Key Judgements drafted.",
      "DRAFTING: Report or product written. BLUF structure applied. Fact vs Assessment vs Recommendation clearly separated.",
      "QC: Quality check by senior analyst or supervisor. Checks: sourcing, formatting, BLUF, key judgements, fact/assessment separation, GDPR fields complete. QC can return to DRAFTING with specific feedback.",
      "DELIVERED: Output transmitted to client via secure channel. Delivery confirmed and logged. Case transitions to archive after retention period.",
    ],
    byProduct: {
      "ORP": ["REQUESTED","GDPR_CONFIRMED","ASSIGNED","RESEARCH","DRAFTING","QC","DELIVERED"],
      "IR": ["REQUESTED","GDPR_CONFIRMED","ASSIGNED","SCOPING","RESEARCH","ANALYSIS","DRAFTING","QC","DELIVERED"],
      "DDRS-IND": ["REQUESTED","GDPR_CONFIRMED","ASSIGNED","RESEARCH","DRAFTING","QC","DELIVERED"],
      "DDRS-ENT": ["REQUESTED","ASSIGNED","RESEARCH","DRAFTING","QC","DELIVERED"],
      "RA": ["REQUESTED","ASSIGNED","RESEARCH","ANALYSIS","DRAFTING","QC","DELIVERED"],
      "RAZOR": ["TRIGGERED","DRAFTING","SENIOR_REVIEW","DISTRIBUTED"],
    },
    notes: "Advancing a case past a stage gate without completing that stage's requirements is a quality failure. Skipping GDPR_CONFIRMED on a natural person case is a GDPR violation. QC returning a case does not reset the SLA clock — the SLA runs continuously from assignment."
  },

};

export { SOP_LIBRARY };
