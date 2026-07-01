// // SOC Simulations
export const SOC_SIMULATIONS = [
  {
    id: "sim-1", title: "Incoming Service Request — Due Diligence", difficulty: "Beginner",
    track: "gsoc", estimatedMins: 20, sopRef: ["analyst-workflow", "gdpr-gate", "ddrs-individual"],
    description: "A new service request has been submitted for an individual due diligence check. Work through the intake, GDPR gate, and assignment process.",
    scenario: `You are the on-duty analyst. The following service request has just arrived:

**Service Request #SR-2026-0847**
Type: DDRS — Individual Due Diligence
Subject: Marcus Obi (DOB: 1979-03-14, Nigerian national, London-based)
Requester: Procurement Team — vendor onboarding check
Urgency: Standard
Notes: Subject is proposed as a new senior contractor. Background check required before engagement.

Your task:
1. What GDPR lawful basis applies here, and what must you confirm before beginning research?
2. List the key research areas you would cover for a DDRS-Individual report.
3. What would trigger escalation to a full Investigation Report instead of a DDRS?
4. The requester then adds: "Can you also check his wife quickly?" — how do you respond?`,
    correctAnswers: {
      gdpr: "Legitimate interests — vendor/contractor due diligence. Must confirm purpose documented, retention period set (12 months default), data minimisation confirmed. Cannot begin research until gate is confirmed.",
      sections: "Identity verification, corporate affiliations, litigation/regulatory history, adverse media, sanctions & PEP, social media/digital footprint, reputational risk summary",
      escalation: "If research reveals potential criminal activity, data breach indicators, or findings requiring legal review",
      spouse: "Refuse — no lawful basis for researching the spouse. A separate service request with documented lawful basis would be required."
    }
  },
  {
    id: "sim-2", title: "RAZOR Intelligence — Emerging Threat", difficulty: "Intermediate",
    track: "intel", estimatedMins: 25, sopRef: ["razor-sop", "writing-guide"],
    description: "A critical monitoring alert has triggered. Determine whether a RAZOR item is warranted and draft the key components.",
    scenario: `Your monitoring dashboard has flagged the following at 06:42 this morning:

**Monitoring Alert — HIGH PRIORITY**
Search: "Civil unrest Lagos Nigeria"
Source: Reuters Africa (A2 — Usually reliable, Probably true)
Summary: Three separate news sources report significant escalation of protests in Lagos over the past 48 hours. Security forces deployed. Two casualties confirmed. International business district partially closed. Your organisation has two employees currently in Lagos conducting a site visit. Their return flight is in 48 hours.

Your task:
1. Does this warrant a RAZOR item? Justify your decision.
2. Write the headline title for the RAZOR item following correct format.
3. What are the four components the RAZOR item body must contain?
4. What immediate operational action should you take alongside the RAZOR item?
5. What NATO grade applies to the Reuters source here?`,
    correctAnswers: {
      warranted: "Yes — significant security incident in a region of interest with direct operational impact (two employees at risk). Cannot wait for a full report.",
      title: "RAZOR: Escalating Civil Unrest and Security Force Deployment, Lagos, Nigeria — [Date]",
      components: "1. Headline finding. 2. Context. 3. Analyst assessment. 4. Recommended action.",
      operational: "Immediate duty-of-care notification to the two employees in Lagos. Contact through emergency communications protocol. Assess evacuation options.",
      nato: "B2 — Source: Usually reliable (B). Information: Probably true (2) — corroborated by multiple sources but not yet independently confirmed."
    }
  },
  {
    id: "sim-3", title: "SLA Breach Risk Management", difficulty: "Intermediate",
    track: "gsoc", estimatedMins: 15, sopRef: ["analyst-workflow", "scorecard"],
    description: "Two cases in your queue are approaching SLA deadline. Apply the correct triage and escalation decisions.",
    scenario: `It is 14:00 on Thursday. You review your case queue:

**Case A — IR-2026-0233**
Type: Investigation Report (IR)
Subject: Employee fraud allegation
SLA: Standard — 10 business days. Case assigned Monday of last week. Due tomorrow (Friday) at 17:00.
Current stage: Drafting
Status: 80% complete but awaiting one document from HR. HR has not responded to two emails.
PHC: 12 hours. AHC logged so far: 9.5 hours.

**Case B — ORP-2026-0891**
Type: Online Risk Profile
Subject: New executive hire
SLA: High Priority — 48 hours. Case assigned yesterday at 09:00.
Current stage: Research
Status: Research 60% complete. Some social media platforms blocked by network filter.
PHC: 5 hours. AHC logged so far: 3.2 hours.

Your task:
1. Which case is at greater SLA risk and why?
2. What exact action must you take by end of today for Case A?
3. For Case B — the blocked social media platforms. How should you handle this?
4. If Case A is confirmed as a breach, who is notified and in what order?`,
    correctAnswers: {
      risk: "Case B is at higher immediate risk — 48hr SLA expires at 09:00 tomorrow. 33 hours remaining, 40% research still to complete plus drafting and QC time. Case A has a buffer of 27 hours with 80% completion.",
      caseA: "Notify line manager immediately (do not wait for stand-up). Escalate the HR documentation block. Do not let end of day pass without manager awareness. Log the blocker in the case notes with timestamps.",
      caseB: "Document the blocked platforms in case notes. Attempt alternative access methods within policy. If still blocked, notify manager and log the technical blocker — this is a valid SLA mitigation factor. Do not skip the sources.",
      breach: "1. Line manager/SOM immediately. 2. SOM escalates to client at 24-hour breach. Document all actions taken and blockers encountered."
    }
  },
  {
    id: "sim-4", title: "GDPR Data Breach — 72-Hour Decision", difficulty: "Advanced",
    track: "cyber", estimatedMins: 30, sopRef: ["gdpr-gate"],
    description: "A potential personal data breach has been discovered. Work through the GDPR breach notification decision.",
    scenario: `It is Monday 09:15. You receive the following alert:

**Security Alert**
A laptop belonging to a senior analyst was reported lost at an airport on Saturday evening (18:00). 
The laptop contained:
- A due diligence report on a named individual (EU citizen, high-profile businessman)
- Research notes from two open cases involving EU data subjects
- An encrypted password manager (master password held only by the analyst)
- The laptop itself was NOT encrypted (contrary to policy)

The lost property was reported to IT Security by the analyst on Saturday at 20:00. IT Security escalated to the Security Manager this morning (Monday 09:00).

Your task:
1. Is this a personal data breach under GDPR? Justify your answer.
2. When did the 72-hour notification clock start? Has it expired?
3. Does this breach require notification to the supervisory authority? Why/why not?
4. Does it require communication to the data subjects?
5. What immediate containment actions should have been taken on Saturday?`,
    correctAnswers: {
      breach: "Yes — an unencrypted laptop containing personal data of identified individuals has been lost. This is a confidentiality and availability breach under GDPR Article 4(12).",
      clock: "The clock started when the controller became aware — not when the breach occurred. The analyst reported to IT Security at 20:00 Saturday; IT escalated to the Security Manager at 09:00 Monday. The organisation became aware at 20:00 Saturday. 72 hours expires Tuesday 20:00. If the Security Manager was not made aware until Monday, there may be an internal escalation failure to document.",
      supervisory: "Yes — the breach involves personal data of identified EU citizens, the laptop was unencrypted (contrary to policy), and the data includes detailed personal information. This is likely to result in risk to individuals' rights and freedoms. Notification to the supervisory authority (DPC/ICO) required within 72 hours of awareness.",
      dataSubjects: "Possibly required if likely to result in HIGH risk to the data subjects — high-profile businessman, sensitive personal information. Likely yes. Senior management decision required urgently.",
      containment: "Immediately: remote wipe of laptop (if MDM enabled). Revoke all VPN/platform access credentials from device. Preserve the analyst's account access logs. Contact lost property/airport authority. Log incident with timestamp of every action."
    }
  },
  {
    id: "sim-5", title: "Financial Crime — SAR Decision", difficulty: "Advanced",
    track: "inv", estimatedMins: 25, sopRef: ["financial-investigations", "kyc-aml"],
    description: "A complex AML scenario requiring a SAR decision. Apply your knowledge of tipping-off and reporting obligations.",
    scenario: `You are reviewing a KYC/AML case. The following information has been gathered:

**Customer: Bright Star Trading Ltd**
- Incorporated in the British Virgin Islands, 6 months ago
- Directors: Two individuals, both from a high-risk jurisdiction
- Bank account opened with a UK bank. Multiple large cash deposits within 30 days of account opening
- Stated business: import/export of electronics
- No verifiable website, no employees found on LinkedIn, registered office is a shared mailbox service
- Transaction pattern: Cash deposited → immediate wire transfer to Malaysia → partial return as "supplier payment"
- Sanctions check: Directors clear on OFAC and EU lists
- PEP check: One director is a first-degree relative of a senior government official (the director is not a direct PEP)

Your task:
1. What money laundering stage(s) does this activity most likely represent?
2. Identify FIVE specific red flags present in this case.
3. Should a SAR be filed? What is your threshold?
4. Who approves the SAR before submission?
5. What must you NOT do after deciding to file a SAR, and why?`,
    correctAnswers: {
      stages: "Placement (cash deposits into banking system) and Layering (immediate wire transfers to Malaysia with partial return to obscure the trail). Classic layering pattern.",
      redFlags: "1. BVI incorporation with no verifiable business operations. 2. Shared mailbox registered office — no real presence. 3. Large cash deposits immediately after account opening. 4. Rapid movement: cash → overseas wire → partial return ('round-tripping'). 5. High-risk jurisdiction directors. 6. Close relative of senior government official (PEP-adjacent). 7. No employees, no verifiable web presence for claimed import/export business.",
      sar: "Yes — there are reasonable grounds to suspect money laundering. The threshold is 'knows, suspects, or has reasonable grounds to suspect' — not certainty. The cumulative picture here clearly meets the threshold.",
      approves: "The MLRO (Money Laundering Reporting Officer) reviews and approves all SARs before submission to the National Crime Agency (UK) or Financial Intelligence Unit (Ireland).",
      notDo: "Do NOT tip off the customer that a SAR has been filed or that an investigation is underway. This is the tipping-off offence under the Proceeds of Crime Act. Do not close the account in a way that alerts the customer, do not discuss the SAR with anyone outside the investigation team."
    }
  }
  ,{
    id: "sim-6", title: "GDPR Breach — 72-Hour Decision",
    difficulty: "Advanced", track: "cyber", estimatedMins: 25,
    sopRef: ["GDPR Compliance Gate SOP", "GDPR Article 32/33/34"],
    description: "A potential personal data breach has been escalated. Work through the Article 33 notification decision.",
    scenario: `SECURITY INCIDENT — MONDAY 09:15

You receive the following escalation:

A senior analyst reported to IT Security on Saturday evening (20:00) that their work laptop was lost at an airport. The laptop has now been confirmed as lost — not recovered.

Contents confirmed by the analyst:
— A completed DDRS-Individual report on a named EU citizen (high-profile businessman)
— Research notes for two open cases involving named EU data subjects
— An encrypted password manager (master password known only to the analyst)
— Work email with the last 30 days of email including case correspondence

Security finding: the laptop was NOT encrypted — contrary to mandatory policy. No MDM was installed, so remote wipe is not possible.

IT Security was notified Saturday 20:00. The Security Manager was not made aware until Monday 09:00 when IT escalated.

Answer the following:
1. Is this a personal data breach under GDPR? Reference the Article 4(12) definition.
2. When did the 72-hour clock start? What is the exact deadline?
3. Does Article 33 notification to the supervisory authority apply? Justify fully.
4. Does Article 34 communication to data subjects apply? Why/why not?
5. What TWO immediate containment actions should have been completed by Saturday 22:00?
6. What policy failures does this incident reveal, and what two controls should be implemented?`,
    correctAnswers: {
      breach: "YES. Article 4(12) GDPR: a breach of security leading to accidental or unlawful destruction, loss, alteration, unauthorised disclosure of, or access to, personal data. Loss of an unencrypted laptop containing personal data of identified individuals is a confidentiality and availability breach.",
      clock: "Clock started when the CONTROLLER became aware — Saturday 20:00 when IT Security was notified. The 72-hour deadline is Tuesday 20:00. The delay in escalating from IT Security to the Security Manager (Saturday 20:00 to Monday 09:00) is an internal process failure that must be documented — the clock did not pause.",
      article33: "YES. The breach involves identified EU citizens' personal data; the laptop was unencrypted (policy breach); data includes sensitive personal information. This is likely to result in risk to individuals' rights and freedoms. Notify the DPC/ICO within the Tuesday 20:00 deadline.",
      article34: "LIKELY YES for the businessman subject — a DDRS report on a named high-profile individual on an unencrypted laptop meets the HIGH RISK threshold of Article 34. Senior management decision required urgently.",
      containment: "1) Immediately revoke all platform and email account credentials accessible via the device. 2) Contact lost property at the airport and airline to initiate recovery. (Remote wipe was not available in this scenario — but should have been a control in place.)",
      policy: "Policy failures: (1) Device encryption policy not technically enforced — should be enforced by MDM, not individual compliance. (2) No MDM enrollment for analyst laptops — remote wipe capability is a mandatory control for devices containing personal data. Both are Article 32 TOMs failures."
    }
  },
  {
    id: "sim-7", title: "Board Security Report — Preparing the Quarterly Brief",
    difficulty: "Advanced", track: "lead", estimatedMins: 30,
    sopRef: ["Scorecard SOP", "Manager Approval Process SOP"],
    description: "It is the last week of Q2. Prepare a structured quarterly board security report from the provided data.",
    scenario: `BOARD REPORT BRIEFING DATA — Q2 2026

You are preparing the quarterly security report for the board. You have the following data:

METRICS (Q2 vs Q1):
— MTTD: 4.2 hours (Q1: 6.8 hours) ↑ improving
— MTTR: 18 hours (Q1: 22 hours) ↑ improving  
— SLA Compliance Rate: 94% (Q1: 91%) ↑ improving
— QC First-Pass Rate: 87% (Q1: 85%) ↑ improving
— Open Regulatory Findings: 3 (Q1: 5) ↓ improving
— Staff with current training completion: 71% (Q1: 64%) ↑ improving

SIGNIFICANT INCIDENTS (Q2):
— IR-2026-089: Phishing campaign targeting finance team. 2 accounts compromised before containment. No data exfiltration confirmed. MTTD: 2.1 hours. Controls improved: enhanced email filtering deployed.
— IR-2026-114: Suspected internal data misuse investigation. Ongoing — IR open, no findings yet.
— ORP-2026-211: Executive digital footprint assessment triggered by threat intelligence alert. Critical PII exposure identified. Remediation plan in progress.

UPCOMING OBLIGATIONS:
— ISO 27001 surveillance audit: 15 September 2026
— GDPR Article 30 ROPA annual review: 31 July 2026
— Cyber insurance renewal: 1 August 2026

BUDGET: Q2 security spend €287,000 vs plan €295,000 (€8k underspend). Projected ALE reduction vs Q1: €340,000.

DECISION REQUIRED FROM BOARD:
The security team requires approval for a €180,000 investment in an enhanced endpoint detection platform to close a critical gap identified in the Q2 penetration test.

Answer the following:
1. Write the Security Posture Summary section (3-4 sentences, BLUF, no technical jargon).
2. Identify the ONE metric that requires a management explanation to the board, and explain why.
3. How should IR-2026-114 be reported to the board? What should and should NOT be included?
4. What is the FAIR ALE-based argument for the €180,000 endpoint detection investment?
5. Draft the 'Decisions Required' section for the board report.`,
    correctAnswers: {
      summary: "The security posture improved across all measured indicators in Q2 compared to Q1. Detection time improved by 38%, response time by 18%, and SLA compliance reached 94%. Two significant incidents were managed and contained in Q2 with no confirmed data loss. The team is on track to meet all Q3 regulatory obligations.",
      metric: "Training completion at 71% is the metric requiring explanation — 29% of staff are not current with mandatory training. This is a regulatory risk (GDPR training obligations, NIS2 basic hygiene requirements, ISO 27001 people controls) and an operational risk. The board will want a timeline for reaching 100%.",
      investigation: "Report as an open investigation with minimal detail: 'An internal investigation is currently ongoing. It is being conducted in accordance with fair procedures. No findings have been made at this stage.' Do NOT include: the subject's identity, allegations, details of the investigation, any preliminary findings, or any information that could compromise the investigation or create legal liability.",
      fair: "Q2 penetration test identified a critical detection gap. Estimated Annual Rate of Occurrence for an undetected endpoint intrusion given this gap: 0.4 events per year. Estimated Single Loss Expectancy: €1.2 million (incident response, regulatory notification, business interruption). ALE: €480,000. The €180,000 investment reduces ALE to an estimated €120,000 — a €360,000 annual risk reduction for €180,000 investment. ROI: 100% in year one.",
      decisions: "DECISION REQUIRED: Approval for a €180,000 capital investment in an enhanced endpoint detection platform to address a critical gap identified in the Q2 penetration test. This investment is projected to deliver a €360,000 annual reduction in cyber incident exposure based on FAIR ALE calculations. Recommended for approval by [date]. Sponsor: [CISO/Security Director]."
    }
  }
,

  {
    id: "sim-8", title: "Door Supervisor — Confrontation & Use of Force", difficulty: "Intermediate",
    track: "pso", estimatedMins: 20, sopRef: ["use-of-force", "occurrence-book"],
    description: "A confrontation at the entrance of a licensed venue is escalating. Apply the force continuum and post-incident procedure correctly.",
    scenario: `It is 23:40 on a Saturday night. You are the door supervisor at a licensed nightclub. A man (mid-20s, approximately 6ft, visibly intoxicated) has been refused entry by your colleague. He is now:

— Shouting aggressively at both of you
— Invading your colleague's personal space
— Pointing his finger in your colleague's face
— Threatening: "I'll come back and smash this place up"

A small crowd of approximately 15 people is watching. Your colleague appears shaken.

A second man with the refused subject — calmer but watching closely — has his hand in his jacket pocket.

Your task:
1. Using the force continuum, what is the appropriate response level right now? What should you NOT do yet?
2. Apply the SAOR de-escalation model. What are the exact words you might use?
3. What does the threat to "come back and smash this place up" require you to do immediately?
4. Regarding the second man with his hand in his pocket — what is your threat assessment and how does this affect your positioning?
5. If the first man grabs your colleague's collar, what level of force becomes lawful and under what legal authority?
6. What must you write in the occurrence book, and within what timeframe?`,
    correctAnswers: {
      forceLevel: "Presence and verbal (force continuum levels 1-2). The subject is aggressive but not yet physically assaultive. Physical intervention is not justified at this stage. Do NOT initiate physical contact — this would escalate the situation and may be unlawful as the subject has not yet made physical contact.",
      saor: "Stop: pause, do not mirror his aggression, adopt a calm open stance. Acknowledge: 'I can see you're frustrated — that's understandable.' Offer: 'Here's what I can do: let me speak with the manager about what happened.' Respond: choose the approach that de-escalates without conceding on the entry refusal.",
      threat: "The threat to return and cause damage must be reported to police immediately (101 or 999 if you believe it will be carried out imminently). Document the exact words used, time, and description of the person. The venue management must be notified so they can decide whether to alert police and increase security.",
      secondMan: "Unknown threat — his hand in his pocket is a potential weapon indicator. Maintain visual awareness, position yourself to have eyes on both men simultaneously (do not allow them to flank you), stay out of grabbing range, and communicate your concern to your colleague via earpiece or discreet signal. Do not fixate on the aggressive subject to the point of losing awareness of the second.",
      forceLawful: "If he grabs your colleague's collar, he has committed assault and is causing immediate physical harm. Reasonable force to protect your colleague becomes lawful under the Non-Fatal Offences Against the Person Act 1997 s.18. Force must be proportionate — sufficient to break the grip and create distance. A strike to the face without attempt to break the grip first would likely not be proportionate.",
      occurrenceBook: "Entry required immediately after the incident — within 15 minutes maximum while details are fresh. Must include: exact time(s) of events, full physical description of both men, exact words of the threat (in quotation marks), your actions at each stage, any force used (nature, reason, duration), injuries to any person, names of witnesses, that police were notified and incident reference number if obtained. Errors: single line through, initials, date."
    }
  },
  {
    id: "sim-9", title: "Control Room — Perimeter Breach & Incident Response", difficulty: "Intermediate",
    track: "pso", estimatedMins: 25, sopRef: ["control-room", "incident-response"],
    description: "A suspected perimeter breach has been detected at a logistics facility at 03:00. Manage the incident from the control room.",
    scenario: `You are the control room operator at a large logistics depot. It is 03:17.

Your radio activates:

**Mobile Patrol (Unit 2):** "Control, Unit 2. I'm at the south perimeter. I've found a section of chain-link fence that's been cut — approximately a 1-metre gap. Fresh cut. There are tyre tracks on the muddy ground on the external side and what looks like drag marks leading toward Bay 7. I can see a gap in the roller door of Bay 7 — it's not fully closed. No visual on any persons."

You check your CCTV system:
— Camera 7 (Bay 7 exterior): static/interference — no image
— Camera 8 (Bay 7 interior): offline
— Camera 6 (south perimeter): image showing the cut fence, unit 2 visible
— All other cameras: normal

You have tried to call the duty supervisor twice — no answer.
The site manager's emergency number rings out.

Your task:
1. What are your immediate actions in the first 2 minutes?
2. Unit 2 is asking whether to enter Bay 7 to investigate. What is your instruction and why?
3. Two cameras covering the affected area are offline. What does this tell you analytically?
4. You cannot reach the supervisor or site manager. How do you proceed?
5. Emergency services arrive. Using METHANE format, transmit the situation report.
6. What must you document in the duty log, and what is the evidential significance of your log entries?`,
    correctAnswers: {
      immediate: "1) Instruct Unit 2 to withdraw to a safe distance and maintain visual on Bay 7 without approaching — do not enter. 2) Call 999 immediately — this is a suspected active break-in. 3) Attempt to contact supervisor and site manager again — document the times and outcomes of each attempt. 4) Begin a duty log entry recording the exact time Unit 2 first reported and every subsequent event. 5) Activate the site's intruder alarm if not already triggered.",
      bay7: "Unit 2 must NOT enter Bay 7. A security officer has no authority to enter a potentially occupied building where intruders may be present — this is a police function. Entry creates: risk to Unit 2 (unknown number of persons inside, potential weapons), risk of disturbing evidence (footprints, fingerprints, disturbed goods), and potential legal liability (excessive force if confrontation occurs). Maintain external cordon and await police.",
      cameras: "Two cameras covering the affected area being offline at the time of a suspected break-in is analytically significant — it is consistent with deliberate camera interference or blinding, which suggests a pre-planned and targeted entry rather than an opportunist. This information must be included in the handover to police as it changes the threat assessment. Preserve CCTV system logs showing when each camera went offline.",
      noSupervisor: "You have a duty of care to the site and to Unit 2. Absence of a supervisor does not suspend your obligations. Contact emergency services immediately (you do not need supervisor authorisation to call 999). Continue attempting to reach the supervisor and site manager every 5 minutes, documenting each attempt. If the site has a second-tier emergency contact (e.g. operations manager), use it. Document that you were unable to reach the primary and secondary contacts.",
      methane: "M — Major incident: Standby (potential active break-in, advise Major). E — Exact location: [Depot name and address], Bay 7 and south perimeter, Grid ref/postcode. T — Type: Suspected burglary in progress, commercial premises. H — Hazards: Unknown number of intruders, unknown if armed; heavy goods vehicles and forklifts in bays. A — Access: Main gate on [street], security will meet you — south perimeter gate compromised. N — Number of casualties: None confirmed, one security officer on cordon (Unit 2). E — Emergency services: Police required, no other services required at this stage.",
      dutyLog: "The duty log is a contemporaneous record made at the time of events — it is admissible as evidence and will be scrutinised in any criminal prosecution or civil claim. Record: exact times of every event, every communication made and received (including unanswered calls with times), every action taken, every instruction given to Unit 2, and every observation from CCTV. Do not erase or amend entries — use a single line through errors, initial, and date. Contemporaneous records have far greater evidential weight than retrospective accounts."
    }
  }

];
