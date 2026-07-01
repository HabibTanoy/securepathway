export const TC_MODULES = {
  w1m1: {
    id: "w1m1", week: 1, num: 1, mins: 45,
    title: "What is Intelligence? The Intelligence Cycle",
    content: `## Learning Objectives
By the end of this module you will be able to:
- Define intelligence and distinguish it from raw data and information
- Describe the six phases of the intelligence cycle
- Explain why each phase matters in an operational context

---

## 1. Intelligence vs. Data vs. Information

Most people use the words data, information, and intelligence interchangeably. In professional intelligence operations, they mean very different things.

**Data** — Raw, unprocessed facts. Example: "John Smith, DOB 1982, Company Director"

**Information** — Data that has been organised or contextualised. Example: "John Smith is a director of three companies, two of which were dissolved"

**Intelligence** — Information that has been analysed, assessed, and is actionable. Example: "John Smith presents a medium risk of financial misconduct based on his directorship history, adverse media, and a potential sanctions match — recommend enhanced due diligence before contract award"

Intelligence is the end product of a deliberate analytical process. It answers the question *"so what?"* — it tells the decision-maker what to do with the information.

---

## 2. The Intelligence Cycle

The intelligence cycle is the framework that governs how intelligence is produced. It has six phases:

**Phase 1 — Direction (Planning & Requirements):** The intelligence process begins with a requirement. Someone needs to know something in order to make a decision. Always clarify the requirement before starting work — a poorly defined requirement produces poor intelligence.

**Phase 2 — Collection:** Once the requirement is clear, identify and collect relevant information. Sources are categorised as OSINT (open source), HUMINT (human intelligence), SIGINT (signals), FININT (financial), and IMINT (imagery). In most corporate intelligence roles, OSINT and FININT are primary.

**Phase 3 — Processing:** Organise, translate if necessary, and prepare raw information for analysis. Deduplicate sources, verify accessibility, flag collection gaps.

**Phase 4 — Analysis:** The core of the intelligence function. Evaluate collected information, identify patterns and connections, assess reliability, draw conclusions. Key techniques include source evaluation, pattern of life analysis, link analysis, timeline reconstruction, and risk matrix assessment.

**Phase 5 — Dissemination:** Deliver the intelligence product in a format appropriate to the audience. A technical analyst needs detail; a senior executive needs a one-page summary with clear recommendations.

**Phase 6 — Feedback:** The requester reviews the product and provides feedback. Did it answer the question? Was the format right? Was it on time? This feedback improves future production.

---

## 3. The Analyst's Mindset

**Intellectual honesty** — follow the evidence wherever it leads, even if it contradicts your initial hypothesis. Confirmation bias (seeking evidence that supports what you already believe) is the most common analytical failure.

**Source scepticism** — never accept a single source as definitive. Apply the **3-source rule**: a finding should be corroborated by at least three independent sources before being presented as established fact.

**Proportionality** — depth of analysis should match the significance of the decision it will inform.

**Clarity of expression** — intelligence is only useful if the reader understands it. Write in plain language. State your conclusions clearly. Support them with evidence.

---

## 4. Key Principles

- Intelligence is not investigation — it informs decisions; it does not replace legal or HR processes
- Intelligence is not surveillance — all collection must be lawful, proportionate, and documented
- Intelligence has a shelf life — always note the date of each check and reassess if significant time has passed
- Intelligence requires judgment — tools and databases are aids to analysis, not substitutes for it`,
    quiz: [
      { q: "Which of the following best describes 'intelligence' in a professional context?", opts: ["Any information collected about a subject","Raw data gathered from open sources","Analysed, assessed information that is actionable and answers 'so what?'","A database search result"], ans: 2 },
      { q: "What is the first phase of the intelligence cycle?", opts: ["Collection","Analysis","Direction (Planning & Requirements)","Dissemination"], ans: 2 },
      { q: "The '3-source rule' means that:", opts: ["You must use exactly three databases for every search","A finding should be corroborated by at least three independent sources before being presented as established fact","You must interview three witnesses before writing a report","All reports require three reviewers"], ans: 1 },
      { q: "Which analytical failure involves seeking evidence that supports what you already believe?", opts: ["Source scepticism","Confirmation bias","Proportionality error","Collection gap"], ans: 1 },
      { q: "OSINT stands for:", opts: ["Online Security Intelligence Tools","Open Source Intelligence","Operational Source and Information Tracking","Organised Surveillance Intelligence Network"], ans: 1 }
    ]
  },
  w1m2: {
    id: "w1m2", week: 1, num: 2, mins: 50,
    title: "Legal & Ethical Framework — GDPR, Lawful Basis, and Data Minimisation",
    content: `## Learning Objectives
- Understand the legal obligations that govern intelligence collection on individuals
- Identify when GDPR applies and which lawful basis is appropriate
- Apply the data minimisation principle in practice
- Know when to stop, escalate, or refuse a collection task

---

## 1. Why Legal Compliance Matters in Intelligence Work

Intelligence analysts work with personal data every day. Without a clear legal framework, this work can expose the organisation — and the analyst personally — to significant legal, regulatory, and reputational risk. GDPR is not a bureaucratic hurdle — it is the framework that legitimises what you do.

---

## 2. When GDPR Applies

GDPR applies whenever you process personal data about individuals in the EU/EEA or UK. 'Processing' includes collecting, storing, analysing, and sharing data. The GDPR applies regardless of where your organisation is based — if you are researching an EU/UK individual, GDPR governs that research.

---

## 3. The Six Lawful Bases

You must identify a lawful basis before processing any personal data. For corporate intelligence work, the most common is:

**Legitimate Interests (Article 6(1)(f))** — the most commonly used basis in intelligence work. The organisation (or a third party) has a legitimate interest in the processing, and this interest is not overridden by the individual's privacy rights. Examples: pre-contract due diligence, fraud investigation, background screening of third parties.

The Legitimate Interests Assessment (LIA) has three components: Purpose test (is the purpose legitimate?), Necessity test (is processing necessary for that purpose?), Balancing test (is the legitimate interest overridden by the individual's rights?).

Other lawful bases: Legal obligation (GDPR Article 6(1)(c)) — where processing is required to comply with law; Contract (Article 6(1)(b)) — where processing is necessary to perform or prepare a contract; Consent (Article 6(1)(a)) — explicit, informed, freely given consent (rarely used in corporate intelligence due to high standard required).

---

## 4. The GDPR Compliance Gate

Before beginning research on any named individual, you must complete the GDPR Compliance Gate. This is a mandatory check that documents:
1. The lawful basis for processing
2. The specific purpose of the research
3. The data minimisation plan (what data will be collected, and why)
4. The retention period
5. Manager confirmation

The gate creates a timestamped audit record. Research cannot begin until the gate is completed.

---

## 5. Data Minimisation

Collect only personal data that is necessary for the stated purpose. Do not collect data "just in case it might be useful later." Each piece of personal data collected must have a documented reason.

---

## 6. When to Stop or Escalate

Stop immediately if: the subject has made a Subject Access Request (SAR); there are grounds to believe the research is being used for an improper purpose; the research has expanded beyond the documented purpose without updated approval.

Escalate to the Data Protection Officer (DPO) if: you are unsure whether the research is lawful; a SAR has been received; you discover a data breach during your work.

Refuse the task if: no lawful basis can be identified; the purpose is clearly disproportionate; the requester refuses to provide the information needed to complete the compliance gate.`,
    quiz: [
      { q: "GDPR applies to your intelligence work when:", opts: ["Only when researching UK subjects","Whenever you process personal data about individuals in the EU/EEA or UK","Only when using automated tools","Only for criminal investigations"], ans: 1 },
      { q: "Which lawful basis is most commonly used for corporate intelligence and due diligence?", opts: ["Consent","Contract","Legitimate Interests","Legal Obligation"], ans: 2 },
      { q: "Data minimisation means:", opts: ["Using the minimum number of research tools","Collecting and retaining only personal data that is necessary for the documented purpose","Keeping reports as short as possible","Only searching databases, not social media"], ans: 1 },
      { q: "If a subject makes a Subject Access Request (SAR) during your research, you should:", opts: ["Continue research and respond to the SAR after completion","Stop immediately and escalate to the Data Protection Officer","Delete all data collected so far","Inform the requester and continue"], ans: 1 },
      { q: "Which of the following is an ethical violation in intelligence work?", opts: ["Using publicly available court records","Creating a fake social media account to access a subject's private posts","Running sanctions checks on a third party","Documenting sources in a case file"], ans: 1 }
    ]
  },
  w1m3: {
    id: "w1m3", week: 1, num: 3, mins: 40,
    title: "Source Evaluation — Reliability, Credibility, and the 3-Source Rule",
    content: `## Learning Objectives
- Apply the NATO source and information reliability grading system
- Distinguish between source reliability and information credibility
- Apply the 3-source rule in practice
- Identify common source quality pitfalls

---

## 1. Why Source Evaluation Matters

An intelligence product is only as good as its sources. A report built on unreliable or uncorroborated sources can lead to wrong decisions, legal challenges, and reputational damage. Source evaluation is a core professional discipline — not optional.

---

## 2. The NATO Grading System

The NATO 6×6 system grades sources on two independent dimensions:

**Source reliability (A–F):**
- A — Completely reliable (no doubts about authenticity, trustworthiness, or competence)
- B — Usually reliable (minor doubts; generally reliable track record)
- C — Fairly reliable (significant doubts; some reliable information in the past)
- D — Not usually reliable (significant doubts; generally unreliable)
- E — Unreliable (history of invalid or fabricated information)
- F — Cannot be judged (insufficient basis for assessing reliability)

**Information credibility (1–6):**
- 1 — Confirmed by other sources
- 2 — Probably true (consistent with known facts, corroborated but not confirmed)
- 3 — Possibly true (more likely than not, some corroboration)
- 4 — Doubtful (unlikely but not implausible)
- 5 — Improbable (contradicted by known facts)
- 6 — Cannot be judged (no basis for assessment)

Combine as A2, B3, D4 etc. A grade of A1 means: completely reliable source, confirmed by other sources — the highest standard.

---

## 3. Distinguishing Source and Information Reliability

Source reliability and information reliability are **independent**. A reliable source can provide incorrect information. An unreliable source can occasionally be correct.

Example: A major newspaper (B source) publishes a story based on an anonymous tip (F information) about a court case that is independently confirmed by public court records — the court record is A1, the newspaper article is B2.

Always grade both dimensions separately.

---

## 4. The 3-Source Rule in Practice

A finding should be corroborated by **at least three independent sources** before being presented as established fact in a report.

Three news articles that all cite the same court document = **one source** (the court document) reported three times — not independent corroboration.

Independence means: the sources collected their information separately, without relying on a common original source.

When you cannot achieve 3-source corroboration: present the finding as unconfirmed (caveat it clearly); grade the information accordingly; do not elevate it to established fact.

---

## 5. Common Source Quality Pitfalls

- Circular reporting: multiple sources all ultimately trace back to a single originating source
- Wikipedia as a primary source: useful for identifying primary sources, never cite as authoritative
- Undated content: content without a clear publication or access date cannot be properly assessed
- Anonymised sources: all-caps disclaimers ("SOURCES CLAIM...") without attribution are F6 — treat with extreme caution
- Translated content: translations introduce interpretation error — note the translation in your source citation`,
    quiz: [
      { q: "In the NATO grading system, what does a grade of 'A1' indicate?", opts: ["The source is anonymous but the information is accurate","The source is completely reliable and the information is confirmed by other sources","The source is authoritative and the information is probably true","The source is a government agency"], ans: 1 },
      { q: "Three news articles that all cite the same court document are:", opts: ["Three independent corroborating sources","One source (the court document) reported three times — not independent corroboration","Worth treating as B2 combined","Sufficient for the 3-source rule"], ans: 1 },
      { q: "When can you cite Wikipedia as a primary source in an intelligence report?", opts: ["When the article has citations","Only for factual background information","Never — Wikipedia is only useful for identifying primary sources, which should be accessed directly","When the article was recently updated"], ans: 2 },
      { q: "If you cannot find corroboration for a finding, you should:", opts: ["Remove it from the report entirely","Present it as unconfirmed with the single source cited and grade it accordingly","Present it as fact since you found it in a reputable publication","Ask the requester if they want it included"], ans: 1 },
      { q: "When citing a source in a report, you should include:", opts: ["The source name, URL or reference, date accessed, and date of original publication","Just the URL","The source name and the date you accessed it","Whatever information the source provides about itself"], ans: 0 }
    ]
  },
  w1m4: {
    id: "w1m4", week: 1, num: 4, mins: 35,
    title: "Case Management — Workflow, Documentation, and SLA Standards",
    content: `## Learning Objectives
- Understand the end-to-end case lifecycle from intake to archive
- Apply documentation standards at each stage
- Manage SLAs and escalate appropriately when at risk of breach
- Understand the quality assurance (QC) process

---

## 1. The Case Lifecycle

Every intelligence task — whether a due diligence report, investigation, monitoring assignment, or risk assessment — should be managed as a case. A case provides a single record of all work done, an audit trail for compliance and legal purposes, a quality control checkpoint, and a performance measurement basis.

**Stages:** Intake → Assignment → Research → Drafting → QC Review → Delivery → Archive

---

## 2. Documentation Standards

At intake: record the requester, purpose, subject(s), type of output required, SLA, and GDPR lawful basis.

During research: log all sources checked (including negative results), all search strings used, and all findings. Record timestamps on all entries.

At drafting: version-control your drafts. Every draft should be saved with a version number and date.

At QC: document what was reviewed, any changes required, and who approved the final product.

At delivery: record the delivery timestamp, recipient, and method.

At archive: ensure all data is stored in accordance with the retention policy — subject personal data: 12 months; reports: 36 months; GDPR gate records: 60 months.

---

## 3. SLA Standards

SLAs vary by product type:
- ORP — 5 business days (Standard), 48 hours (High Priority)
- Investigation Report — 10 business days (Standard), 72 hours (High Priority)
- Due Diligence (DDRS) — 5 business days (Standard), 48 hours (High Priority)
- Financial Crime — 7 business days (Standard), 72 hours (High Priority)
- Risk Assessment — 7 business days (Standard), 72 hours (High Priority)
- GDPR DSAR — 30 calendar days (statutory)

SLA management: review your case queue at the start of every shift. Identify any cases approaching their SLA deadline. If you are at risk of breach, notify your manager immediately — do not wait until the breach occurs.

---

## 4. Quality Assurance

All reports rated Medium risk or above must pass QC peer review before delivery. The QC reviewer checks:
- Is the GDPR gate completed and correct?
- Are all sources cited and graded?
- Are facts, inferences, and conclusions properly separated and labelled?
- Is the risk rating justified by the evidence?
- Does the report meet the writing style guide standards?
- Is the recommendation specific and actionable?

Escalating a case to your manager when needed is a professional responsibility — escalating early is always better than managing a crisis.`,
    quiz: [
      { q: "When does the SLA clock start for a case?", opts: ["When the requester submits the request","When the case is assigned to an analyst","When the analyst begins research","When the GDPR gate is completed"], ans: 1 },
      { q: "Which of the following is NOT required documentation for every case?", opts: ["The requester's name and purpose","A photograph of the subject","The GDPR lawful basis","All sources consulted, including negative results"], ans: 1 },
      { q: "If you are at risk of breaching an SLA, you should:", opts: ["Notify your manager immediately, document the reason, and agree on an action plan","Complete the work first and notify the manager after delivery","Ask the requester for an extension without telling your manager","Work overtime to complete it without notifying anyone"], ans: 0 },
      { q: "Which reports require peer review (QC) before delivery?", opts: ["All reports regardless of risk rating","All reports rated Medium risk or above","Only Critical risk reports","Only reports being delivered to external clients"], ans: 1 },
      { q: "Escalating a case to your manager is:", opts: ["A sign of weakness — analysts should resolve problems independently","A professional responsibility — escalating early is always better than managing a crisis","Only appropriate if the SLA has already been breached","Required only when the case involves a criminal matter"], ans: 1 }
    ]
  },
  w2m1: {
    id: "w2m1", week: 2, num: 1, mins: 60,
    title: "Online Risk Profile (ORP) — Methodology and Structure",
    content: `## Learning Objectives
- Define the purpose and scope of an ORP
- Execute each research phase in the correct sequence
- Apply the ORP risk rating framework
- Write clear, evidence-based conclusions and recommendations

---

## 1. What is an ORP?

An Online Risk Profile (ORP) is an intelligence product that maps and assesses an individual's or entity's digital footprint, online presence, and associated risk indicators. It answers: "What does this person's online presence tell us about their risk profile?"

An ORP is appropriate when: conducting pre-employment or pre-contract background screening; assessing executive or public-facing personnel for reputational exposure; investigating an individual's public-facing activity following an incident; fulfilling a periodic review obligation.

---

## 2. The GDPR Gate

Before starting an ORP on a named individual, you must complete the GDPR compliance gate. This is non-negotiable. Document the lawful basis, purpose, data minimisation plan, and retention period before any research begins.

---

## 3. Research Phases

**Phase 1 — Surface Web (Google/Bing):** Conduct structured searches using the subject's name plus known associates, role, company, location. Document all search strings. Note adverse and positive findings separately.

**Phase 2 — Social Media:** Check all major platforms (LinkedIn, X/Twitter, Facebook, Instagram, TikTok, YouTube, Reddit). Document: username found, content type, follower count, activity level, any adverse or noteworthy content.

**Phase 3 — Data Breach Check:** Check whether the subject's known email addresses appear in data breach repositories. Document: service name, breach date, data types exposed. Do not include credential details in the report.

**Phase 4 — Dark Web Mention Check:** This is a managed service activity. Submit a request if available. Document: whether the check was conducted, the result, the date of check.

**Phase 5 — News and Media:** Conduct structured adverse media searches. Grade findings by recency (last 6 months, 1 year, 3 years, older). Older adverse media may still be relevant but must be contextualised.

**Phase 6 — Domain/Digital Infrastructure:** For entity subjects, check associated domains: WHOIS records, domain registration patterns, associated IP addresses.

---

## 4. ORP Risk Rating Framework

Each finding is rated: Low (factual, not sensitive), Medium (reputationally concerning), High (significantly damaging or legally relevant), Critical (evidence of illegal activity or imminent threat).

Overall ORP risk rating: Low (no adverse findings, minimal reputational exposure), Medium (minor adverse findings, some reputational exposure, monitoring recommended), High (significant adverse findings, reputational risk present, EDD recommended), Critical (evidence of serious misconduct or illegal activity, escalate immediately).

---

## 5. Writing ORP Conclusions

Conclusions must be: evidence-based (citing specific findings), proportionate (matched to the weight of evidence), specific (actionable recommendations), and clearly separated from raw findings.

Template: "Based on [specific research conducted], [subject] is assessed as presenting a [risk level] reputational risk. Key indicators include [specific findings]. Recommended action: [specific, actionable recommendation]."`,
    quiz: [
      { q: "Before starting an ORP on a named individual, you must:", opts: ["Complete the GDPR compliance gate, documenting lawful basis, purpose, and retention period","Obtain written consent from the subject","Get approval from the CEO","Ensure the subject is not aware of the research"], ans: 0 },
      { q: "When searching social media for a subject, you should:", opts: ["Only search platforms where you know the subject has an account","Search all major platforms and document username, follower count, content type, and any adverse findings for each","Only search LinkedIn and Twitter/X","Focus only on adverse content"], ans: 1 },
      { q: "You find a data breach record showing the subject's email and password were exposed. You should:", opts: ["Include the password in the report for completeness","Document the breach as an indicator (service, date, data types) but do not include credential details in the report","Exclude it — data breaches are irrelevant to an ORP","Contact the subject to warn them"], ans: 1 },
      { q: "A subject has significant adverse media coverage from a single news article published 6 years ago. This should be assessed as:", opts: ["Critical — any adverse media is automatically Critical","Irrelevant — only content from the last 3 years is relevant","Determined by the nature of the coverage, the age of the article, and whether it has been corroborated or updated since","Automatically excluded from the report"], ans: 2 },
      { q: "Which of the following is a good ORP recommendation?", opts: ["'The subject presents a high risk'","'We recommend caution'","'Enhanced monitoring of the subject's social media accounts is recommended, with a follow-up ORP in 6 months'","'Do not proceed with this individual'"], ans: 2 }
    ]
  },
  w2m2: {
    id: "w2m2", week: 2, num: 2, mins: 65,
    title: "Due Diligence Report (DDRS) — Corporate Structure, Sanctions, and Risk Assessment",
    content: `## Learning Objectives
- Understand the purpose and scope of a DDRS
- Execute sanctions screening correctly and handle potential matches
- Map corporate structures and identify Ultimate Beneficial Owners (UBOs)
- Assess financial health and adverse media in context
- Apply the DDRS risk rating framework

---

## 1. What is a DDRS?

A Due Diligence Report (DDRS) is a structured intelligence product used to assess the background, risk profile, and suitability of a third party, vendor, individual, or business entity before a significant business relationship, contract award, or transaction.

---

## 2. Sanctions Screening — First Step

**Sanctions screening must be completed before any other research.** It is the most critical step — providing any service to a sanctioned entity or individual is a serious criminal offence.

Check against: OFAC (US), OFSI (UK), EU Consolidated List, UN Security Council List, and relevant national lists.

Handling a potential match: if the name is similar but not identical to a sanctioned party, conduct a disambiguation procedure — compare date of birth, nationality, address, associated entities, and known identifiers. Document every comparison made. If you cannot definitively clear the match, escalate to Compliance before proceeding.

---

## 3. Corporate Structure and UBO Research

The Ultimate Beneficial Owner (UBO) is any individual who owns or controls 25% or more of the entity. For every corporate entity you assess:

1. Obtain the full company registration details (name, registration number, incorporation date, address, company type)
2. Map all shareholders and directors (current and historical)
3. Trace ownership upward through all holding layers until you identify the natural person(s) who ultimately own/control 25%+
4. Check the PSC (Persons with Significant Control) register for UK entities

Red flags in corporate structure: multiple layers of holding companies in secrecy jurisdictions (BVI, Cayman Islands, Panama); nominee directors (professional directors-for-hire); recent incorporation with no verifiable business activity; circular ownership structures.

---

## 4. Financial Health Assessment

Review filed annual accounts for: revenue trend (growing, stable, declining), profit margins, cash position, debt levels, going concern qualifications from auditors.

Contextualise findings: a company being loss-making for three years may be a startup in growth phase or a failing business — assess in context, not in isolation.

---

## 5. DDRS Risk Rating

Low — No adverse findings; standard documentation of entity is sufficient.
Medium — Some adverse indicators but not disqualifying; enhanced monitoring recommended.
High — Significant adverse findings; senior management review required before proceeding.
Critical — Sanctions match confirmed, serious adverse media, or evidence of fraud/misconduct — do not proceed without compliance sign-off.`,
    quiz: [
      { q: "When should you complete sanctions screening in a Due Diligence?", opts: ["After all other research is complete","Before any other research — it is the most critical step","Simultaneously with other research","Only if the requester specifically asks for it"], ans: 1 },
      { q: "A UBO (Ultimate Beneficial Owner) is defined as:", opts: ["The CEO of the company","Any individual who owns or controls 25% or more of the entity","All shareholders listed on the company register","Anyone named as a director"], ans: 1 },
      { q: "You find a potential sanctions match — the name is similar but not identical to a sanctioned party. You should:", opts: ["Proceed — the names are different","Document the potential match, conduct a disambiguation procedure, and escalate to Compliance if you cannot definitively clear the match","Mark it as a false positive and continue","Ask the requester whether to proceed"], ans: 2 },
      { q: "A company has been loss-making for three years. This means:", opts: ["It is automatically high risk","The financial position should be assessed in context — many legitimate businesses are loss-making in growth phase","It is automatically critical risk","Loss-making status does not need to be included in the report"], ans: 1 },
      { q: "Which of the following is a red flag in a corporate ownership structure?", opts: ["A single director who founded the company","Multiple layers of holding companies in secrecy jurisdictions (BVI, Cayman Islands)","A company incorporated in its home jurisdiction","Annual accounts filed on time"], ans: 1 }
    ]
  },
  w3m1: {
    id: "w3m1", week: 3, num: 1, mins: 70,
    title: "Investigation Report (IR) — Scope, Evidence, and Findings",
    content: `## Learning Objectives
- Define when an IR is appropriate and when it is not
- Write a clear, legally defensible scope statement
- Apply forensically sound evidence collection principles
- Distinguish between confirmed facts, reasonable inferences, and unverified allegations

---

## 1. What is an Investigation Report?

An Investigation Report (IR) is the formal record of a completed or ongoing investigation. It documents scope, methodology, findings, evidence, and conclusions. Unlike a due diligence report, an IR is produced when there is a specific allegation, incident, or suspected wrongdoing to investigate.

An IR is appropriate when: there is an allegation of misconduct, fraud, or policy violation; an incident has occurred and the facts need to be established; findings may be used in legal or disciplinary proceedings; a formal record of the investigation is required for regulatory or audit purposes.

---

## 2. Scope Statement

The scope statement defines the boundaries of the investigation. It must be:
- Agreed with the requester and Senior Reviewer before any research begins
- Specific: names the subject(s), the allegation(s) to be investigated, the time period, and the jurisdictions covered
- Documented in writing and approved

A scope creep occurs when the investigation expands beyond the approved scope without updated authorisation. This creates legal risk. If the investigation uncovers new material that requires expanded scope, pause and seek approval before continuing.

---

## 3. Evidence Collection Principles

Forensic soundness requires: collecting evidence in a way that preserves its integrity; maintaining a chain of custody (who collected it, when, where it was stored, who accessed it and when); creating SHA-256 hash values for digital evidence at point of collection to detect subsequent alteration; never working from original evidence — use verified copies.

Legal hold: if legal proceedings are anticipated, all potentially relevant data must be preserved — do not delete, modify, or move anything under a legal hold notice.

Exculpatory evidence: evidence that contradicts or mitigates the findings must be included in the report. Omitting exculpatory evidence is both an analytical and ethical failure.

---

## 4. Fact / Inference / Allegation

Every statement in an IR must be clearly classified:

**Confirmed fact** — "CCTV confirms the subject entered the building at 23:47 on 14 June 2026 (Exhibit JD/002)"

**Reasonable inference** — "Based on access log data (Exhibit JD/003), the subject is assessed to have accessed the finance server between 23:47 and 01:15. Confidence: HIGH."

**Unverified allegation** — "The requester has alleged that the subject misappropriated funds. This allegation has not been corroborated by the evidence gathered to date."

Never present an inference as a fact. Never present an allegation as a finding unless it has been corroborated by evidence.`,
    quiz: [
      { q: "The scope statement of an IR must be approved by:", opts: ["The subject of the investigation","The Senior Reviewer, in writing, before any research begins","The requester only","Any available manager"], ans: 1 },
      { q: "Which statement correctly uses the fact/inference/allegation distinction?", opts: ["'The subject stole the funds' (without evidence)","'CCTV confirms the subject entered the building at 23:47' (confirmed fact with exhibit reference)","'It appears the subject may have possibly been involved'","'Sources allege that the subject committed fraud'"], ans: 1 },
      { q: "Exculpatory evidence in an IR is:", opts: ["Evidence that proves the subject guilty","Evidence from external sources only","Evidence that contradicts or mitigates the findings — it must be included in the report","Only relevant if the subject requests it"], ans: 2 },
      { q: "An IR should recommend:", opts: ["A specific finding of guilt or innocence","Specific remediation actions and systemic improvements, leaving disciplinary or legal decisions to the appropriate authority","No recommendations — the IR only presents facts","Only procedural changes, never individual consequences"], ans: 1 },
      { q: "A legal hold means:", opts: ["The case is paused pending legal review","All relevant data must not be deleted, modified, or moved until the legal hold is lifted","The report must be reviewed by a lawyer before delivery","The subject has obtained a legal injunction against the investigation"], ans: 0 }
    ]
  },
  w4m1: {
    id: "w4m1", week: 4, num: 1, mins: 50,
    title: "Monitoring Operations — Boolean Search, Hit Classification, and Escalation",
    content: `## Learning Objectives
- Construct effective boolean search queries
- Apply the hit classification framework
- Manage a monitoring search library
- Know when and how to escalate a monitoring finding

---

## 1. The Purpose of Monitoring

Monitoring is the ongoing collection and review of information about a subject, topic, or threat. Unlike a one-time report, monitoring is continuous — it provides early warning of emerging risks.

Monitoring is appropriate when: a subject requires ongoing observation (person, organisation, location, keyword); a threat landscape needs tracking; a periodic review obligation exists.

---

## 2. Boolean Search Construction

Effective boolean queries use: AND (both terms must appear), OR (either term), NOT (exclude term), quotation marks (exact phrase), parentheses (group operators), site: (specific domain), filetype: (file type).

Example: ("Acme Corp" OR "Acme Corporation") AND (fraud OR corruption OR investigation OR "regulatory action") NOT site:acmecorp.com

Build queries iteratively: start broad, assess results, narrow with additional terms. Document every query version. Review quarterly — subjects and relevant terms change over time.

---

## 3. Hit Classification Framework

When a monitoring result is returned, classify it:
- **Critical** — immediate threat or confirmed adverse development requiring RAZOR and immediate escalation to supervisor
- **High** — significant adverse finding requiring case note update and manager notification within 4 hours
- **Medium** — noteworthy development requiring documentation and inclusion in next scheduled review
- **Low** — relevant but not urgent — log and review at next cycle
- **Negative** — not relevant — document that result was reviewed and dismissed, with brief reason

Documenting negative results is important: it demonstrates active monitoring, provides an audit trail, and protects you if questions arise later.

---

## 4. Escalation

Escalate immediately (same session) when: a Critical hit is received; a monitoring result indicates an imminent threat to persons or assets; a result confirms a previously unidentified sanctions match or PEP connection.

Escalate before end of day: High hits that require action but not immediate response.

Weekly review: Medium and Low hits reviewed and documented at scheduled frequency.

A monitoring search library should be reviewed at least quarterly: verify subjects are still of interest, update search terms to reflect new information, close searches for subjects no longer requiring monitoring, add new searches as required.`,
    quiz: [
      { q: "The boolean query '(\"Acme Corp\" OR \"Acme Corporation\") AND (fraud OR corruption)' will:", opts: ["Return only results mentioning both fraud and corruption","Mention Acme Corp AND either fraud or corruption","Return all results mentioning Acme Corp","Exclude results about Acme Corp"], ans: 1 },
      { q: "A monitoring search returns a news article suggesting a subject may be under criminal investigation. You should:", opts: ["Wait for official confirmation before acting","Verify the finding against at least two additional independent sources, classify as High or Critical, and escalate per the protocol","File it and review at the next quarterly check","Inform the subject so they can respond"], ans: 1 },
      { q: "Why is documenting negative monitoring results important?", opts: ["It inflates the case file to show active work","It demonstrates active monitoring, provides an audit trail, and protects against later challenges","It is not important — only positive results need documentation","It is a regulatory requirement under GDPR"], ans: 1 },
      { q: "A monitoring hit classified as 'Critical' requires:", opts: ["Documentation and review at the next weekly cycle","Review within 5 business days","Immediate escalation to supervisor and RAZOR item","A full new ORP to be commissioned"], ans: 2 },
      { q: "How often should a monitoring search library be reviewed?", opts: ["Monthly","Quarterly","Annually","Only when a new hit is received"], ans: 1 }
    ]
  },
  w4m2: {
    id: "w4m2", week: 4, num: 2, mins: 45,
    title: "Report Writing — Clarity, Structure, and Analytical Standards",
    content: `## Learning Objectives
- Apply the principles of clear, professional intelligence writing
- Structure reports for different audiences (technical, management, executive)
- Avoid the most common writing failures in intelligence reports
- Use hedging language appropriately to convey confidence levels

---

## 1. The Purpose of an Intelligence Report

An intelligence report is a communication tool. Its purpose is to transfer your analytical conclusions to the reader in a way that enables them to make a decision. If the reader cannot understand your conclusions or act on your recommendations, the report has failed — regardless of the quality of the underlying research.

---

## 2. BLUF — Bottom Line Up Front

State your conclusion first, then support it with evidence. Do not make the reader wade through pages of findings before reaching the risk rating. The executive reader will read the first paragraph — make it count.

**Weak:** "In our research we found several adverse findings which, when considered together, suggest that..."
**Strong:** "RISK RATING: HIGH. Based on research conducted 12–14 June 2026, [Subject] is assessed as presenting a high reputational risk due to confirmed adverse media, an unresolved court judgment, and a pattern of dissolved companies in high-risk jurisdictions."

---

## 3. Hedging Language for Confidence Levels

Intelligence findings are rarely certain. Use hedging language to convey your confidence level accurately:
- High confidence: "confirms", "established", "documented"
- Medium confidence: "assessed to", "indicates", "suggests"
- Low confidence: "unconfirmed reporting suggests", "may have been involved", "alleged"
- Speculation (never use in a report): "could", "might perhaps", "it is possible that"

---

## 4. Writing for Different Audiences

**Technical/analyst audience:** Full methodology, complete source citations, detailed findings, all exhibits referenced. They need to be able to replicate or challenge your work.

**Management audience:** Summary of key findings, risk rating with justification, recommendations with priority order. They need to make a decision.

**Executive audience:** One-page summary: risk rating (single word), top 3 findings (one sentence each), one clear recommendation. They need to act or not act.

---

## 5. Common Writing Failures

- Passive voice obscuring the actor ("Funds were transferred" vs "Subject transferred funds on 15 March")
- Burying the finding (conclusion appears on page 4 after extensive background)
- Presenting allegations as facts (without evidence or appropriate hedging)
- Vague recommendations ("more research may be warranted" is not a recommendation)
- Precision failures ("several", "some", "numerous" vs actual numbers)
- British English failures (use: organisation, colour, behaviour, analyse, licence not license)`,
    quiz: [
      { q: "BLUF (Bottom Line Up Front) means:", opts: ["Providing extensive background before any conclusions","Stating your conclusion first, then supporting it with evidence","Using bullet points throughout the report","Beginning with the methodology section"], ans: 1 },
      { q: "Which sentence uses appropriate hedging language for an unconfirmed finding?", opts: ["'The subject committed fraud in 2019'","'It is possible the subject might have maybe been involved in some financial irregularities'","'Unconfirmed reporting suggests the subject may have been involved in financial irregularities in 2019'","'Sources claim the subject did bad things'"], ans: 2 },
      { q: "A report written for a senior executive should:", opts: ["Be as detailed as possible to demonstrate thoroughness","State the risk rating and key recommendation in the first paragraph, with supporting detail to follow","Include all source citations so the executive can verify them","Be identical in structure to the technical report"], ans: 1 },
      { q: "Which of the following is an example of a precise, well-written finding?", opts: ["'The subject has been involved in several legal issues'","'A court convicted the subject of fraud in March 2019 and sentenced them to 18 months (suspended)'","'There may be some concerns about the subject's background'","'Numerous adverse media results were found during research'"], ans: 1 },
      { q: "Omitting evidence that contradicts your conclusions is:", opts: ["Acceptable if the contradictory evidence is from a low-quality source","Both an analytical and ethical failure","Acceptable for executive-level reports to keep them concise","Only a problem if the contradictory evidence is confirmed by multiple sources"], ans: 1 }
    ]
  },
  w5m1: {
    id: "w5m1", week: 5, num: 1, mins: 65,
    title: "Financial Crime Intelligence — Typologies, Red Flags, and Investigation Methodology",
    content: `## Learning Objectives
- Identify the main financial crime typologies relevant to intelligence work
- Recognise red flags for money laundering, fraud, and bribery
- Apply a structured financial crime investigation methodology
- Understand the regulatory reporting obligations

---

## 1. Financial Crime Typologies

**Money laundering — three stages:**
Placement: introducing criminal proceeds into the financial system (cash deposits, currency exchange, smurfing — breaking large sums into smaller deposits below reporting thresholds).
Layering: obscuring the audit trail (wire transfers through multiple jurisdictions, shell company transactions, cryptocurrency mixing).
Integration: reintroducing funds as apparently legitimate income (property purchases, consulting contracts, loan repayments).

**Fraud:** Includes internal fraud (employee theft, payroll manipulation), vendor fraud (fictitious invoices, kickbacks), and external fraud (business email compromise, identity theft).

**Bribery and corruption:** Payments, gifts, or services provided to influence a decision. Under the UK Bribery Act 2010, organisations can be held liable for failure to prevent bribery, even where they were not directly involved.

**Sanctions evasion:** Conducting transactions with sanctioned parties through intermediaries, front companies, or falsified documentation.

---

## 2. Red Flags

Round-number transactions (£10,000, £50,000) — may indicate structuring to avoid reporting thresholds. Rapid movement of funds (in-and-out within hours). Use of secrecy jurisdiction entities without commercial rationale. Source of funds inconsistent with stated business. Unusual transaction counterparties (jurisdictions, entity types). Multiple cash deposits followed by immediate wire transfers.

---

## 3. The Tipping-Off Prohibition

If a Suspicious Activity Report (SAR) has been submitted or is under consideration, you must not: inform the subject that a SAR has been filed; disclose the existence of an investigation; take any action that might "tip off" the subject. Tipping-off is a criminal offence under the Proceeds of Crime Act 2002. Escalate all financial crime concerns to Compliance before submitting or deciding not to submit a SAR.

---

## 4. SAR Process

If your intelligence work identifies reasonable grounds to suspect money laundering, you must escalate to the MLRO (Money Laundering Reporting Officer). The MLRO reviews the case and decides whether to submit a SAR to the NCA (UK) or Financial Intelligence Unit (FIU). The analyst's role is to document findings accurately and escalate — not to make the SAR submission decision independently.`,
    quiz: [
      { q: "The three stages of money laundering are:", opts: ["Collection, Concealment, Distribution","Placement, Layering, Integration","Input, Processing, Output","Receipt, Transfer, Use"], ans: 1 },
      { q: "A red flag in financial crime intelligence is:", opts: ["An indicator that warrants further investigation — not proof of wrongdoing","Definitive evidence of criminal activity","Something that automatically requires a SAR","Only significant if corroborated by five independent sources"], ans: 1 },
      { q: "Tipping off means:", opts: ["Giving an anonymous tip to the police","Informing a subject that they are under suspicion after a SAR decision has been made or is being considered","Providing additional information to a requester","Warning a colleague about a difficult client"], ans: 1 },
      { q: "Round-number transactions (e.g., exactly £10,000) are a red flag because:", opts: ["They are unusual for any legitimate business","They may indicate structuring — deliberately keeping transactions below reporting thresholds","Legitimate businesses never use round numbers","They automatically indicate fraud"], ans: 2 },
      { q: "If your investigation identifies a suspicion of money laundering, you should:", opts: ["Submit a SAR directly to the NCA","Escalate to Compliance before submitting or deciding not to submit a SAR","Inform the subject so they can explain","Ignore it if you are not certain"], ans: 1 }
    ]
  },
  w5m2: {
    id: "w5m2", week: 5, num: 2, mins: 60,
    title: "Cryptocurrency Intelligence — Blockchain Analysis and Wallet Tracing",
    content: `## Learning Objectives
- Understand the basics of blockchain technology relevant to intelligence work
- Apply wallet tracing methodology
- Identify risk indicators in cryptocurrency transactions
- Know the limits of cryptocurrency intelligence

---

## 1. Why Cryptocurrency Intelligence Matters

Cryptocurrency is increasingly used in financial crime — for money laundering, ransomware payments, sanctions evasion, and fraud. Intelligence analysts need to understand the basics of blockchain analysis to assess cryptocurrency-related risk accurately.

---

## 2. Blockchain Fundamentals

A blockchain is a distributed ledger — a record of all transactions on a network, maintained by thousands of nodes simultaneously. Key properties: immutability (transactions cannot be altered once confirmed), transparency (all transactions are publicly visible on-chain), pseudonymity (wallet addresses are public but owner identity is not automatically linked).

Wallet address: the public identifier — a long alphanumeric string. Transaction hash: a unique identifier for each transaction. Block explorer: a public tool (e.g., blockchain.com, etherscan.io) that allows anyone to view all on-chain transactions, wallet balances, and transaction history.

---

## 3. Wallet Tracing Methodology

1. Obtain the wallet address from the case file or intelligence source
2. Check the block explorer: balance, transaction history, number of counterpart wallets
3. Trace incoming transactions (what wallets sent funds to this wallet?)
4. Trace outgoing transactions (where did funds go from this wallet?)
5. Identify any known-bad addresses (exchanges flagged for non-compliance, darknet markets, mixing services) in the transaction chain
6. Document the transaction flow with amounts, dates, and counterpart addresses
7. Record the cryptocurrency value at the time of the transaction (not current value)

---

## 4. Risk Indicators

Mixing/tumbling services: deliberately obfuscate the transaction trail — their use is a significant red flag. Peer-to-peer exchanges: allow transfers without KYC — red flag if used to avoid compliance. Privacy coins (Monero, Zcash): designed to be untraceable — blockchain analysis is severely limited. Darknet market addresses: any transaction with a known darknet market address is a critical red flag. High-velocity wallets: rapid cycling of funds across many wallets in a short period — a layering indicator.

---

## 5. Limits of Cryptocurrency Intelligence

Blockchain analysis reveals the transaction trail — it does not automatically identify the wallet owner. Identity attribution requires: exchange KYC records (requires legal process), open source research linking a wallet to an identity, or law enforcement cooperation. Document clearly in your report what the analysis shows and what remains unattributed.`,
    quiz: [
      { q: "Blockchain transactions are best described as:", opts: ["Completely anonymous — wallet owners cannot be identified","Pseudonymous — wallet addresses are public but owner identity requires additional attribution","Fully identified — all wallets are linked to verified identities","Private — only accessible to law enforcement"], ans: 1 },
      { q: "A mixing or tumbling service is significant in cryptocurrency intelligence because:", opts: ["It improves transaction speed","It deliberately obscures the transaction trail — its use is a significant red flag in financial crime investigations","It verifies the identity of wallet holders","It is a type of regulated cryptocurrency exchange"], ans: 1 },
      { q: "When documenting the value of a cryptocurrency transaction, you should record:", opts: ["The value at the time of the transaction, not at the time of your analysis","Only the current market value","Both values, weighted by which is higher","The value as stated by the subject"], ans: 0 },
      { q: "A block explorer is:", opts: ["A tool that identifies the owners of cryptocurrency wallets","A public tool that allows anyone to view all on-chain transactions and wallet history","A law enforcement database of cryptocurrency crime","A dark web marketplace for cryptocurrency"], ans: 1 },
      { q: "Privacy coins (Monero, Zcash) present a challenge for cryptocurrency intelligence because:", opts: ["They are volatile in value","They are designed to be untraceable — blockchain analysis is severely limited for these currencies","They require special software to analyse","They are only used by criminals"], ans: 1 }
    ]
  },
  w6m1: {
    id: "w6m1", week: 6, num: 1, mins: 55,
    title: "OSINT Tradecraft — Advanced Search Techniques and Source Validation",
    content: `## Learning Objectives
- Apply advanced search operators across multiple platforms
- Use OSINT frameworks and tools systematically
- Validate sources and assess information reliability
- Maintain operational security during OSINT collection

---

## 1. Advanced Search Operators

Beyond basic boolean operators, search engines support advanced operators:

site: — Restrict to a specific domain: site:linkedin.com "John Smith"
filetype: — Search for specific file types: filetype:pdf "annual report" "Acme Corp"
intitle: — Term must appear in the page title: intitle:"director" "Acme Corp"
inurl: — Term must appear in the URL: inurl:companies site:gov.uk
before: — Results before a date: "Acme Corp" fraud before:2023-01-01
after: — Results after a date: "John Smith" "director" after:2024-01-01
cache: — Google's cached version of a page
" " — Exact phrase match

Combine operators: site:linkedin.com "John Smith" "Acme Corp" Director

---

## 2. Operational Security (OPSEC)

OPSEC in OSINT means managing your digital footprint to avoid alerting the subject to your research. Principles:
- Do not log into personal accounts on work devices during intelligence collection
- Do not use your work email to create research accounts
- Do not click "Like", "Follow", or "Connect" on any subject's profile
- Use a research browser profile or VM with no personal associations
- Be aware that viewing a LinkedIn profile may notify the subject

---

## 3. The Wayback Machine and Archived Content

The Wayback Machine (web.archive.org) archives web pages over time. Useful for: recovering deleted content; comparing historical versions of websites; capturing content before anticipated deletion; establishing what was publicly available at a specific date.

When citing archived content: record the original URL, the archive URL, and the date of the archive you accessed.

---

## 4. Source Validation for Open Source Research

PACER and CourtServe are court records databases (US and UK respectively). Company registers (Companies House UK, CRO Ireland, GLEIF global LEI database, OpenCorporates) are primary corporate intelligence sources. Land registries, electoral rolls (where legally accessible), and professional body registers are useful supplementary sources.

Validate any significant finding across at least two independent sources before including in a report. Apply the NATO grading to all sources used.`,
    quiz: [
      { q: "The search operator 'site:linkedin.com \"John Smith\"' will:", opts: ["Search the entire web for pages about John Smith from LinkedIn","Search only LinkedIn for pages containing 'John Smith'","Search LinkedIn's internal database","Find all LinkedIn connections of John Smith"], ans: 1 },
      { q: "Operational Security (OPSEC) in OSINT collection means:", opts: ["Only using official databases","Managing your digital footprint to avoid alerting the subject to your research","Using a VPN for all internet access","Getting written approval before any research"], ans: 1 },
      { q: "The Wayback Machine is useful for:", opts: ["Finding real-time information about subjects","Recovering deleted web content and comparing historical versions of websites","Conducting live social media monitoring","Accessing court records databases"], ans: 1 },
      { q: "The search operator 'filetype:pdf \"Acme Corp\"' will return:", opts: ["All web pages mentioning Acme Corp","PDF documents containing the phrase 'Acme Corp'","Acme Corp's official documents only","Results from Acme Corp's domain"], ans: 1 },
      { q: "PACER and CourtServe are examples of:", opts: ["Social media monitoring tools","Court records databases (US and UK respectively)","Corporate registry databases","Sanctions screening tools"], ans: 1 }
    ]
  },
  w9m1: {
    id: "w9m1", week: 9, num: 1, mins: 60,
    title: "Analytical Techniques — Link Analysis, Timeline Reconstruction, and Pattern of Life",
    content: `## Learning Objectives
- Apply link analysis to map relationships between entities
- Construct defensible investigation timelines
- Use pattern of life analysis to identify anomalies
- Apply structured analytical techniques to reduce bias

---

## 1. Link Analysis

Link analysis maps the relationships between entities (people, organisations, locations, events, financial accounts) to identify connections that are not immediately obvious.

Key concepts:
- **Nodes**: entities (people, companies, locations, events)
- **Edges**: relationships between nodes (employs, owns, transacts with, associates with)
- **Key node**: an entity with many connections that appears in multiple parts of the network — high centrality indicates importance
- **Betweenness**: a node that connects otherwise disconnected network segments — removing this node would disconnect the network

Questions to ask with every entity graph: Who ultimately controls this structure? Do any individuals appear across multiple entities in different roles? Are there circular ownership structures? Are there any connections to sanctioned entities or PEPs?

---

## 2. Timeline Reconstruction

A timeline places events in chronological order to identify: the sequence of events, timing of decisions, gaps in the evidence, patterns of behaviour.

Principles for defensible timelines:
- Every event must be sourced (exhibit reference)
- Gaps in the evidence must be explicitly labelled ("No evidence of activity between X and Y")
- Inferred events (not directly evidenced) must be clearly distinguished from confirmed events
- Use consistent date/time format throughout (ISO 8601: YYYY-MM-DD HH:MM)

---

## 3. Pattern of Life Analysis

Pattern of life analysis establishes what is **normal** behaviour for a subject, so that anomalies stand out. Applications: detecting unusual financial activity, identifying behavioural changes before a fraud, establishing an individual's routine for investigative purposes.

Method: collect longitudinal data (transaction records, communications patterns, movement data); establish baseline ("the subject typically conducts 15–20 transactions per month, averaging £3,000, primarily to three counterparts"); identify deviations from baseline ("on 14 March 2026, the subject conducted 47 transactions totalling £280,000 to 12 previously unseen counterparts — a significant deviation from established pattern").

---

## 4. Reducing Cognitive Bias

**Analysis of Competing Hypotheses (ACH):** List all plausible hypotheses. For each piece of evidence, assess: Consistent (C), Inconsistent (I), or Not Applicable (N/A). The hypothesis with the fewest inconsistencies is most supported — not the one with the most consistent evidence.

**Devil's Advocate technique:** Deliberately argue the opposite of your current conclusion. If you cannot rebut the devil's advocate position, reconsider your assessment.

These techniques force you to confront evidence that contradicts your view rather than only noticing evidence that supports it.`,
    quiz: [
      { q: "In link analysis, a 'key node' is:", opts: ["The first entity identified in the investigation","An entity with many connections that appears in multiple parts of the network — high centrality indicates importance","A node that has been confirmed by three sources","The subject of the investigation"], ans: 1 },
      { q: "Pattern of life analysis is used to:", opts: ["Identify a subject's criminal history","Establish what is normal behaviour for a subject so that anomalies stand out","Monitor a subject's social media activity","Determine a subject's financial worth"], ans: 1 },
      { q: "Analysis of Competing Hypotheses (ACH) is designed to:", opts: ["Confirm the analyst's initial hypothesis with supporting evidence","Reduce cognitive bias by systematically testing all plausible hypotheses against the evidence — focusing on what is inconsistent","Find the most probable explanation quickly","Replace other analytical techniques"], ans: 1 },
      { q: "When building an investigation timeline, gaps in the evidence should be:", opts: ["Filled in with reasonable inferences presented as fact","Omitted to keep the timeline clean","Identified explicitly — 'No evidence of activity between X and Y'","Left blank without comment"], ans: 2 },
      { q: "The Devil's Advocate technique involves:", opts: ["Interviewing witnesses who have opposing views","Deliberately arguing the opposite of your current conclusion to test its robustness","Seeking additional sources to confirm your finding","Presenting multiple hypotheses without reaching a conclusion"], ans: 1 }
    ]
  },
  w10m1: {
    id: "w10m1", week: 10, num: 1, mins: 45,
    title: "Stakeholder Management — Briefing, Communication, and Managing Expectations",
    content: `## Learning Objectives
- Identify and manage different stakeholder types
- Deliver effective intelligence briefings
- Manage requester expectations throughout the intelligence cycle
- Handle difficult stakeholder situations professionally

---

## 1. Understanding Your Stakeholders

In intelligence operations, you will work with multiple stakeholder types, each with different needs, priorities, and levels of intelligence literacy.

**Requester** — the person who commissioned the work. Needs: timely, actionable output; updates on progress; clear recommendations. Communication style: regular updates, proactive flag of issues.

**End user / decision-maker** — the person who will act on the intelligence. May be different from the requester. Needs: clear risk rating, unambiguous recommendation, appropriate level of detail. Communication style: executive summary format, BLUF.

**Compliance / legal** — need to ensure the work meets regulatory requirements. Needs: GDPR documentation, source citations, clear methodology. Communication style: formal, documented.

**Line manager** — needs operational visibility. Needs: SLA status, quality issues, resource constraints. Communication style: regular brief, escalation when required.

---

## 2. Managing Requester Expectations

At intake: confirm the exact question, the SLA, what will be delivered, and what will not be covered. A five-minute call at intake prevents a five-hour argument at delivery.

During work: notify the requester immediately if you identify a risk to the SLA, a significant scope issue, or a material finding that requires urgent attention. Do not wait until delivery.

At delivery: walk the requester through the key findings and recommendation. Confirm they understand the risk rating and the recommended action.

---

## 3. Delivering Intelligence Briefings

State the risk rating and key recommendation in the first 30 seconds. Do not make the audience wait for the conclusion. Structure: risk rating → key finding(s) → evidence summary → recommendation → questions.

Prepare for pushback: requester may disagree with the risk rating. Your response: explain your methodology and evidence; acknowledge their perspective; do not revise your professional assessment based on pressure — incorporate their additional information if it changes the evidence base.

---

## 4. Difficult Stakeholder Situations

Requester asks you to omit a finding: refuse to omit and escalate to your manager if they persist. An intelligence product that omits relevant findings is not an intelligence product — it is a constructed narrative.

Requester provides contradictory information: document what they have told you as requester-provided information (not independently verified), assess it against the existing evidence, and adjust your conclusions accordingly if warranted.`,
    quiz: [
      { q: "When should you inform a requester that you are at risk of missing an SLA?", opts: ["Only after the SLA has been missed","At the next scheduled check-in","As soon as you identify the risk — do not wait","Only if the delay will be more than 24 hours"], ans: 2 },
      { q: "A requester asks you to omit a finding from your report because it reflects badly on their department. You should:", opts: ["Omit the finding — the requester commissioned the work","Flag the finding as unverified and include a watered-down version","Refuse to omit the finding and escalate to your manager if they persist","Omit the finding but document that you were asked to"], ans: 2 },
      { q: "When delivering an intelligence briefing to a senior executive, you should:", opts: ["Begin with the methodology so they understand how you reached your conclusions","State the risk rating and key recommendation in the first 30 seconds","Present all findings before giving the risk rating","Ask if they want a detailed or summary version before starting"], ans: 1 },
      { q: "A requester disagrees with your risk rating. You should:", opts: ["Revise it to avoid conflict","Explain your methodology and evidence; incorporate any additional information they provide if it changes the evidence base","Maintain your rating regardless of any new information they offer","Escalate to your manager to decide"], ans: 1 },
      { q: "At the intake stage of a new request, you should:", opts: ["Begin research immediately to meet the SLA","Confirm the exact question, the SLA, what will be delivered, and what will not be covered","Wait for the requester to provide a detailed brief in writing","Check if the subject is known to you before accepting the case"], ans: 1 }
    ]
  },
  w11m1: {
    id: "w11m1", week: 11, num: 1, mins: 40,
    title: "Quality Assurance and Peer Review — Standards, Process, and Feedback",
    content: `## Learning Objectives
- Apply the QC checklist systematically
- Conduct an effective peer review
- Give and receive analytical feedback professionally
- Understand the role of QA in maintaining intelligence standards

---

## 1. Why QA Matters

Intelligence products inform decisions. A report with errors, unsourced claims, or analytical failures can lead to wrong decisions with significant consequences. Quality assurance catches errors before they reach the requester.

QA is not about finding fault — it is about ensuring the product meets the professional standard required. A good peer reviewer is one of the most valuable colleagues you can have.

---

## 2. The QC Checklist

Apply systematically to every report before submission:

**Compliance section:**
- GDPR lawful basis documented (for reports involving personal data)?
- Data minimisation applied?
- Retention period set?
- GDPR gate completed and timestamped?

**Sourcing section:**
- All factual claims sourced?
- Sources are cited with: source name, URL/reference, date accessed, date of publication?
- NATO grades applied to all sources?
- At least three independent sources for all established facts?

**Analytical section:**
- Facts, inferences, and allegations clearly distinguished and labelled?
- No speculation presented as finding?
- Risk rating justified by the specific evidence cited?
- ACH or equivalent applied to complex cases?

**Writing section:**
- BLUF structure applied?
- British English throughout?
- Hedging language appropriate to confidence levels?
- No vague quantifiers ("several", "many", "some")?
- Recommendations are specific and actionable?

---

## 3. Conducting a Peer Review

Spot-check sources: access at least three cited sources to verify they say what the report claims they say. This is the most important step — source fabrication and misrepresentation are the most serious quality failures.

Provide feedback: be specific ("Source 3 does not support the finding on page 2 — the article mentions a different John Smith"), evidence-based ("The risk rating of Critical is not supported by the evidence on page 4 — the adverse media is from 2015"), constructive (focused on the product, not the person), and timely (returned within the agreed SLA).

---

## 4. Receiving Feedback

If you disagree with peer review feedback: explain your reasoning with reference to the specific evidence, and escalate to the Senior Reviewer if the disagreement cannot be resolved. You should not simply accept incorrect feedback to avoid conflict, nor should you reject correct feedback to protect your ego.`,
    quiz: [
      { q: "The purpose of QA in intelligence work is:", opts: ["To find analysts who are making mistakes so they can be disciplined","To ensure the product meets the professional standard required before it reaches the requester","To add an extra layer of bureaucracy to the delivery process","To verify that the requester's preferred conclusions are supported"], ans: 1 },
      { q: "When conducting a peer review, you should spot-check sources by:", opts: ["Reading the source summaries in the report","Accessing at least three cited sources to verify they say what the report claims","Reviewing all sources in the reference list","Checking that all source URLs work"], ans: 1 },
      { q: "Effective peer review feedback is:", opts: ["Verbal only, to avoid creating a paper trail","Specific, evidence-based, constructive, and timely","General, to avoid discouraging the analyst","Always positive to maintain team morale"], ans: 1 },
      { q: "If you disagree with peer review feedback, you should:", opts: ["Accept it to avoid conflict","Reject it entirely — your professional judgement takes precedence","Explain why you disagree with reference to the specific evidence, and escalate if the disagreement cannot be resolved","Rewrite the report without addressing the feedback"], ans: 2 },
      { q: "Which of the following should be checked in the compliance section of the QC checklist?", opts: ["Whether the report is the right length","Whether the GDPR lawful basis is documented for reports involving personal data","Whether the requester is satisfied with the findings","Whether the subject has been notified of the research"], ans: 1 }
    ]
  },
  w12m1: {
    id: "w12m1", week: 12, num: 1, mins: 40,
    title: "Operational Excellence — Metrics, Continuous Improvement, and Professional Development",
    content: `## Learning Objectives
- Understand the role of metrics in intelligence operations
- Apply continuous improvement principles to your work
- Plan your professional development as an intelligence analyst
- Understand the career pathways in intelligence operations

---

## 1. Measuring Intelligence Operations

Effective intelligence operations are measurable. Key metrics:

**SLA compliance rate** — % of cases delivered on time. Target: 95%+
**QC pass rate** — % of reports passing peer review first time. Target: 90%+
**AHC vs PHC variance** — actual hours vs planned hours. High variance (>20%) indicates planning issues or complexity underestimation.
**Report return rate** — % of reports requiring revision. Should be below 10%.
**Requester satisfaction** — formal or informal feedback from requesters on product utility.

These metrics are not punitive — they are diagnostic. A QC pass rate of 75% tells the team where to invest in training. An SLA compliance rate of 80% tells the manager where to investigate capacity or process issues.

---

## 2. After-Action Reviews

After every significant case — positive or negative outcome — conduct a brief after-action review:
- What was planned?
- What actually happened?
- Why was there a difference?
- What do we change?

Document and act on findings. An AAR that produces no changes is a wasted exercise.

---

## 3. Professional Development Pathways

The intelligence analyst profession has defined certification pathways:
- **ACFE CFE** (Association of Certified Fraud Examiners — Certified Fraud Examiner): the leading financial crime investigation qualification
- **CAMS** (Certified Anti-Money Laundering Specialist): AML and compliance focus
- **OSCP** (Offensive Security Certified Professional): for analysts moving into cyber intelligence
- **ICA Certificate/Diploma** (International Compliance Association): regulatory compliance
- **CTIA** (Cyber Threat Intelligence Analyst): threat intelligence specialisation

---

## 4. The Professional Standard

Completing this training programme means you have completed the foundation of your professional development — not the end of it. The intelligence analyst profession evolves continuously. Threats change, regulations change, tools change. The analyst who stops learning stops being effective.

Professional standards for intelligence analysts: integrity (act with honesty regardless of pressure), objectivity (follow evidence without bias), confidentiality (protect sources and information), accountability (own your work and its quality), proportionality (match depth and intrusiveness of research to the significance of the decision).`,
    quiz: [
      { q: "The QC pass rate metric measures:", opts: ["The total number of reports completed in a month","The percentage of reports passing peer review first time","Whether the requester is satisfied with the output","The speed of report delivery"], ans: 1 },
      { q: "An after-action review should be conducted:", opts: ["Only when something goes wrong","Once a year during annual reviews","After every significant case — to identify what went well and what to change","Only when requested by the line manager"], ans: 2 },
      { q: "The CAMS certification is relevant to analysts specialising in:", opts: ["Cyber threat intelligence","Anti-money laundering and financial crime compliance","Fraud investigation","Open source intelligence"], ans: 1 },
      { q: "Completing this training programme means:", opts: ["You are fully qualified as an intelligence analyst — no further development needed","You have completed the foundation of your professional development — the analyst who stops learning stops being effective","You can now supervise other analysts","You are eligible for immediate senior promotion"], ans: 2 },
      { q: "Which of the following best describes the professional standard for intelligence analysts?", opts: ["Speed and volume of output","Integrity, objectivity, confidentiality, accountability, and proportionality","Technical proficiency with databases","Client satisfaction scores"], ans: 1 }
    ]
  },
  w3m2: {
    id: "w3m2", week: 3, num: 2, mins: 60,
    title: "Risk Assessment (RA) — Threat Identification, Likelihood, Impact, and Controls",
    content: `## Learning Objectives
- Understand the purpose and structure of a formal Risk Assessment
- Apply systematic threat identification techniques
- Score risks using likelihood and impact matrices
- Develop proportionate, specific mitigation recommendations

---

## 1. What is a Risk Assessment?

A Risk Assessment (RA) is a structured evaluation of the risks associated with an event, project, operation, third party, or area of concern. It identifies threats and vulnerabilities, assesses likelihood and impact, and recommends controls to mitigate identified risks.

---

## 2. Threat Identification

Use a structured approach to avoid missing categories of threat: Physical (access, theft, violence, natural events), Cyber (intrusion, data breach, ransomware, insider), Reputational (media, social media, stakeholder confidence), Operational (process failures, third-party failures, regulatory non-compliance), Financial (fraud, market exposure, currency risk), Personnel (key person dependency, insider threat, health and safety).

---

## 3. Risk Scoring Matrix

**Likelihood (1–5):** 1=Rare, 2=Unlikely, 3=Possible, 4=Likely, 5=Almost certain
**Impact (1–5):** 1=Negligible, 2=Minor, 3=Moderate, 4=Major, 5=Catastrophic

**Risk Score = Likelihood × Impact (1–25)**
1–5: Low; 6–10: Medium; 11–15: High; 16–25: Critical

A risk of 4 (Likely) × 5 (Catastrophic) = Score 20 → Critical.

---

## 4. Control Types

**Preventive controls** — reduce the likelihood of the threat occurring (e.g., MFA implementation reduces likelihood of credential compromise)
**Detective controls** — identify when a threat has materialised (e.g., SIEM monitoring detects intrusion)
**Corrective controls** — reduce the impact after the threat has materialised (e.g., incident response plan, backup and recovery)
**Deterrent controls** — discourage threat actors (e.g., visible CCTV, security policies with consequences)

---

## 5. Residual Risk

Residual risk is the risk that remains after controls are in place. Document: the inherent risk (before controls), the controls applied, and the residual risk (after controls). The residual risk must be accepted by the risk owner — not the security team alone.`,
    quiz: [
      { q: "A risk score of 4 (Likely) × 5 (Catastrophic) = 20. This is classified as:", opts: ["High","Very High","Critical","Extreme"], ans: 2 },
      { q: "A preventive control is one that:", opts: ["Identifies when a threat has materialised","Reduces the likelihood of the threat occurring","Reduces the impact after the threat has materialised","Records evidence of the threat for later use"], ans: 1 },
      { q: "Residual risk is:", opts: ["The highest possible risk before any controls","The risk that remains after controls are in place","The risk accepted by the security team","The risk of the controls themselves failing"], ans: 1 },
      { q: "When identifying threats for a Risk Assessment, you should:", opts: ["Focus only on the threats most likely to occur","Use a structured approach covering physical, cyber, reputational, operational, financial, and personnel threat categories","Only include threats that have occurred previously","Limit the assessment to three threat categories"], ans: 1 },
      { q: "A good mitigation recommendation is:", opts: ["'Improve security generally'","'Consider implementing better controls'","'Implement multi-factor authentication on all remote access systems by Q3 2026 (Owner: IT Security)'","'Review the risk at the next annual assessment'"], ans: 2 }
    ]
  }
};

// ─── TRACK DEFINITIONS — ⚠️ DEAD CODE ────────────────────────────────────────
// This TRACKS constant is not exported and not imported anywhere.
// The live track data is in data/onboarding_tracks.js (exports TRACKS as default).
// Safe to delete this block.
const TRACKS = {
  "4-week": {
    id: "4-week",
    name: "4-Week Accelerated",
    weeks: 4,
    badge: "ACCELERATED",
    color: "#F59E0B",
    colorBg: "#A86410",
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
    color: "#4575F7",
    colorBg: "#1B4FE4",
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
    color: "#10A0A0",
    colorBg: "#0C7070",
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

// ─── PLATFORM TOUR STEPS (from OnboardingWizard.tsx) ──────────────────────────
const TOUR_STEPS = [
  { id: "welcome", title: "Welcome to TriveraCore", description: "Your intelligence operations platform. This tour takes 5 minutes and shows you where everything lives.", workspace: "start", icon: "✦", gradient: "linear-gradient(135deg, #047857, #065F46)", route: null },
  { id: "hub", title: "Intel Hub", description: "Your main intelligence dashboard — RAZOR intelligence, monitoring feeds, country risk map, and operational alerts in one view.", workspace: "Intelligence", icon: "⬡", gradient: "linear-gradient(135deg, #1D4ED8, #1E40AF)", route: "/my-dashboard" },
  { id: "cases", title: "Case Management", description: "All assigned cases live here. Track workflow stages, SLA status, GDPR gates, and case documentation.", workspace: "Operations", icon: "⬟", gradient: "linear-gradient(135deg, #B45309, #92400E)", route: "/cases" },
  { id: "razor", title: "RAZOR Intelligence", description: "Rapid intelligence products for emerging threats. Produce and distribute time-sensitive assessments to stakeholders.", workspace: "Intelligence", icon: "◈", gradient: "linear-gradient(135deg, #6D28D9, #5B21B6)", route: "/razor" },
  { id: "compliance", title: "Compliance & GDPR", description: "GDPR compliance gates, data audit logs, retention schedules, and regulatory compliance tracking.", workspace: "Compliance", icon: "⬡", gradient: "linear-gradient(135deg, #BE123C, #9F1239)", route: "/compliance-audit-log" },
  { id: "reports", title: "Report Builder", description: "Produce ORP, Due Diligence, Investigation Reports, Risk Assessments, and Financial Crime reports from structured templates.", workspace: "Reports", icon: "◫", gradient: "linear-gradient(135deg, #0F766E, #115E59)", route: "/report-builder" },
  { id: "scorecard", title: "Scorecard", description: "Your personal performance metrics — SLA compliance, QC pass rate, output volume, and AHC vs PHC variance.", workspace: "Performance", icon: "◎", gradient: "linear-gradient(135deg, #047857, #065F46)", route: "/scorecard" },
  { id: "sop_bot", title: "SOP Bot & Help Centre", description: "Ask the SOP Bot any procedural question. Full SOP library accessible from here.", workspace: "Support", icon: "◉", gradient: "linear-gradient(135deg, #9D174D, #831843)", route: "/help-centre" },
  { id: "profile", title: "Profile & Settings", description: "Your profile, notification settings, theme preferences, and security settings.", workspace: "Settings", icon: "◌", gradient: "linear-gradient(135deg, #374151, #1F2937)", route: "/settings" },
];

// ─── ONBOARDING POLICIES ──────────────────────────────────────────────────────
const POLICIES = [
  { id: "p-code", title: "Code of Conduct", duration: "8 min", icon: "📋",
    content: `You represent the team in everything you do. Before you begin any case work, read and acknowledge these standards.

**Professional conduct:** Act with integrity at all times. Treat all persons with respect regardless of context. Maintain a professional standard of appearance and communication. Never misrepresent your role, authority, or credentials.

**Confidentiality:** All case information, client details, and intelligence products are classified as INTERNAL at minimum. Do not discuss case details in public or shared spaces. Do not share case information with colleagues not assigned to the case. Do not copy case data to personal devices or storage.

**Conflicts of interest:** Declare any personal, professional, or financial relationship with a case subject or requester before accepting an assignment. When in doubt, declare and ask your manager.

**Gifts and inducements:** Do not accept gifts, hospitality, or any inducement from a requester, subject, or third party that could influence your work or create an appearance of impropriety.

**Accuracy and integrity:** Never fabricate, exaggerate, or omit findings to produce a desired conclusion. Your professional reputation — and your organisation's — depends on the reliability of your work.

**Reporting obligations:** Report any suspected breach of this code to your line manager. If the breach involves your line manager, report to the Head of Operations or use the whistleblowing channel.` },
  { id: "p-aup", title: "Acceptable Use Policy", duration: "6 min", icon: "💻",
    content: `These rules govern your use of the TriveraCore platform and all associated IT systems.

**Permitted use:** The platform and all research tools are authorised for business use only. Personal use of research tools is prohibited. Use of client data for personal benefit is a serious disciplinary matter.

**No personal storage:** Do not save case data, intelligence products, or client information to personal cloud storage (Dropbox, Google Drive, personal OneDrive), personal email accounts, or unencrypted personal devices.

**Screenshots and exports:** Screenshots of case content are prohibited unless required for an exhibit (in which case, follow the evidence management procedure). All exports must be saved to the designated case file location, not to personal folders.

**AI tool use:** AI tools are approved for the specific use cases documented in the AI Use Policy (search string generation, report drafting assistance, translation). All AI tool use is logged automatically. You must review and verify all AI output before inclusion in any report. AI output that you include in a report is your responsibility.

**Security requirements:** Enable multi-factor authentication on your account on your first day. Use the approved password manager. Lock your screen when away from your desk (Win+L / Cmd+Ctrl+Q). Report any suspected account compromise to IT Security immediately.

**Monitoring:** Platform activity is monitored for security and audit purposes. This includes AI tool use, case access, export activity, and login events.` },
  { id: "p-gdpr", title: "GDPR & Data Protection", duration: "10 min", icon: "🔒",
    content: `This team processes personal data of real people as a core operational activity. Your GDPR obligations govern every investigation and monitoring task you will perform.

**Your five key obligations:**

1. Document a lawful basis before researching any named individual. Legitimate Interests is the most common basis for due diligence work. Complete the GDPR Compliance Gate on the case before beginning research.

2. Process only the minimum data necessary for the documented purpose. Do not collect data "just in case it might be useful." Each item of personal data collected must have a documented reason.

3. Complete the GDPR Compliance Gate on every qualifying case before beginning research. This is mandatory and enforced by the platform. Research cannot proceed until the gate is complete.

4. Report suspected data breaches immediately. If you believe personal data has been compromised (lost device, unauthorised access, accidental disclosure), notify your line manager immediately — the 72-hour regulatory clock starts from when the organisation becomes aware.

5. Apply need-to-know to all case data. Do not share case information with colleagues not assigned to the case. Do not access cases you are not assigned to.

**The GDPR gate is not a formality.** Skipping it is a disciplinary matter with potential personal liability under GDPR. The platform enforces this — research stage is locked until the gate is confirmed.

**Data retention:** Subject personal data: 12 months from case closure. Research notes: 12 months. Final reports: 36 months. GDPR gate records: 60 months. Do not retain data beyond its retention period without documented approval.` },
  { id: "p-ai", title: "AI Use Policy", duration: "5 min", icon: "🤖",
    content: `AI tools are approved for specific use cases within this platform. Use them. They save significant time when used correctly. They also produce errors that, if not caught, will end up in intelligence products with your name on them.

**Approved use cases:**
- Generating Boolean search strings (provide subject, type, investigation purpose, context)
- Drafting report sections from your structured research notes
- Writing executive summaries from your key findings
- Translation of non-English source material
- Generating RAZOR item drafts from your brief notes

**The non-negotiable rule:** You are responsible for the accuracy of everything you submit — regardless of whether AI assisted with the drafting. AI can and does hallucinate corporate details, invent case law references, generate plausible-sounding but incorrect source citations, and misattribute information. Read everything critically.

**What AI must not do:**
- AI output must never be submitted without review
- AI must not be used to complete assessed work or assignments submitted under the academic integrity declaration
- AI output must not be presented as independently researched unless it has been verified against primary sources

**Logging:** All AI tool use is logged automatically in the AI Usage Log. This cannot be disabled. Anomalous patterns (very high AI usage relative to output volume, AI use outside working hours) are reviewed by management.` },
  { id: "p-social", title: "Social Media Policy", duration: "4 min", icon: "📱",
    content: `Working in intelligence operations means you cannot use social media the way most people do. Read this carefully.

**What you must not do:**
- Reference your employer, role, team, or any client on personal social media in any way that could identify your work
- Post about cases, subjects, or intelligence products — even in vague terms
- Use personal social media accounts for research without prior written approval from your line manager (OPSEC risk)
- Post anything that could create a conflict of interest with your work

**Why this matters:**
Subjects of intelligence work may be actively monitoring their own coverage and the social media activity of known intelligence professionals. A careless post that connects you to a case subject compromises the investigation, creates legal exposure, and may alert the subject.

Subjects may also attempt to identify and cultivate relationships with analysts who work on their cases. Maintain clear professional boundaries with anyone who might be connected to active or recent cases.

**For research purposes:** Use of social media for OSINT research follows the OSINT Search SOP and OPSEC guidelines. Use a designated research browser profile with no personal associations. Do not interact with subject accounts.` }
];

// ─── PRACTICE ASSIGNMENTS ─────────────────────────────────────────────────────
const ASSIGNMENTS = {
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

// ─── ATOMS ───────────────────────────────────────────────────────────────────;
