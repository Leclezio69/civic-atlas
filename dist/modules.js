// Learning content is adapted from the ten supplied Northbridge playbooks.
// Page numbers are one-based and correspond to the PDF viewer.
export const modules = [
  {
    "id": "strategy",
    "title": "Government strategy",
    "sourceTitle": "The AI Government Strategy Playbook",
    "volume": 1,
    "subtitle": "Choose a public problem worth funding.",
    "theme": "Strategy",
    "pdf": "/playbooks/ai-government-strategy-playbook.pdf",
    "pages": 32,
    "brief": "You chair Northbridge’s investment panel. Two teams want to reduce the benefits backlog. One would check applications for missing evidence. The other would score claimants’ eligibility. Decide what the city can responsibly pilot and how you would know when to stop.",
    "outcomes": [
      "Separate preparation work from decisions that affect rights.",
      "Set a baseline and a stop condition before funding.",
      "Define who can approve, review and pause a pilot."
    ],
    "lessons": [
      {
        "title": "Start with the public value test",
        "body": "Write down the current problem, authority to act, groups at risk, route to repair and expected five-year cost. A promising benefit cannot compensate for a missing answer elsewhere in the test.",
        "action": "Ask the team to show one measured resident problem and name who would correct a wrong result.",
        "page": 7
      },
      {
        "title": "Rank the surviving proposals",
        "body": "After excluding prohibited uses, compare candidates on resident pain (25%), volume (15%), evidence readiness (20%), risk and reversibility (20%), equity (10%) and deliverability (10%). Bring frontline staff into scoring and keep dissent with the result.",
        "action": "Give a proposal a lower evidence score if nobody can independently check a correct answer.",
        "page": 9
      },
      {
        "title": "Design a pilot that can fail",
        "body": "Lock the baseline, test period, representative cases and thresholds in advance. Commission an independent evaluation and hear from people who abandoned the journey. Include the cost of staff checking the output.",
        "action": "Agree what would trigger a pause, who can call it and which service route residents will use.",
        "page": 24
      }
    ],
    "example": {
      "title": "Two proposals at the same gate",
      "body": "In the playbook’s fictional review, intake assistance starts with a 6.1% error rate. Officers keep decision authority and can reverse extraction errors. Automated eligibility scoring fails the authority, fairness and reversibility questions. The panel withdraws it before engaging a supplier.",
      "page": 7
    },
    "controls": [
      {
        "title": "Watch for a change in purpose",
        "body": "A guidance tool that starts ordering cases changes how people are served. Reassess its risk tier when its behaviour, data or decision role changes.",
        "page": 21
      },
      {
        "title": "Reopen the decision at scale",
        "body": "At the scale gate, recheck unit costs and oversight capacity at production volumes. A successful small pilot supplies evidence for that decision.",
        "page": 29
      }
    ],
    "decision": {
      "scenario": "A vendor will bundle automatic eligibility scoring with an intake pilot at no extra charge. The intake use has passed the public value test. No one has established authority or a repair route for scoring.",
      "question": "Which proposal should the panel authorise?",
      "choices": [
        {
          "text": "Enable both functions and review a sample weekly.",
          "feedback": "Sampling might reveal errors after they affect residents. It does not establish authority or a route to repair.",
          "correct": false
        },
        {
          "text": "Limit the pilot to intake and withdraw the scoring proposal.",
          "feedback": "The two uses have different consequences. The approved intake scope supports officers, while the proposed score fails three parts of the test.",
          "correct": true
        },
        {
          "text": "Obtain a supplier indemnity for errors in the score.",
          "feedback": "An indemnity can allocate financial exposure. Northbridge still owns the decision and its effect on residents.",
          "correct": false
        }
      ],
      "page": 7
    },
    "assignment": {
      "title": "Write the investment decision",
      "steps": [
        "Select one service problem. Record its baseline, source, measurement date and owner.",
        "State the authority to act, the groups to test and the threshold that pauses the pilot. Describe how staff would find and contact affected residents.",
        "Compare whole-life cost with the measured benefit. Sign a proceed, revise or withdraw decision and identify the accountable officer."
      ],
      "deliverable": "A one-page public value test and signed pilot recommendation.",
      "page": 30
    },
    "sources": [
      {
        "title": "The AI Government Strategy Playbook",
        "page": 1
      },
      {
        "title": "Government does not get to move fast and break things",
        "page": 2
      },
      {
        "title": "Ten volumes, one public-value discipline",
        "page": 3
      },
      {
        "title": "The strategy in one page",
        "page": 4
      },
      {
        "title": "High volume, heavy documents, long queues",
        "page": 5
      },
      {
        "title": "Where AI does not pay, and classical controls govern",
        "page": 6
      },
      {
        "title": "The public value test: five questions, all must pass",
        "page": 7
      },
      {
        "title": "No mandate, no project",
        "page": 8
      },
      {
        "title": "Score the portfolio, not the pitch",
        "page": 9
      },
      {
        "title": "Three waves: prove, extend, connect",
        "page": 10
      },
      {
        "title": "A balanced portfolio, or a smaller one",
        "page": 11
      },
      {
        "title": "Central standards, service ownership",
        "page": 12
      },
      {
        "title": "Who may decide what, in writing",
        "page": 13
      },
      {
        "title": "Transparency is a control, not a courtesy",
        "page": 14
      },
      {
        "title": "Designed for the resident who struggles most",
        "page": 15
      },
      {
        "title": "Data and records: the unglamorous foundation",
        "page": 16
      },
      {
        "title": "Interoperability and identity, without the mega-platform",
        "page": 17
      },
      {
        "title": "Buy outcomes and exit rights, not demos",
        "page": 18
      },
      {
        "title": "A model inventory the state actually controls",
        "page": 19
      },
      {
        "title": "Ready means measurable, staffed and reversible",
        "page": 20
      },
      {
        "title": "Four risk tiers, four levels of control",
        "page": 21
      },
      {
        "title": "Equity and due process are launch criteria",
        "page": 22
      },
      {
        "title": "Security, privacy and fraud: assume a motivated reader",
        "page": 23
      },
      {
        "title": "Pilots that are allowed to fail",
        "page": 24
      },
      {
        "title": "The 36-month roadmap, tied to evidence",
        "page": 25
      },
      {
        "title": "The workforce is the delivery mechanism",
        "page": 26
      },
      {
        "title": "Measure what residents feel",
        "page": 27
      },
      {
        "title": "Economics: honest money, five-year view",
        "page": 28
      },
      {
        "title": "Scale is a new decision, not a bigger pilot",
        "page": 29
      },
      {
        "title": "Fill these in: the strategy as a working record",
        "page": 30
      },
      {
        "title": "Fill these in: proof, measurement, incidents, suppliers",
        "page": 31
      },
      {
        "title": "Rules to keep when everything else is under pressure",
        "page": 32
      }
    ],
    "connects": [
      "citizen-services",
      "workforce-trust",
      "capstone"
    ]
  },
  {
    "id": "citizen-services",
    "title": "Citizen services",
    "sourceTitle": "The Citizen Services and Digital Front Doors Playbook",
    "volume": 2,
    "subtitle": "Design a front door residents can finish using.",
    "theme": "Service delivery",
    "pdf": "/playbooks/ai-government-citizen-services-playbook.pdf",
    "pages": 32,
    "brief": "A resident starts a housing enquiry online, switches to the phone and is asked to explain everything again. Design the transition from published guidance to a staffed service, including the case reference, access needs and promised next contact.",
    "outcomes": [
      "Define a source-grounded answer and its limits.",
      "Specify what follows a resident across channels.",
      "Measure a completed journey and the effort it took."
    ],
    "lessons": [
      {
        "title": "Give the assistant an approved source",
        "body": "Answer service questions from owned, current guidance. Show the source and disclose AI use at the start. If the guidance is silent, state the gap and offer a human route. The assistant can explain criteria while a case officer determines individual entitlement.",
        "action": "Test one common question, one uncited claim and a request for a personal decision.",
        "page": 13
      },
      {
        "title": "Design the handoff as a service",
        "body": "Record the need, what was tried, documents already on file and access needs. Give the resident a reference, named queue, realistic wait and callback option. A person in distress needs a live transfer to trained staff.",
        "action": "Have an adviser take the case using only the handoff summary. Count the facts the resident must repeat.",
        "page": 14
      },
      {
        "title": "Measure the outcome across channels",
        "body": "Pair digital containment with task completion and effort for the same cohort. Compare repeats after handoff, kept callbacks, and both median and 90th-percentile time to outcome. Break out results by language, disability and channel.",
        "action": "Investigate a rising containment figure when task completion is flat or falling.",
        "page": 24
      }
    ],
    "example": {
      "title": "What changed at handoff",
      "body": "In Northbridge’s illustrative example, residents repeated an average of 2.7 facts after a transfer before the shared case view. That fell to 0.3 when advisers could see the summary. The measure captures a burden that conversation length alone would miss.",
      "page": 14
    },
    "controls": [
      {
        "title": "Preserve the original route",
        "body": "Keep paper and phone usable and measure the service offered through them. A resident’s choice of channel should carry through to the next step.",
        "page": 19
      },
      {
        "title": "Gate every release",
        "body": "Test citation correctness, refusals, answers in supported languages and attempts to elicit a decision. Give a named owner the rollback trigger.",
        "page": 30
      }
    ],
    "decision": {
      "scenario": "An applicant asks twice whether their circumstances guarantee a housing payment. The published page lists the criteria but does not resolve this case. They ask to speak with a person.",
      "question": "What should the assistant do next?",
      "choices": [
        {
          "text": "Offer the best estimate with a confidence percentage.",
          "feedback": "A number would give the appearance of a personal determination. The published source does not establish this resident’s entitlement.",
          "correct": false
        },
        {
          "text": "Ask the resident to telephone the general number.",
          "feedback": "The phone route exists, but sending them there without context makes them restart.",
          "correct": false
        },
        {
          "text": "Offer a staffed handoff with the summary, reference and expected wait.",
          "feedback": "The request and two unsuccessful attempts both trigger handoff. The receiving adviser can use the existing evidence and explain the next step.",
          "correct": true
        }
      ],
      "page": 14
    },
    "assignment": {
      "title": "Test one channel transfer",
      "steps": [
        "Choose a journey and identify the point where published guidance runs out.",
        "Draft the case summary with access needs, evidence already supplied and agreed next step. Write the resident-facing acknowledgement.",
        "Have a colleague act as the receiving adviser. Record repeated facts, missing information and whether the agreed callback was possible."
      ],
      "deliverable": "A completed handoff summary, acknowledgement and one tested improvement.",
      "page": 30
    },
    "sources": [
      {
        "title": "The Citizen Services and Digital Front Doors Playbook",
        "page": 1
      },
      {
        "title": "The front door is the government, as far as the resident is concerned",
        "page": 2
      },
      {
        "title": "Where this volume sits",
        "page": 3
      },
      {
        "title": "Five doors, no hallway",
        "page": 4
      },
      {
        "title": "Every channel is a cost, a promise, or both",
        "page": 5
      },
      {
        "title": "AI pays where residents get lost, not where officers decide",
        "page": 6
      },
      {
        "title": "The stop list: what the front door never automates",
        "page": 7
      },
      {
        "title": "Ten principles, tested at every gate",
        "page": 8
      },
      {
        "title": "The front-door stack: boring on purpose",
        "page": 9
      },
      {
        "title": "Search is the real homepage",
        "page": 10
      },
      {
        "title": "Content design: most front-door failure is content failure",
        "page": 11
      },
      {
        "title": "Language access is a right with a workflow",
        "page": 12
      },
      {
        "title": "The AI assistant: grounded, cited, honest about its limits",
        "page": 13
      },
      {
        "title": "Handoff: the resident never repeats the story",
        "page": 14
      },
      {
        "title": "Identity and accounts without exclusion",
        "page": 15
      },
      {
        "title": "Forms that finish",
        "page": 16
      },
      {
        "title": "Accessibility is a launch criterion, not a remediation project",
        "page": 17
      },
      {
        "title": "Assisted digital: help is a service, not a fallback",
        "page": 18
      },
      {
        "title": "The non-digital promise: paper and phone, first-class",
        "page": 19
      },
      {
        "title": "The contact centre, rebuilt around the case",
        "page": 20
      },
      {
        "title": "One case view: the resident tells the story once",
        "page": 21
      },
      {
        "title": "Proactive and life-event services: news before the question",
        "page": 22
      },
      {
        "title": "Trust, transparency and the public register",
        "page": 23
      },
      {
        "title": "Measurement: completion, effort and equity - never containment alone",
        "page": 24
      },
      {
        "title": "Economics: cheaper per answer can still mean dearer per outcome",
        "page": 25
      },
      {
        "title": "Workforce: the advisor's job gets harder and better",
        "page": 26
      },
      {
        "title": "Failure: the assistant will be wrong in public - be ready",
        "page": 27
      },
      {
        "title": "Build, buy and supplier discipline at the front door",
        "page": 28
      },
      {
        "title": "Gates C0-C5: no gate, no launch",
        "page": 29
      },
      {
        "title": "Templates 1-4: copy, complete, file with the gate evidence",
        "page": 30
      },
      {
        "title": "Templates 5-8 and the Volume 2 assurance checklist",
        "page": 31
      },
      {
        "title": "20 Golden Rules for the front door",
        "page": 32
      }
    ],
    "connects": [
      "benefits-casework",
      "data-records",
      "workforce-trust"
    ]
  },
  {
    "id": "benefits-casework",
    "title": "Benefits & casework",
    "sourceTitle": "The Benefits, Licensing and Casework Playbook",
    "volume": 3,
    "subtitle": "Put the evidence in front of the officer.",
    "theme": "Service delivery",
    "pdf": "/playbooks/ai-government-benefits-casework-playbook.pdf",
    "pages": 32,
    "brief": "A household submits its income evidence. An extraction tool reads a handwritten amount that conflicts with the case record. Decide how the caseworker should verify the value and deal with any later decisions that relied on it.",
    "outcomes": [
      "Trace an extracted field to its source.",
      "Build a summary an officer can challenge.",
      "Turn a successful appeal into a service correction."
    ],
    "lessons": [
      {
        "title": "Treat extraction as a working layer",
        "body": "Keep the original, show the image region behind each field and send uncertain items to a human queue. Conflicting dates or amounts become questions for review. Sample document classes separately so a good typed-document score cannot hide poor handwriting recognition.",
        "action": "Open the source region for a disputed field and check whether the applicant can correct a mismatch.",
        "page": 12
      },
      {
        "title": "Make a summary that supports judgement",
        "body": "Separate verified, missing and disputed evidence. Put the timeline, open questions, language needs and relevant flags in view. Link factual statements to the record, timestamp the summary and test for important omissions.",
        "action": "Ask a second reviewer to find one inconvenient fact the summary left out.",
        "page": 13
      },
      {
        "title": "Use appeals to find repeat defects",
        "body": "A fresh officer reviews the original reasons, rule trace, evidence and new facts. Code why decisions change. Repeated findings of missing evidence point to the retrieval or matching process and its owner.",
        "action": "Track the cause of an overturn and test whether the same error affected other cases.",
        "page": 21
      }
    ],
    "example": {
      "title": "Why appeals were succeeding",
      "body": "In the fictional appeals review, 40% of overturns involved evidence the service already held but failed to see. Correcting evidence matching reduced overturns by a quarter over two quarters. A target to reduce the number of appeals would have hidden the cause.",
      "page": 21
    },
    "controls": [
      {
        "title": "Keep the decision with the caseworker",
        "body": "A case summary can list rules and open questions. The officer makes the assessment and signs the reasoning.",
        "page": 13
      },
      {
        "title": "Correct downstream decisions",
        "body": "When an extraction changes, flag assessments that used the wrong figure and make the correction visible to the applicant.",
        "page": 12
      }
    ],
    "decision": {
      "scenario": "The tool read a weekly amount as a monthly figure. A previous assessment used it and the resident has queried their letter.",
      "question": "What is the best first response?",
      "choices": [
        {
          "text": "Verify the source, correct the field and trace affected assessments.",
          "feedback": "The original document is authoritative. The correction must reach every affected assessment, with the resident able to see it.",
          "correct": true
        },
        {
          "text": "Correct the next letter and leave the case record alone.",
          "feedback": "The incorrect field remains available to influence future summaries and decisions.",
          "correct": false
        },
        {
          "text": "Request a new copy of all supporting documents.",
          "feedback": "The service already has the original. Check the exact source and request further evidence only if a specific gap remains.",
          "correct": false
        }
      ],
      "page": 12
    },
    "assignment": {
      "title": "Audit a one-page case summary",
      "steps": [
        "Use a fictional case with a handwritten amount, an amendment and a missing document. Mark the status of each item.",
        "Check the summary against the source, record omissions and misstatements separately, and list the decisions or letters each fault could affect.",
        "Assign a reviewer and correction owner. Draft a plain explanation of the correction and the next step for the resident."
      ],
      "deliverable": "An evidence-status summary and a completed quality sample.",
      "page": 30
    },
    "sources": [
      {
        "title": "The Benefits, Licensing and Casework Playbook",
        "page": 1
      },
      {
        "title": "Casework is where the state keeps or breaks its promises",
        "page": 2
      },
      {
        "title": "Where this volume sits",
        "page": 3
      },
      {
        "title": "The queue is a symptom, not the disease",
        "page": 4
      },
      {
        "title": "One case, one lifecycle, no black holes",
        "page": 5
      },
      {
        "title": "AI pays in preparation, checking and summarising",
        "page": 6
      },
      {
        "title": "The stop list: decisions AI never makes",
        "page": 7
      },
      {
        "title": "Ten principles, tested at every gate",
        "page": 8
      },
      {
        "title": "Explained before it is assessed",
        "page": 9
      },
      {
        "title": "Rules as code, law as source",
        "page": 10
      },
      {
        "title": "Asked once, checked kindly",
        "page": 11
      },
      {
        "title": "Document intelligence with a human check",
        "page": 12
      },
      {
        "title": "The case summary: one page, whole story",
        "page": 13
      },
      {
        "title": "Drafting decisions and letters officers sign",
        "page": 14
      },
      {
        "title": "Triage and allocation without hidden bias",
        "page": 15
      },
      {
        "title": "Proportionate, predictable, appealable",
        "page": 16
      },
      {
        "title": "Renewals, changes and the case that never closes",
        "page": 17
      },
      {
        "title": "The hardest cases get the most human service",
        "page": 18
      },
      {
        "title": "Signals surfaced fast, judgements made by people",
        "page": 19
      },
      {
        "title": "Fraud, error and the presumption of honesty",
        "page": 20
      },
      {
        "title": "Reconsideration is the quality system working in public",
        "page": 21
      },
      {
        "title": "One screen, the whole case, time to think",
        "page": 22
      },
      {
        "title": "Records, transparency and the public register",
        "page": 23
      },
      {
        "title": "Right first time, fair by group",
        "page": 24
      },
      {
        "title": "The case for casework AI, honestly counted",
        "page": 25
      },
      {
        "title": "Judgement is the job; administration was the interruption",
        "page": 26
      },
      {
        "title": "When casework AI fails, people feel it in their income",
        "page": 27
      },
      {
        "title": "Buy components, keep the judgement in-house",
        "page": 28
      },
      {
        "title": "B0-B5: no casework use scales without evidence",
        "page": 29
      },
      {
        "title": "Templates 1-4: copy, complete, file with the case or the gate record",
        "page": 30
      },
      {
        "title": "Templates 5-8 and the assurance checklist",
        "page": 31
      },
      {
        "title": "20 Golden Rules for benefits, licensing and casework",
        "page": 32
      }
    ],
    "connects": [
      "citizen-services",
      "data-records",
      "capstone"
    ]
  },
  {
    "id": "permitting-planning",
    "title": "Permitting & planning",
    "sourceTitle": "The Permitting, Planning and Land Use Playbook",
    "volume": 4,
    "subtitle": "Read the proposal in the context of its site.",
    "theme": "Service delivery",
    "pdf": "/playbooks/ai-government-permitting-planning-playbook.pdf",
    "pages": 32,
    "brief": "A planning panel receives a large file of consultation letters and a parcel map. The letters mention traffic repeatedly. One resident describes an access route at risk of flooding. Decide which facts and objections must reach the planner.",
    "outcomes": [
      "Validate an application against a published list.",
      "Check drawing and map evidence against versions and dates.",
      "Represent a material minority objection in the officer report."
    ],
    "lessons": [
      {
        "title": "Give the applicant one complete list",
        "body": "Map each application type to a published validation list. Check the file format, scale, site boundary and fees together, then get a person to confirm gaps before a notice goes out. Give the applicant a contact and a realistic cure date.",
        "action": "Record a second request for something visible at first review as a defect.",
        "page": 11
      },
      {
        "title": "Assemble a dated parcel record",
        "body": "Bring together the parcel boundary, planning history, adopted policy, statutory designations and physical constraints. Label modelled layers and record their date and coverage. A blank flood layer may reflect absent or stale data.",
        "action": "Refresh neighbouring applications and cumulative context at the decision date.",
        "page": 13
      },
      {
        "title": "Read consultation by issue",
        "body": "Cluster letters by the material issues they raise. Link the cluster to original representations, show duplicate campaigns and retain any relevant single objection. The case officer records the weight and reasons.",
        "action": "Trace an isolated drainage concern to its original letter and give it a place in the officer’s review.",
        "page": 14
      }
    ],
    "example": {
      "title": "A faster start to review",
      "body": "In the fictional Northbridge example, one complete validation check brought median time-to-valid from 19 days to four. Second gap notices fell by four-fifths. This measures application intake, a different interval from the time to reach a planning decision.",
      "page": 11
    },
    "controls": [
      {
        "title": "Verify a dimension in the drawing",
        "body": "Show the source region beside every extraction and distinguish superseded drawings. An unverified dimension stays marked as draft.",
        "page": 12
      },
      {
        "title": "Route borderline checks to the planner",
        "body": "Use versioned code for measurable standards and record the tolerance. A near-boundary result needs the underlying measurement and human review.",
        "page": 10
      }
    ],
    "decision": {
      "scenario": "One of 200 consultation letters identifies a potentially material drainage problem. A summariser groups it under miscellaneous comments.",
      "question": "How should the case officer handle it?",
      "choices": [
        {
          "text": "Keep only issues raised by several residents.",
          "feedback": "The number of submissions cannot establish the significance of the underlying evidence.",
          "correct": false
        },
        {
          "text": "Surface the issue with its source letter and record the planner’s judgement.",
          "feedback": "The lone representation may be material. Preserving its source lets the planner assess the concern and explain its weight.",
          "correct": true
        },
        {
          "text": "Treat the objection as a binding reason to refuse.",
          "feedback": "Surfacing an objection makes it available for assessment. Its planning weight still requires a reasoned judgement.",
          "correct": false
        }
      ],
      "page": 14
    },
    "assignment": {
      "title": "Assemble a dated parcel pack",
      "steps": [
        "List the boundary, site history and relevant designations. Identify the source, date and owner for each layer.",
        "Add physical constraints, current policy and neighbouring schemes. State known coverage gaps and distinguish modelled surfaces from confirmed records.",
        "Name the planner who will resolve a conflicting layer and explain what evidence an applicant or objector can inspect."
      ],
      "deliverable": "A parcel checklist with explicit gaps and a named decision owner.",
      "page": 30
    },
    "sources": [
      {
        "title": "The Permitting, Planning and Land Use Playbook",
        "page": 1
      },
      {
        "title": "Planning is where a city argues with itself - lawfully",
        "page": 2
      },
      {
        "title": "Where this volume sits",
        "page": 3
      },
      {
        "title": "Delay is usually design, not applicants",
        "page": 4
      },
      {
        "title": "One application, one lifecycle, no black holes",
        "page": 5
      },
      {
        "title": "AI pays in checking, mapping and summarising",
        "page": 6
      },
      {
        "title": "The stop list: judgements AI never makes",
        "page": 7
      },
      {
        "title": "Ten principles, tested at every gate",
        "page": 8
      },
      {
        "title": "The right route, first time",
        "page": 9
      },
      {
        "title": "Zoning and standards, as code - law as source",
        "page": 10
      },
      {
        "title": "Checked once, kindly, completely",
        "page": 11
      },
      {
        "title": "Plans, elevations and document intelligence",
        "page": 12
      },
      {
        "title": "Site, constraints and the parcel record",
        "page": 13
      },
      {
        "title": "Responses people can actually join - and planners can actually use",
        "page": 14
      },
      {
        "title": "Environment, heritage and design: support, not verdicts",
        "page": 15
      },
      {
        "title": "The officer report: drafted, not decided",
        "page": 16
      },
      {
        "title": "Obligations, agreements and the art of the enforceable condition",
        "page": 17
      },
      {
        "title": "The notice, the reasons, and standing behind both",
        "page": 18
      },
      {
        "title": "Inspections, discharge and enforcement: risk-based, human-led",
        "page": 19
      },
      {
        "title": "Challenges are the system auditing itself",
        "page": 20
      },
      {
        "title": "The local plan: evidence, scenarios and a twenty-year argument, kept honest",
        "page": 21
      },
      {
        "title": "The planner desk and the working day it should create",
        "page": 22
      },
      {
        "title": "Trust, records and the public planning register",
        "page": 23
      },
      {
        "title": "Fast, fair, and built right - all three, or none count",
        "page": 24
      },
      {
        "title": "What good permitting costs, and what bad permitting costs more",
        "page": 25
      },
      {
        "title": "Judgement about place is the job",
        "page": 26
      },
      {
        "title": "When permitting AI fails - and it will be read at appeal",
        "page": 27
      },
      {
        "title": "Build, buy and the discipline of not being captured",
        "page": 28
      },
      {
        "title": "Gates P0-P5 and the 24-month roadmap",
        "page": 29
      },
      {
        "title": "Templates 1-4: fill in, do not improvise",
        "page": 30
      },
      {
        "title": "Templates 5-8 and the assurance checklist",
        "page": 31
      },
      {
        "title": "20 Golden Rules of Permitting, Planning and Land Use AI",
        "page": 32
      }
    ],
    "connects": [
      "data-records",
      "citizen-services",
      "capstone"
    ]
  },
  {
    "id": "tax-revenue",
    "title": "Tax & revenue",
    "sourceTitle": "The Tax, Revenue and Compliance Playbook",
    "volume": 5,
    "subtitle": "Make a public bill reproducible.",
    "theme": "Service delivery",
    "pdf": "/playbooks/ai-government-tax-revenue-playbook.pdf",
    "pages": 32,
    "brief": "A resident’s bill has changed since last year. A draft explanation attributes the increase to a rate change, while the calculation record shows a relief expired. Reconstruct the bill and decide what the service must establish before sending it.",
    "outcomes": [
      "Distinguish a statutory calculation from its explanation.",
      "Connect each adjustment to a source and version.",
      "Review who is selected for checks and why."
    ],
    "lessons": [
      {
        "title": "Run the correct version of the rules",
        "body": "Use the rules engine for rates, bands, reliefs and deadlines. Maintain versions by tax year. Staff reconcile the engine with the governing source and test it against worked cases. The language model can explain the recorded result.",
        "action": "For one relief, locate its effective date, approval record and test case.",
        "page": 10
      },
      {
        "title": "Make each figure explainable",
        "body": "For each material figure, identify the facts used and label their origin. Show how the rate, relief or officer adjustment changes the total. Spell out what changed since the last bill, and give dated options for queries, corrections and objections.",
        "action": "Ask a colleague to reproduce the bill using only the trace and the sources it names.",
        "page": 12
      },
      {
        "title": "Audit how accounts are selected",
        "body": "A risk signal should lead to underlying evidence. An officer selects a case and records why. Use random checks alongside risk-based selection to test what the model misses, and compare both selection and findings by sector, size, channel and group.",
        "action": "Review who bore the cost of unproductive checks alongside what checks found.",
        "page": 15
      }
    ],
    "example": {
      "title": "Explaining an expired relief",
      "body": "In this practice case, a relief applied last year and expired this year. The calculation trace shows the dates and both relief amounts. The officer verifies the account facts and rule version. The new explanation identifies the change, its impact and how to dispute the underlying fact.",
      "page": 12
    },
    "controls": [
      {
        "title": "Stop the escalation sequence for hardship",
        "body": "Send hardship signals to a trained officer. Review affordability and circumstances before a further enforcement step.",
        "page": 17
      },
      {
        "title": "Reconcile the benefits claim",
        "body": "Deduct reversed assessments and their handling costs from claimed yield. Include costs incurred by residents and advisers when evaluating the change.",
        "page": 25
      }
    ],
    "decision": {
      "scenario": "The draft letter and calculation trace disagree about the reason for an increased charge. The batch is ready for issue.",
      "question": "Which action makes the notice defensible?",
      "choices": [
        {
          "text": "Send the trace as an attachment to the existing letter.",
          "feedback": "The resident would receive two incompatible explanations and could act on the wrong one.",
          "correct": false
        },
        {
          "text": "Ask the model for a more confident description of the rate change.",
          "feedback": "Fluency does not resolve whether the account, legal rule or explanation is wrong.",
          "correct": false
        },
        {
          "text": "Hold the affected notice, verify the trace and correct the explanation.",
          "feedback": "The officer checks facts and the applicable rule, resolves the disagreement and gives a transparent correction or objection route.",
          "correct": true
        }
      ],
      "page": 12
    },
    "assignment": {
      "title": "Prepare a calculation trace",
      "steps": [
        "Use a hypothetical bill with a rate, a relief and an adjustment. Label the source and date of each account fact.",
        "Record the rule source, effective version, relief applied and person checking the result.",
        "Write a short notice that explains the change line by line and includes a query route and a dated response deadline."
      ],
      "deliverable": "A calculation trace and a matching resident-facing explanation.",
      "page": 30
    },
    "sources": [
      {
        "title": "The Tax, Revenue and Compliance Playbook",
        "page": 1
      },
      {
        "title": "Tax is the trust contract, collected annually",
        "page": 2
      },
      {
        "title": "Where this volume sits",
        "page": 3
      },
      {
        "title": "The tax gap starts with confusion, not crime",
        "page": 4
      },
      {
        "title": "One taxpayer, one lifecycle, no surprises",
        "page": 5
      },
      {
        "title": "AI pays in explaining, calculating and reminding",
        "page": 6
      },
      {
        "title": "The stop list: decisions AI never makes in revenue",
        "page": 7
      },
      {
        "title": "Ten principles, tested at every gate",
        "page": 8
      },
      {
        "title": "Registration and filing that assume good faith",
        "page": 9
      },
      {
        "title": "Tax rules as code, law as source",
        "page": 10
      },
      {
        "title": "Returns, records and document intelligence",
        "page": 11
      },
      {
        "title": "Explain the assessment: every figure traceable",
        "page": 12
      },
      {
        "title": "Bills, notices and letters officers sign",
        "page": 13
      },
      {
        "title": "Checks that are proportionate, explained and closable",
        "page": 14
      },
      {
        "title": "Risk and case selection without fishing expeditions",
        "page": 15
      },
      {
        "title": "Paying easily, refunding fast, reconciling honestly",
        "page": 16
      },
      {
        "title": "Debt, hardship and time to pay: collect without crushing",
        "page": 17
      },
      {
        "title": "Three populations, three entirely different crafts",
        "page": 18
      },
      {
        "title": "Fraud and evasion: slow powers, high standards",
        "page": 19
      },
      {
        "title": "Objections are the quality system working in public",
        "page": 20
      },
      {
        "title": "Agents, advisers and employers: the compliance supply chain",
        "page": 21
      },
      {
        "title": "One screen, the whole account, time to think",
        "page": 22
      },
      {
        "title": "Confidentiality, secrecy and the public register",
        "page": 23
      },
      {
        "title": "Collected, accurate and fair - or it does not count",
        "page": 24
      },
      {
        "title": "Yield counted honestly, costs counted fully",
        "page": 25
      },
      {
        "title": "Judgement, law and tact: the officer's craft",
        "page": 26
      },
      {
        "title": "When revenue AI fails, people pay for the state's mistake",
        "page": 27
      },
      {
        "title": "Buy components, keep the law and the data in-house",
        "page": 28
      },
      {
        "title": "T0-T5: no revenue use scales without evidence",
        "page": 29
      },
      {
        "title": "Templates 1-4: copy, complete, file with the account or the gate record",
        "page": 30
      },
      {
        "title": "Templates 5-8 and the assurance checklist",
        "page": 31
      },
      {
        "title": "20 Golden Rules for tax, revenue and compliance",
        "page": 32
      }
    ],
    "connects": [
      "data-records",
      "benefits-casework",
      "capstone"
    ]
  },
  {
    "id": "procurement-supplier",
    "title": "Procurement & suppliers",
    "sourceTitle": "The Procurement and Supplier AI Playbook",
    "volume": 6,
    "subtitle": "Buy an AI service the authority can test and exit.",
    "theme": "Governance",
    "pdf": "/playbooks/ai-government-procurement-supplier-playbook.pdf",
    "pages": 32,
    "brief": "Northbridge is procuring a document-reading service. Three suppliers submit strong bids and the evaluation panel is under time pressure. Design how AI can help the panel examine evidence while retaining fair evaluation and a credible exit route.",
    "outcomes": [
      "Sequence bid evaluation to avoid anchoring reviewers.",
      "Check a supplier against the authority’s own cases.",
      "Demonstrate that a service can continue through supplier exit."
    ],
    "lessons": [
      {
        "title": "Score the bid before seeing the summary",
        "body": "Each evaluator reads the original bid and independently records scores against the published criteria. AI then works as a second reader to locate evidence, inconsistent claims and commitments the panel may have missed. Record the reason for each moderation change.",
        "action": "Collect the independent scoring records before distributing an AI comparison.",
        "page": 14
      },
      {
        "title": "Test what will actually be deployed",
        "body": "Evaluate a candidate model on representative local cases and segment by language, place and case type. Check supplier capacity, sub-processors, data rights, security evidence and references. Apply the due diligence checks announced in the tender.",
        "action": "Ask a reference site whether it operates the same version and service described in the bid.",
        "page": 15
      },
      {
        "title": "Test exit during the contract",
        "body": "Maintain the configuration, prompts, evaluation set, dependencies, data formats and transfer runbook. Load a sample export in the receiving environment and price transition support and parallel operation. Identify cases in flight that need uninterrupted service.",
        "action": "Ask someone unfamiliar with the supplier to run the transfer procedure.",
        "page": 23
      }
    ],
    "example": {
      "title": "A model change disguised as an upgrade",
      "body": "In this practice case, a supplier proposes a version update with better benchmark scores. Run the held local evaluation set, assess changes in performance by cohort and record which version served which dates. The contract’s rollback terms become operational if the local test regresses.",
      "page": 22
    },
    "controls": [
      {
        "title": "Protect evaluator independence",
        "body": "Treat AI flags as questions for evidence review. The moderation record identifies the human reason for any change in score.",
        "page": 14
      },
      {
        "title": "Verify portability",
        "body": "A delivered export needs a successful loading test. File the return sample and agreement on deletion, and identify who keeps the service running during transfer.",
        "page": 23
      }
    ],
    "decision": {
      "scenario": "A panel chair proposes sending AI-generated provisional scores before evaluators start. The chair believes it will make moderation quicker.",
      "question": "How should the procurement lead respond?",
      "choices": [
        {
          "text": "Collect independent bid scores first, then issue evidence-linked findings.",
          "feedback": "Independent judgements give moderation a defensible starting point. AI can identify evidence to revisit without assigning the award.",
          "correct": true
        },
        {
          "text": "Send provisional scores anonymously to reduce social pressure.",
          "feedback": "Removing the author still leaves an anchor before anyone has assessed the original evidence.",
          "correct": false
        },
        {
          "text": "Use the generated scores only when evaluators disagree.",
          "feedback": "A tied or disputed award needs the published criteria and documented human reasons. An AI score supplies neither.",
          "correct": false
        }
      ],
      "page": 14
    },
    "assignment": {
      "title": "Rehearse the exit",
      "steps": [
        "List data, configuration, evaluation material, sub-processors and access the receiving team needs.",
        "Define an export format, real loading test, deletion evidence and named owners. Include a parallel-run period.",
        "Record what could interrupt an appointment, payment or open case, how continuity will be demonstrated and who signs the rehearsal."
      ],
      "deliverable": "An exit pack and continuity checklist with a testable acceptance criterion.",
      "page": 31
    },
    "sources": [
      {
        "title": "The Procurement and Supplier AI Playbook",
        "page": 1
      },
      {
        "title": "Procurement is where public values become contracts",
        "page": 2
      },
      {
        "title": "Where this volume sits",
        "page": 3
      },
      {
        "title": "Procurement failure starts before the tender",
        "page": 4
      },
      {
        "title": "One need, one lifecycle, no orphan contracts",
        "page": 5
      },
      {
        "title": "AI pays in drafting, comparing and warning",
        "page": 6
      },
      {
        "title": "The stop list: decisions AI never makes in procurement",
        "page": 7
      },
      {
        "title": "Ten design principles for buying well",
        "page": 8
      },
      {
        "title": "Demand, need and specification",
        "page": 9
      },
      {
        "title": "Market engagement without favour",
        "page": 10
      },
      {
        "title": "Buying AI itself: what makes this purchase different",
        "page": 11
      },
      {
        "title": "Competition design and routes to market",
        "page": 12
      },
      {
        "title": "Tender documents and bid burden",
        "page": 13
      },
      {
        "title": "Evaluation without automation bias",
        "page": 14
      },
      {
        "title": "Due diligence: model, data and supplier evidence",
        "page": 15
      },
      {
        "title": "Contracting for AI: clauses that matter",
        "page": 16
      },
      {
        "title": "Pricing, whole-life cost and value",
        "page": 17
      },
      {
        "title": "Award, standstill, debrief and challenge",
        "page": 18
      },
      {
        "title": "Onboarding, integration and go-live",
        "page": 19
      },
      {
        "title": "Contract management and performance",
        "page": 20
      },
      {
        "title": "Subcontractors, supply chains and resilience",
        "page": 21
      },
      {
        "title": "Change, model updates and version control",
        "page": 22
      },
      {
        "title": "Exit, portability and continuity",
        "page": 23
      },
      {
        "title": "The procurement officer desk, workforce and the working day",
        "page": 24
      },
      {
        "title": "Transparency, conflicts and the public register",
        "page": 25
      },
      {
        "title": "Measurement: value, fairness and market health",
        "page": 26
      },
      {
        "title": "Economics: savings counted honestly",
        "page": 27
      },
      {
        "title": "When procurement AI fails",
        "page": 28
      },
      {
        "title": "Gates R0-R5 and the 24-month roadmap",
        "page": 29
      },
      {
        "title": "Templates 1-4: fill-in instruments",
        "page": 30
      },
      {
        "title": "Templates 5-8 and the assurance checklist",
        "page": 31
      },
      {
        "title": "20 Golden Rules of Procurement and Supplier AI",
        "page": 32
      }
    ],
    "connects": [
      "strategy",
      "data-records",
      "capstone"
    ]
  },
  {
    "id": "emergency-services",
    "title": "Emergency services",
    "sourceTitle": "The Emergency Services and Public Safety Playbook",
    "volume": 7,
    "subtitle": "Preserve human command when seconds count.",
    "theme": "Service delivery",
    "pdf": "/playbooks/ai-government-emergency-services-playbook.pdf",
    "pages": 32,
    "brief": "Two location sources place an incident at opposite entrances to a housing complex. A dispatcher needs the incident record, uncertainty and available corroboration. Examine how an AI-assisted desk prepares that evidence and what happens if the system goes offline.",
    "outcomes": [
      "Show uncertainty in an incident location.",
      "Locate the human decision in the dispatch chain.",
      "Reconcile records after a fallback drill."
    ],
    "lessons": [
      {
        "title": "Keep conflicting location claims visible",
        "body": "Show device accuracy, the address on file and caller-described landmarks as distinct claims. For a large building, an entrance or stairwell can matter more than a street address. Record which claim staff confirmed and how.",
        "action": "Inspect whether the map shows the radius, source and time of the pin.",
        "page": 11
      },
      {
        "title": "Support the call-taker’s judgement",
        "body": "Transcription and prompts help staff listen and capture evidence. Staff can override the protocol sequence and determine the grade. Review samples should pay particular attention to under-triage and whether prompts or transcription contributed.",
        "action": "Trace a grade back to recorded answers and the person who made the judgement.",
        "page": 9
      },
      {
        "title": "Rehearse losing the technology",
        "body": "In the playbook’s control room, the shift commander declares fallback and staff use manual logs and protocol cards. Monthly drills keep those skills current. Recovery reconciles the authoritative record of calls handled during the outage.",
        "action": "Name who declares fallback and who verifies that every manually logged incident is represented on recovery.",
        "page": 25
      }
    ],
    "example": {
      "title": "Returning attention to the call",
      "body": "In the fictional pilot, transcription and a bundle of location claims reduced average time to dispatch-ready from 94 to 61 seconds on the queues tested. That is a preparation measure. The dispatcher still decides whether and what to commit.",
      "page": 8
    },
    "controls": [
      {
        "title": "Reserve dispatch and public warnings for named staff",
        "body": "The playbook reserves dispatch, downgrade and closure decisions for authorised humans. Public warnings also require a named releasing officer.",
        "page": 6
      },
      {
        "title": "Test access and speech differences",
        "body": "Preserve the original alongside translation and flag uncertain words. Review transcription separately for different speech and language groups.",
        "page": 10
      }
    ],
    "decision": {
      "scenario": "A device pin and a caller-described entrance differ. The device has a wide accuracy radius. A proposed display hides the radius to reduce visual clutter.",
      "question": "What evidence should the desk retain and show?",
      "choices": [
        {
          "text": "Display the central point alone until a unit arrives.",
          "feedback": "The centre of a wide radius is still an uncertain claim. Staff would lose information relevant to assessing the mismatch.",
          "correct": false
        },
        {
          "text": "Show the conflicting claims, their uncertainty and the staff confirmation.",
          "feedback": "The bundle lets staff reconcile the location and record the basis for the decision. The dispatcher retains authority.",
          "correct": true
        },
        {
          "text": "Always prefer the address on the account.",
          "feedback": "A registered address may describe the caller’s home rather than the incident site.",
          "correct": false
        }
      ],
      "page": 11
    },
    "assignment": {
      "title": "Conduct a tabletop location review",
      "steps": [
        "Create a fictional incident with a device radius, a registered address and a caller-described landmark.",
        "Record which claim a trained participant would verify, who records confirmation and what information the dispatcher sees.",
        "Simulate system loss in the exercise. Record the manual reference, recovery check and any location-data correction."
      ],
      "deliverable": "A location-claim record and an outage-reconciliation action for the exercise.",
      "page": 28
    },
    "sources": [
      {
        "title": "The Emergency Services and Public Safety Playbook",
        "page": 1
      },
      {
        "title": "In this service, minutes are the currency",
        "page": 2
      },
      {
        "title": "What this volume covers",
        "page": 3
      },
      {
        "title": "The response lifecycle, end to end",
        "page": 4
      },
      {
        "title": "Where AI pays - and where it does not",
        "page": 5
      },
      {
        "title": "The stop list: decisions AI never makes",
        "page": 6
      },
      {
        "title": "Principles for AI at emergency tempo",
        "page": 7
      },
      {
        "title": "Call intake: the first sixty seconds",
        "page": 8
      },
      {
        "title": "Triage support, never triage denial",
        "page": 9
      },
      {
        "title": "Language, accessibility and silent callers",
        "page": 10
      },
      {
        "title": "Location and mapping: the highest-value fix",
        "page": 11
      },
      {
        "title": "Dispatch decision support",
        "page": 12
      },
      {
        "title": "Unit recommendation and routing",
        "page": 13
      },
      {
        "title": "Surge: when the room fills in ten minutes",
        "page": 14
      },
      {
        "title": "Command support in major incidents",
        "page": 15
      },
      {
        "title": "Police, fire and ambulance are not the same problem",
        "page": 16
      },
      {
        "title": "Vulnerability, safeguarding and repeat callers",
        "page": 17
      },
      {
        "title": "Public alerts and warnings people act on",
        "page": 18
      },
      {
        "title": "Misinformation and the public information duty",
        "page": 19
      },
      {
        "title": "Records, redaction and evidence discipline",
        "page": 20
      },
      {
        "title": "The call-taker and dispatcher desk",
        "page": 21
      },
      {
        "title": "Wellbeing: the humans inside the tempo",
        "page": 22
      },
      {
        "title": "Measurement: minutes, accuracy and harm",
        "page": 23
      },
      {
        "title": "Economics: what a saved minute is worth",
        "page": 24
      },
      {
        "title": "Failure, outage and the paper fallback",
        "page": 25
      },
      {
        "title": "Suppliers, interoperability and lock-in",
        "page": 26
      },
      {
        "title": "Gates E0-E5 and the 18-month roadmap",
        "page": 27
      },
      {
        "title": "Fill-in templates: intake to recommendation",
        "page": 28
      },
      {
        "title": "Fill-in templates: warnings to incidents",
        "page": 29
      },
      {
        "title": "Assurance checklist",
        "page": 30
      },
      {
        "title": "Golden rules 1-10",
        "page": 31
      },
      {
        "title": "Golden rules 11-20 - and what comes next",
        "page": 32
      }
    ],
    "connects": [
      "data-records",
      "workforce-trust",
      "capstone"
    ]
  },
  {
    "id": "data-records",
    "title": "Data & records",
    "sourceTitle": "The Data, Records and Interoperability Playbook",
    "volume": 8,
    "subtitle": "Connect records without losing the person behind them.",
    "theme": "Governance",
    "pdf": "/playbooks/ai-government-data-records-playbook.pdf",
    "pages": 32,
    "brief": "Two people with similar names and a shared address appear as a likely match. One service has already reused a fact from another. Work through how Northbridge verifies the proposed link, limits access and repairs a mistake across receiving systems.",
    "outcomes": [
      "Identify the purpose, provenance and freshness of reused data.",
      "Distinguish a proposed link from an authorised match.",
      "Design a correction that reaches downstream records."
    ],
    "lessons": [
      {
        "title": "Show why a fact is being reused",
        "body": "Check that reuse serves an authorised purpose. Show where the fact came from and when it was recorded. Give the resident a way to review and correct it at source, especially when pre-filling a form.",
        "action": "Ask whether an officer could explain the authority for this specific reuse.",
        "page": 12
      },
      {
        "title": "Treat identity linkage as a decision",
        "body": "A probabilistic match is a candidate for review. Keep person, property and case references distinct: people may share an address without sharing identity or ownership. Record how to reverse the link and how receiving systems are notified.",
        "action": "Test a pair of similar names at one address and document what evidence would distinguish them.",
        "page": 10
      },
      {
        "title": "Govern each exchange",
        "body": "Record the data, purpose, basis and human approver. Limit the fields to what the receiver needs, define retention and onward-sharing rules and set an expiry. A technically successful API call proves only that a transfer occurred.",
        "action": "Sample a completed exchange and trace its data fields to the sharing record.",
        "page": 15
      }
    ],
    "example": {
      "title": "A correction that travels",
      "body": "In this practice case, a resident finds another household’s address on a pre-filled form. The steward checks the source, unwinds the wrong link and sends the correction to each service that received it. The resident gets confirmation identifying where the change went.",
      "page": 21
    },
    "controls": [
      {
        "title": "Protect access at retrieval",
        "body": "Search must respect the user’s role and the source permissions. A convenient result page must not expose records its reader cannot open.",
        "page": 19
      },
      {
        "title": "Keep an audit trail for corrections",
        "body": "Make a correction at the source and propagate it with confirmation. Access and changes need attributable, reviewable records.",
        "page": 21
      }
    ],
    "decision": {
      "scenario": "A matching system reports 99% confidence that two names at the same address belong to one person. A merged record would pre-fill benefits and tax forms.",
      "question": "What should the data steward do?",
      "choices": [
        {
          "text": "Merge the records and correct them if someone complains.",
          "feedback": "A wrong merge would spread before either resident had a chance to correct it.",
          "correct": false
        },
        {
          "text": "Use the shared address as proof of identity.",
          "feedback": "The property reference identifies a place. Several people can legitimately share it.",
          "correct": false
        },
        {
          "text": "Queue the proposed link for review and preserve a reversible history.",
          "feedback": "Probability can identify cases for investigation. A human confirms the link, and the record needs a way to undo it across recipients.",
          "correct": true
        }
      ],
      "page": 10
    },
    "assignment": {
      "title": "Draft the exchange record",
      "steps": [
        "Name the dataset, proposed receiving service and purpose. Identify the responsible owner and authority to share.",
        "Limit the fields, state freshness and access rules, specify expiry and define what the receiver does after a correction.",
        "Run the similar-name example through the proposed process and identify the approval and correction evidence you would retain."
      ],
      "deliverable": "A signed sharing-record draft and an end-to-end correction test.",
      "page": 30
    },
    "sources": [
      {
        "title": "The Data, Records and Interoperability Playbook",
        "page": 1
      },
      {
        "title": "Start with the record, not the model",
        "page": 2
      },
      {
        "title": "Fourteen versions of the same resident",
        "page": 3
      },
      {
        "title": "AI earns its place on retrieval, checking and connection",
        "page": 4
      },
      {
        "title": "What AI never does with public records",
        "page": 5
      },
      {
        "title": "Six principles for data the public can trust",
        "page": 6
      },
      {
        "title": "You cannot interoperate what you have not counted",
        "page": 7
      },
      {
        "title": "From creation to disposal, every stage has a control",
        "page": 8
      },
      {
        "title": "Shared meaning is the real interoperability",
        "page": 9
      },
      {
        "title": "One person, one property, one case - carefully",
        "page": 10
      },
      {
        "title": "APIs with owners, contracts and consequences",
        "page": 11
      },
      {
        "title": "Ask once - inside the limits of the law",
        "page": 12
      },
      {
        "title": "Quality is measured at the point of harm",
        "page": 13
      },
      {
        "title": "Findable, understandable, requestable",
        "page": 14
      },
      {
        "title": "Sharing is a decision with a name on it",
        "page": 15
      },
      {
        "title": "Keep what the law and history need - no more",
        "page": 16
      },
      {
        "title": "The record of the record",
        "page": 17
      },
      {
        "title": "Moving records without losing them or their meaning",
        "page": 18
      },
      {
        "title": "Find it in seconds - see only what you may",
        "page": 19
      },
      {
        "title": "Extraction that knows it can be wrong",
        "page": 20
      },
      {
        "title": "Your record, readable, correctable",
        "page": 21
      },
      {
        "title": "Public records the public can actually get",
        "page": 22
      },
      {
        "title": "Every touch leaves a trace that survives scrutiny",
        "page": 23
      },
      {
        "title": "Numbers that show whether the foundation holds",
        "page": 24
      },
      {
        "title": "The foundation pays - count it honestly",
        "page": 25
      },
      {
        "title": "Stewards, archivists and owners are the product",
        "page": 26
      },
      {
        "title": "How record programmes fail, in familiar ways",
        "page": 27
      },
      {
        "title": "Buy platforms that respect the record",
        "page": 28
      },
      {
        "title": "Six gates from inventory to trusted exchange",
        "page": 29
      },
      {
        "title": "Fill-in templates: inventory, sharing, standards, retention",
        "page": 30
      },
      {
        "title": "Fill-in templates: access, interface, migration, correction",
        "page": 31
      },
      {
        "title": "20 golden rules for data, records and interoperability",
        "page": 32
      }
    ],
    "connects": [
      "benefits-casework",
      "permitting-planning",
      "tax-revenue"
    ]
  },
  {
    "id": "workforce-trust",
    "title": "Workforce & trust",
    "sourceTitle": "The Workforce, Ethics and Public Trust Playbook",
    "volume": 9,
    "subtitle": "Give public servants the time and authority to challenge.",
    "theme": "Governance",
    "pdf": "/playbooks/ai-government-workforce-trust-playbook.pdf",
    "pages": 32,
    "brief": "After training, one team overrides more AI outputs than its peers. Managers want to use the override rate as a performance target. Assess what the rise actually reveals and what evidence would help residents and staff trust the response.",
    "outcomes": [
      "Match assessment and sign-off rights to the role.",
      "Distinguish healthy challenge from a service defect.",
      "Give residents and staff a documented role in review."
    ],
    "lessons": [
      {
        "title": "Assess the work people will actually do",
        "body": "Use realistic cases with plausible errors, omissions and stale data. Staff who sign need to show they can check evidence and explain their decision. Build training and coaching time into the working week.",
        "action": "Give a reviewer a convincing but incorrect output and observe how they trace it.",
        "page": 10
      },
      {
        "title": "Protect the override",
        "body": "An officer can set aside an AI output at the desk. Capture the reason in their own words and review patterns for tool, data and training defects. Sample apparent agreements too: near-universal agreement can signal rubber stamping.",
        "action": "Review a sample of accepted outputs alongside the overrides before judging team performance.",
        "page": 11
      },
      {
        "title": "Give public review authority",
        "body": "An ethics board needs independent and resident members, evidence by group, declared conflicts and explicit power to approve, impose conditions, pause or refuse a use. Record dissent and name the owner and due date for each condition.",
        "action": "Publish the decision and show how engagement changed the service or why a proposal was declined.",
        "page": 12
      }
    ],
    "example": {
      "title": "Why the override rate went up",
      "body": "In the fictional benefits team, overrides rose after staff training. Their comments exposed two extraction defects. The rate then fell after the defects were fixed. Looking only at the initial increase would have penalised the behaviour that found the problem.",
      "page": 11
    },
    "controls": [
      {
        "title": "Check whose voice was heard",
        "body": "Engage digitally excluded residents, language minorities and disability groups. Support participation and publish the response where the service disagrees with its panel.",
        "page": 15
      },
      {
        "title": "Keep staff challenge practical",
        "body": "Allow a one-action override and provide time to read and check. Review patterns as evidence about the service rather than ranking individual officers.",
        "page": 11
      }
    ],
    "decision": {
      "scenario": "A team’s override rate doubles immediately after training. Its managers are about to add a low-override target to individual reviews.",
      "question": "What should the service owner do?",
      "choices": [
        {
          "text": "Review override reasons and sample accepted cases before diagnosing the change.",
          "feedback": "The rise could reflect improved checking or a new defect. Reviewing both types of case helps distinguish the explanations and protects justified challenge.",
          "correct": true
        },
        {
          "text": "Require supervisor approval for each override.",
          "feedback": "This adds friction precisely where people need to challenge an output and could hide defects.",
          "correct": false
        },
        {
          "text": "Rank teams by agreement until training beds in.",
          "feedback": "Agreement says little about whether the shared judgement was correct. A ranking can reward uncritical acceptance.",
          "correct": false
        }
      ],
      "page": 11
    },
    "assignment": {
      "title": "Prepare the monthly judgement review",
      "steps": [
        "Describe an illustrative batch of decisions, including accepted outputs and overrides. Sample from both.",
        "Group override reasons, identify a possible tool or data defect, and name the person who will investigate it.",
        "Specify how the team will verify the fix, report any cohort pattern and share the learning without penalising individual staff."
      ],
      "deliverable": "A completed override review with a testable action and due date.",
      "page": 30
    },
    "sources": [
      {
        "title": "The Workforce, Ethics and Public Trust Playbook",
        "page": 1
      },
      {
        "title": "Trust is not a mood. It is a working condition",
        "page": 2
      },
      {
        "title": "Where this volume sits",
        "page": 3
      },
      {
        "title": "Trust is the licence every other volume spends",
        "page": 4
      },
      {
        "title": "Northbridge's 6,200 people, honestly described",
        "page": 5
      },
      {
        "title": "Where AI pays: time returned, judgement deepened, trust evidenced",
        "page": 6
      },
      {
        "title": "Decisions about people that AI never makes",
        "page": 7
      },
      {
        "title": "Ten design principles for people, ethics and trust",
        "page": 8
      },
      {
        "title": "Roles redesigned, not removed - and redesigned with their holders",
        "page": 9
      },
      {
        "title": "AI literacy: the licence to challenge, issued to every role",
        "page": 10
      },
      {
        "title": "Professional judgement and the protected override",
        "page": 11
      },
      {
        "title": "Ethics review that can say no - and sometimes does",
        "page": 12
      },
      {
        "title": "Fairness review: bias found is bias fixed, in public view",
        "page": 13
      },
      {
        "title": "The public account: one register, kept current, written for residents",
        "page": 14
      },
      {
        "title": "Public engagement: ask early, publish what changed",
        "page": 15
      },
      {
        "title": "Explaining AI at the counter, on the phone, at the door",
        "page": 16
      },
      {
        "title": "Complaints, redress and the craft of trust repair",
        "page": 17
      },
      {
        "title": "Wellbeing, workload and the honest pace of change",
        "page": 18
      },
      {
        "title": "Working with staff representatives: early, formal, in writing",
        "page": 19
      },
      {
        "title": "Leadership: named owners, visible decisions, no hiding places",
        "page": 20
      },
      {
        "title": "Leading teams through the change: the manager's week",
        "page": 21
      },
      {
        "title": "Fair hiring and deployment: the employer held to its own standard",
        "page": 22
      },
      {
        "title": "Trust and workforce, measured together, published together",
        "page": 23
      },
      {
        "title": "Trust is cheaper than distrust - and the sums must show it",
        "page": 24
      },
      {
        "title": "Professional standards: the new crafts, accredited",
        "page": 25
      },
      {
        "title": "When trust fails: candour first, repair fast, story last",
        "page": 26
      },
      {
        "title": "Suppliers and the workforce promise: contracts that keep the deal",
        "page": 27
      },
      {
        "title": "Scrutiny in public: audit, media and the chamber are features",
        "page": 28
      },
      {
        "title": "W0-W5: no use scales without people, ethics and trust evidence",
        "page": 29
      },
      {
        "title": "Templates 1-4: copy, complete, file with the gate record",
        "page": 30
      },
      {
        "title": "Templates 5-8 and the assurance checklist",
        "page": 31
      },
      {
        "title": "20 Golden Rules for workforce, ethics and public trust",
        "page": 32
      }
    ],
    "connects": [
      "strategy",
      "emergency-services",
      "capstone"
    ]
  },
  {
    "id": "capstone",
    "title": "Capstone & assurance",
    "sourceTitle": "The Government Capstone and Assurance Playbook",
    "volume": 10,
    "subtitle": "Defend the portfolio through one household’s experience.",
    "theme": "Assurance",
    "pdf": "/playbooks/ai-government-capstone-playbook.pdf",
    "pages": 32,
    "brief": "A household moves to Northbridge and uses benefits, licensing, permitting and tax services. Each service passes its own quality checks, yet two letters to the family disagree. Chair a portfolio review that can reconstruct the problem, repair it and give a truthful account to the public.",
    "outcomes": [
      "Trace a decision across departments and versions.",
      "Run portfolio-level assurance and a pause drill.",
      "Draft a signed statement with residual findings and dates."
    ],
    "lessons": [
      {
        "title": "Build an assurance file someone else can replay",
        "body": "For each material use, assemble purpose, authority, data lineage, applicable rules, evaluation, fairness, staff competence, incidents, supplier changes and retirement plans. Attribute and date entries as events happen. Retain versions so a reviewer can reconstruct the decision as the resident experienced it.",
        "action": "Select a single decision and reproduce its inputs, policy version and human sign-off from the file.",
        "page": 9
      },
      {
        "title": "Test the resident’s whole journey",
        "body": "A household may see several services in one month. Compare their answers to the same underlying facts. Use agreed records and consent where appropriate, trace calculations and give the person one route for a complaint across the journey.",
        "action": "Look for contradictions between two individually plausible outputs and trace them to their sources.",
        "page": 16
      },
      {
        "title": "Move from findings to sign-off",
        "body": "The capstone starts by counting and classifying uses, then assembling evidence and testing the portfolio. At CP4, fix, pause or retire, retest, and give remaining findings owners and dates. At CP5, publish the signed account, register, scorecard and failures log.",
        "action": "State explicitly what evidence allows the use to continue and what event would require a pause.",
        "page": 22
      }
    ],
    "example": {
      "title": "What the first annual review found",
      "body": "In the playbook’s illustrative portfolio of 23 uses, three Tier 2 files lacked fairness results, a Tier 3 service lacked a rehearsed exit, and two services gave different housing answers. A bundled tool was paused, two low-value uses retired, and the signed statement listed five open findings.",
      "page": 28
    },
    "controls": [
      {
        "title": "Test pause authority outside office hours",
        "body": "Name the service owner, accountable officer and independent assurance lead for material uses. Run the drill with a real person who can act and a staffed alternative that can take over.",
        "page": 7
      },
      {
        "title": "Disclose outstanding findings",
        "body": "At sign-off, a material open finding requires a description of risk, a named owner and a closure date. File the evidence behind the statement.",
        "page": 22
      }
    ],
    "decision": {
      "scenario": "The annual review finds that two services issued conflicting housing guidance. Several residents acted on the older answer. The publication date is approaching.",
      "question": "What action should the review board record?",
      "choices": [
        {
          "text": "Publish a clean statement because both services met their local accuracy targets.",
          "feedback": "The local metrics missed a contradiction that affected residents. A clean statement would conceal a material portfolio finding.",
          "correct": false
        },
        {
          "text": "Correct the sources, identify and contact affected residents, retest and disclose outstanding findings.",
          "feedback": "The response repairs individual harm and adds a cross-service consistency check. Any remaining material issue needs a named owner, risk and date.",
          "correct": true
        },
        {
          "text": "Amend the housing webpage and leave historical letters unchanged.",
          "feedback": "A web update does not find or notify people who relied on the conflicting letters. The file needs a record of correction and contact.",
          "correct": false
        }
      ],
      "page": 28
    },
    "assignment": {
      "title": "Prepare the annual assurance statement",
      "steps": [
        "Identify a household journey and list the uses that touched it. Attach evidence from strategy, front door, casework, planning, revenue, procurement, emergency continuity, records and workforce where relevant.",
        "Reconstruct a material decision. Test one cross-service contradiction and a safe fallback. Record corrections, residents affected, owners and independent retest results.",
        "Record the decision for each affected use: continue, restrict, pause or retire. Draft the portfolio statement with the evidence index, open risks, named owners, due dates and next review."
      ],
      "deliverable": "An assurance decision pack and a draft statement the chief executive and accountable officers could sign.",
      "page": 32
    },
    "sources": [
      {
        "title": "The Government Capstone and Assurance Playbook",
        "page": 1
      },
      {
        "title": "One portfolio, one proof - how to use this capstone",
        "page": 2
      },
      {
        "title": "Assurance is the product the public actually receives",
        "page": 3
      },
      {
        "title": "Nine volumes, one Northbridge",
        "page": 4
      },
      {
        "title": "Every use, one register, no shadow AI",
        "page": 5
      },
      {
        "title": "One risk scale and one stop list for the whole portfolio",
        "page": 6
      },
      {
        "title": "Who decides, who signs, who can stop it",
        "page": 7
      },
      {
        "title": "Three lines, one file",
        "page": 8
      },
      {
        "title": "The assurance file: if it is not in the file, it did not happen",
        "page": 9
      },
      {
        "title": "Evaluate the portfolio, not just each model",
        "page": 10
      },
      {
        "title": "Law, rights and public duties at portfolio scale",
        "page": 11
      },
      {
        "title": "The shared foundations get assured once, together",
        "page": 12
      },
      {
        "title": "Suppliers are assured for the life of the contract, not at award",
        "page": 13
      },
      {
        "title": "Competence is an assurance control",
        "page": 14
      },
      {
        "title": "Assure the journey a resident actually takes",
        "page": 15
      },
      {
        "title": "One Northbridge household, every control firing",
        "page": 16
      },
      {
        "title": "Incidents are assured before they happen",
        "page": 17
      },
      {
        "title": "Publish the portfolio, the performance and the failures",
        "page": 18
      },
      {
        "title": "The portfolio scorecard: one page the members actually read",
        "page": 19
      },
      {
        "title": "Whole-life value, and the courage to retire",
        "page": 20
      },
      {
        "title": "The capstone gates: from inventory to annual sign-off",
        "page": 21
      },
      {
        "title": "Remediate, then sign - in that order",
        "page": 22
      },
      {
        "title": "A 12-month capstone roadmap Northbridge can actually run",
        "page": 23
      },
      {
        "title": "Templates that carry the capstone",
        "page": 24
      },
      {
        "title": "Declaring the limits, recording the gate",
        "page": 25
      },
      {
        "title": "Learning in the open, publishing from the file",
        "page": 26
      },
      {
        "title": "Scoring the portfolio, retiring with evidence",
        "page": 27
      },
      {
        "title": "Northbridge capstone review: what the file actually showed",
        "page": 28
      },
      {
        "title": "Capstone failure modes to refuse",
        "page": 29
      },
      {
        "title": "Capstone assurance checklist",
        "page": 30
      },
      {
        "title": "20 golden rules for government AI assurance",
        "page": 31
      },
      {
        "title": "The annual statement, and what Northbridge signs",
        "page": 32
      }
    ],
    "connects": [
      "strategy",
      "data-records",
      "workforce-trust"
    ]
  }
];
