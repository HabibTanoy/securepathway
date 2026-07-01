// Hook scenarios — scenario-first learning
// Each module presents a real situation BEFORE teaching the theory
export const HOOK_SCENARIOS = {
  "psf-1": {
    setup: "You are working your first shift as a security officer at a retail centre. A well-dressed man approaches and says he needs access to the staff area to recover personal items. He does not have a valid PSA licence number and cannot produce ID.",
    question: "Before reading this module: how do you handle this? What is your legal basis for refusing or granting access, and what do you record?",
    key_concepts: ["PSA licensing", "Access control authority", "Occurrence book documentation"],
  },
  "psf-2": {
    setup: "It is 02:30 during a night patrol. You notice a fire exit that was properly secured on your last check one hour ago is now open. It leads directly to a loading bay. No staff are present and no alarm is sounding.",
    question: "Before reading: what is your immediate priority order of actions? What do you NOT do? What must you record regardless of outcome?",
    key_concepts: ["Patrol procedure", "Scene preservation", "Occurrence book", "Supervisor notification"],
  },
  "gsoc-1": {
    setup: "You are the duty analyst at 02:00. A monitoring alert flags that an account belonging to a senior executive is being used to download 8GB of confidential files. The executive is currently listed as being on annual leave in another country.",
    question: "Before reading this module: what do you do in the next five minutes? What should you not do? Who do you call and in what order?",
    key_concepts: ["Insider threat detection", "Incident escalation", "Evidence preservation", "SOC triage procedure"],
  },
  "intel-1": {
    setup: "A client calls urgently: their competitor has just announced a product that is nearly identical to one your client has been developing in secret for 18 months. Your client suspects corporate espionage or an insider leak.",
    question: "Before reading: what intelligence collection methods would you use to investigate this? What are the legal and ethical limits? Where would you start?",
    key_concepts: ["Intelligence collection planning", "Legal and ethical constraints", "Source selection", "Analytical approach"],
  },
  "inv-1": {
    setup: "You are asked to investigate a complaint that a team leader has been bullying a junior employee. The junior employee is the only witness. The team leader has an excellent performance record and denies everything. HR want a conclusion within two weeks.",
    question: "Before reading: how do you approach an investigation where it is one person's word against another's? What evidence might exist beyond witness testimony? What makes a finding defensible?",
    key_concepts: ["Investigation framework", "Evidence beyond testimony", "Standard of proof", "Terms of reference"],
  },
  "cyber-1": {
    setup: "It is 03:00. Your SIEM fires 47 alerts. You are the only analyst on shift. Three are Critical, twelve are High. One Critical is from a known internal vulnerability scanner on its scheduled run. The other two Criticals show: (A) an external IP attempting 50 authentications on the admin portal in 3 minutes; (B) lateral movement detected across three internal workstations.",
    question: "Before reading: how do you triage these alerts? In what order do you investigate? What do you do about the scanner alert?",
    key_concepts: ["CVSS triage", "Alert correlation", "False positive suppression", "Active intrusion indicators"],
  },
  "cyber-2": {
    setup: "Your SIEM has 3,000 rules and fires 800 alerts per day. Your SOC has 4 analysts. Your manager says the team is coping. Over the last month, two genuine incidents were identified by accident — analysts noticed something unusual while working on an unrelated alert. Neither was caught by the monitoring system.",
    question: "Before reading: what is the real problem here? What would you change first? What is the difference between coping with alerts and detecting threats?",
    key_concepts: ["Alert fatigue", "Use case quality", "Detection effectiveness", "Signal-to-noise ratio"],
  },
  "cyber-3": {
    setup: "A colleague messages you at 14:00 Monday: a database server was exfiltrating data to an external IP last Friday evening. They thought it was a backup job. There is personal health data of approximately 3,400 people on that server. They fixed it Monday morning.",
    question: "Before reading: what has happened here? What regulatory deadlines are already running? What are the first three things you do?",
    key_concepts: ["GDPR Article 33 timeline", "Discovery vs occurrence", "Breach notification", "Regulatory deadline calculation"],
  },
  "cyber-4": {
    setup: "A server administrator calls you Monday 09:15. Something was wrong with a server Friday 15:30 — unusual outbound traffic and high CPU. They assumed it was a scheduled task. The server is still running. That was 65 hours ago.",
    question: "Before reading: what are your first five actions in order? What constraints exist on what you can do? What has the passage of 65 hours already affected?",
    key_concepts: ["Incident response sequencing", "Volatile evidence", "GDPR clock", "Containment before investigation"],
  },
  "cyber-5": {
    setup: "You are reviewing the security architecture of a company. 500 employees on laptops. All applications are SaaS (M365, Salesforce, ServiceNow). VPN is mandatory when working from home. The CTO says: when staff use the VPN from home they are behind our firewall — same as being in the office.",
    question: "Before reading: what is fundamentally wrong with this description? What does the VPN actually do in a SaaS environment? What model would you recommend instead?",
    key_concepts: ["Perimeter model limitations", "Zero Trust principles", "SaaS architecture", "Identity as perimeter"],
  },
  "lead-1": {
    setup: "You have just been promoted to SOC Manager. Your team of 12 already knows you. First week: two analysts submit notice on the same day. A major client review is in three weeks. Your manager wants a full staffing plan and Q3 operational review by next Friday. It is Monday morning.",
    question: "Before reading: what are your actual first five actions? What is the risk of trying to do everything at once? How do you communicate the constraint to your manager?",
    key_concepts: ["Situational leadership", "Competing priorities", "Stakeholder communication", "Team stability under pressure"],
  },
  "lead-2": {
    setup: "Month four of a nine-month project. Your vendor has now missed two deliverables. You covered the first delay by re-sequencing internal work. The second delay makes the timeline mathematically impossible without descoping or adding resource. The board expects go-live in five months.",
    question: "Before reading: what are your options? What do you tell the board and when? What happens if you stay silent and hope the vendor recovers?",
    key_concepts: ["Programme escalation", "Scope vs timeline", "Board communication", "Proactive risk management"],
  },
  "lead-3": {
    setup: "Two senior analysts have resigned in the same week. Ten remaining analysts are visibly anxious. Rumours suggest two more are considering leaving. A major client review is in three weeks. Your manager says: hire immediately.",
    question: "Before reading: what are the competing risks? How do you stabilise the team while the gap exists? What is the danger of prioritising the client review over the team?",
    key_concepts: ["Workforce stability", "Retention risk", "Team morale under pressure", "Situational leadership"],
  },
  "lead-4": {
    setup: "Your SIEM platform is seven years old. The vendor has announced end-of-support in 18 months. Replacement cost: £340,000 in year one. Your CFO asks: can we just extend the support contract? The CISO needs a board answer next week.",
    question: "Before reading: how do you frame this for the board? What are the real risks of extending support? How do you compare a known cost against uncertain risk?",
    key_concepts: ["TCO vs purchase price", "Risk of inaction", "CapEx framing", "Security business case"],
  },
  "lead-5": {
    setup: "An AI tool has been running for three months automatically scoring job candidates. HR say it has cut hiring time by 60%. You are asked to review it for compliance. You find: no DPIA, the vendor cannot demonstrate the model does not discriminate on protected characteristics, and two EU candidates have invoked GDPR rights.",
    question: "Before reading: what regulations are in play? What is the most urgent action? What are the consequences of the system having run for three months without required safeguards?",
    key_concepts: ["EU AI Act high-risk", "GDPR Article 22 automated decisions", "DPIA requirement", "Retrospective liability"],
  },
  // ── PSF ──────────────────────────────────────────────────────────────────────
  "psf-3": {
    setup: "You are the security officer responsible for fire warden duties at a five-storey commercial office building. At 14:22 on a Tuesday afternoon, the fire alarm activates. The building has 340 occupants. Three minutes later, two colleagues report smelling smoke on the third floor, but two senior managers insist it is a false alarm and refuse to leave their meeting.",
    question: "Before studying this module: what is your immediate legal and operational obligation when the alarm sounds? Can you compel the managers to evacuate, and what do you do if they refuse?",
    key_concepts: ["Fire triangle", "Evacuation procedure", "Sweep team", "Legal duty under safety legislation"],
  },
  "psf-4": {
    setup: "You are the control room operator at a logistics depot. At 03:15 your radio crackles: a mobile patrol reports a section of perimeter fence cut open and fresh tyre tracks in the mud. Two large vans are missing from the yard. No alarm was triggered. Your supervisor is not answering their phone.",
    question: "Before reading this module: what is your immediate communication priority, what information must you gather and transmit, and how do you structure your radio report to emergency services?",
    key_concepts: ["METHANE report", "Phonetic alphabet", "Control room log", "Escalation without supervisor"],
  },
  "psf-5": {
    setup: "You are the door supervisor at a licensed premises. A man presents a driving licence showing he is 22 years old. He appears intoxicated — dilated pupils, unsteady stance, slurred speech. He becomes agitated when you ask him to step aside and loudly accuses you of discrimination in front of a growing queue.",
    question: "Before this module: what legal powers do you have to refuse entry? What is your liability if you admit him? How do you de-escalate without physical intervention, and what must you document?",
    key_concepts: ["Licensing Act powers", "Duty of care", "De-escalation", "Occurrence book entry"],
  },
  // ── GSOC ─────────────────────────────────────────────────────────────────────
  "gsoc-2": {
    setup: "You open your case management dashboard at shift start. Case 4 has been in 'Research' stage for 11 days with no activity logged. Case 7 is due to the client in 90 minutes and is in 'Drafting' with no QC requested. Case 9 was created 2 hours ago and the GDPR gate is still incomplete.",
    question: "Before this module: what is the correct prioritisation order? Which cases are already in procedural breach, and what is your first action on each?",
    key_concepts: ["SLA management", "GDPR gate", "Case workflow stages", "Escalation triggers"],
  },
  "gsoc-3": {
    setup: "A client requests an urgent background check on a business associate, 'Dmitri Volkov', before a contract signing tomorrow. Your initial search returns nothing — no LinkedIn, no company registrations, no news articles, no court records. The client says he met Volkov at a conference in Dubai and he seemed credible.",
    question: "Before this module: what does a complete absence of digital footprint tell you analytically? What OSINT strategies would you use next, and what must your search log record about each query?",
    key_concepts: ["OSINT methodology", "Absence of evidence", "Search documentation", "Source reliability"],
  },
  "gsoc-4": {
    setup: "Your monitoring dashboard flags 14 alerts in the first hour of your shift. Eleven are routine. Alert 8 is a social media post from an account with 200 followers claiming a protest outside a client's HQ tomorrow. Alert 12 concerns new sanctions on a country where a client operates. Alert 14 is a potential adverse media hit on a very common name.",
    question: "Before this module: how do you decide which alerts warrant immediate RAZOR-level escalation versus standard log? What is your threshold, and how do you handle Alert 14's name ambiguity?",
    key_concepts: ["RAZOR triggers", "Alert triage", "Name disambiguation", "Monitoring SLA"],
  },
  "gsoc-5": {
    setup: "You have completed research on an individual due diligence case. Your findings: two prior county court judgments (2018, 2021), a dissolved company with HMRC tax debt, and a current LinkedIn profile claiming a senior role at a FTSE 250 firm that their HR confirms he does not hold.",
    question: "Before this module: how do you structure a BLUF for this subject? Which findings are facts, which are analytical assessment, and how do you flag the unverified employment claim without overstating certainty?",
    key_concepts: ["BLUF structure", "Fact vs assessment", "Confidence language", "Employment verification"],
  },
  // ── INTEL ─────────────────────────────────────────────────────────────────────
  "intel-2": {
    setup: "You receive a 60-page financial investigation report to quality-check. The lead analyst's key conclusion reads: 'Subject is definitely laundering money through shell companies in Cyprus.' The report cites three sources: one unnamed internal source, one report from a company the subject is in active litigation with, and one newspaper article from 2019.",
    question: "Before this module: what analytical errors and cognitive biases can you identify? How would you rewrite that conclusion using correct intelligence standards?",
    key_concepts: ["Source evaluation", "Confirmation bias", "NATO grading", "Confidence language"],
  },
  "intel-3": {
    setup: "A client needs a threat assessment for their manufacturing facility in a country experiencing political transition — 48 hour deadline. Government media says things are stable; two international NGOs report targeted attacks on foreign-owned businesses; a local contact of the client says 'everything is fine'.",
    question: "Before this module: how do you resolve conflicting source reporting? Which sources carry most analytical weight and why? What structured technique would help you reach a defensible conclusion under time pressure?",
    key_concepts: ["Analysis of Competing Hypotheses", "Source weighting", "Collection gaps", "Time-pressured analysis"],
  },
  "intel-4": {
    setup: "A multinational client wants a country risk assessment for a potential investment in a West African nation. Strong GDP growth and a newly elected reformist government — but a history of election-related violence and two coup attempts in the last decade. The military has significant economic interests the new government has pledged to audit.",
    question: "Before this module: what risk dimensions would you assess? How do you weigh positive economic indicators against structural instability? What is the single most important variable to monitor for early warning?",
    key_concepts: ["Country risk dimensions", "PESTLE", "Leading indicators", "Political risk assessment"],
  },
  "intel-5": {
    setup: "You are producing a due diligence report on a senior executive. Clean criminal record, strong career history — but a 3-year gap between 2015 and 2018 with no public record. LinkedIn skips those years. A source contact mentions hearing 'something about legal trouble in Dubai' but has no details.",
    question: "Before this module: how do you handle an unverified rumour from a source contact in a formal product? What do you write about the employment gap — and what steps do you take before the report is finalised?",
    key_concepts: ["Source handling", "Employment verification", "Caveating findings", "Due diligence gaps"],
  },
  // ── INV ───────────────────────────────────────────────────────────────────────
  "inv-2": {
    setup: "You are the lead investigating analyst on a financial crime referral. In the first 24 hours you receive: a USB stick from IT containing the suspect's emails; a spreadsheet of suspicious transactions that finance has already 'cleaned up'; and an offer from the CEO to let you interview the suspect directly, today.",
    question: "Before this module: what chain of custody and evidence integrity issues does each item raise? Which should you accept and under what conditions? What legal risk does the 'cleaned up' spreadsheet create?",
    key_concepts: ["Chain of custody", "Evidence integrity", "SHA-256 verification", "Investigation independence"],
  },
  "inv-3": {
    setup: "You are investigating supply chain conflicts of interest. After three weeks of research, you discover a major supplier — which has won the same contract three years running — is 40% owned by a close family member of the procurement director who approved all three contracts. The procurement director has just resigned and is reportedly leaving the country next week.",
    question: "Before this module: what does this finding represent legally and structurally? What is the urgency trigger, and what immediate actions must you take to preserve evidence and protect the investigation?",
    key_concepts: ["Conflict of interest", "Evidence preservation", "Urgency escalation", "Corporate investigation"],
  },
  "inv-4": {
    setup: "While conducting OSINT on a subject, you discover their home address, phone number, daily schedule, children's school, and gym — all assembled from public social media posts, a public fitness tracker profile, and a neighbourhood community forum. None of this was specifically requested by the client.",
    question: "Before this module: what are the legal and ethical boundaries here? Which information can you use, which must you not record, and what does your OSINT log document about how you found it?",
    key_concepts: ["Data minimisation", "GDPR proportionality", "OSINT documentation", "Lawful basis"],
  },
  "inv-5": {
    setup: "You have completed a six-week fraud investigation. Your final report will go to the company's legal team and may be used in civil proceedings. Key evidence: one strong item (financial records with clear trail), two circumstantial items (login timing, access logs), and a witness statement from someone with a known personal grievance against the subject.",
    question: "Before this module: how do you present these four evidence types differently? How do you handle the conflicted witness statement — include, exclude, or caveat? What does the legal team need to know about admissibility?",
    key_concepts: ["Evidence weighting", "Witness credibility", "Report structure", "Civil proceedings standard"],
  },

};