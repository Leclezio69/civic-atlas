export default {
  id: 'permitting-planning',
  title: 'The Mill Lane boundary',
  brief: 'Mill Lane Cycling Club has booked a crew to install a covered cycle rack, and its application appears to clear the service corridor by 18 centimetres. Decide what the planning officer can put in the afternoon decision pack when the underlying map changes.',
  deadline: '15:30 decision pack · applicant update by 16:00',
  role: 'Duty planning manager',
  imagePage: 12,
  openingTime: 'Friday · 09:15',
  updateTime: 'Friday · 13:10',
  openingQuestion: 'What instruction will you give the case team this morning?',
  initial: [
    {
      id: 'prepare',
      label: 'Prepare the officer report using the recorded clearance.',
      effect: 'The draft is ready early. Its clearance paragraph now depends on the exact map and drawing referenced in the morning check.'
    },
    {
      id: 'compare',
      label: 'Have a planner compare the extracted footing with the submitted drawing.',
      effect: 'The planner confirms that the checker selected the outer footing on drawing D7. That verification covers the drawing side of the measurement.'
    },
    {
      id: 'reserve',
      label: 'Reserve a manual review slot and tell the club when it will hear back.',
      effect: 'The club keeps its place in the queue and has a named contact. The review slot remains available if new evidence changes the measurement.'
    }
  ],
  opening: [
    {
      id: 'P01',
      title: 'Officer delegation and dispatch sheet',
      owner: 'Jo Ames · duty planning manager',
      time: 'Friday · 08:45',
      body: 'For this fictional application, P-218, registered instruction MC-4 sets a minimum 2.00 m between the outer footing and the current recorded service corridor. Delegated planning officer Leena Park owns the assessment, reasons and signature. Unsigned items stay off the 15:30 dispatch. The club requested a phone update by 16:00. A disputed record goes to a fresh reviewer at the planning desk.',
      limit: 'A place in the dispatch pack gives the club a timetable. Only Leena’s signed decision authorises the outcome.'
    },
    {
      id: 'P02',
      title: 'Morning clearance report',
      owner: 'Ellis Rowe · planning technician',
      time: 'Friday · 09:05',
      body: 'The checker placed the outer footing from drawing D7 against corridor layer M2. It measured 2.18 m against MC-4 and prepared a passing paragraph for Leena. The report identifies the drawing, layer and time of the check.',
      limit: 'The result applies to D7 against M2. The automated check covers one dimensional standard.'
    }
  ],
  update: {
    id: 'P03',
    title: 'Corridor register correction',
    owner: 'Imani Shah · spatial records steward',
    time: 'Friday · 13:10',
    body: 'Imani confirms that adopted layer M3 took effect at 08:00, before the morning run. A cache still served M2 to the checker. A provisional overlay places the footing 1.92 m from the M3 line with an estimated uncertainty of ±0.15 m. MC-4 and drawing D7 are unchanged. The steward can isolate the affected check while other planning work continues.',
    limit: 'The possible range crosses 2.00 m. This overlay establishes that the earlier pass needs review. It cannot settle clearance for this application.'
  },
  enquiryQuestion: 'Which return do you need first for the afternoon review?',
  enquiries: [
    {
      id: 'survey',
      label: 'Commission a checked survey overlay for P-218.',
      record: {
        id: 'P04',
        title: 'Surveyor’s verified overlay',
        owner: 'Mei Torres · council surveyor',
        time: 'Friday · 14:20',
        body: 'Mei reconciles D7 and the registered M3 line to the same survey datum and confirms the footing location against site control points. The minimum separation is 2.06 m ±0.02 m. She signs the measured overlay and files both layers with the case.',
        limit: 'Even the lower bound clears 2.00 m. The survey resolves the dimensional check for P-218 only. Leena still owns the planning judgement.'
      }
    },
    {
      id: 'audit',
      label: 'Trace the stale layer across the live permit queue.',
      record: {
        id: 'P05',
        title: 'Affected-file and dispatch trace',
        owner: 'Ellis Rowe · planning technician',
        time: 'Friday · 14:20',
        body: 'A replay of access logs identifies six live files, including P-218, that read M2 after 08:00. Ellis matches each to an unsigned draft and assigns each file to the manual review rota. No signed notice drew on one of those six runs. A registered survey comparison for P-218 can be obtained on Monday morning.',
        limit: 'The trace identifies which files need action. It supplies no new measurement of the Mill Lane footing.'
      }
    }
  ],
  decisionQuestion: 'What can you authorise for the 15:30 pack?',
  actions: [
    {
      id: 'record-clearance',
      label: 'Record a qualified manual clearance for P-218 and send the file to Leena for the remaining assessment.',
      points: 30,
      requiresEnquiry: 'survey',
      feedback: 'The signed overlay resolves MC-4 within the stated tolerance. The instruction gives Leena a verified input and preserves her discretion over the permit.',
      effect: 'Leena receives the signed geometric finding for the afternoon review. Other M2-dependent checks stay isolated.',
      missingFeedback: 'A list of affected files cannot establish the footing distance. The surveyor’s signed overlay is needed for a clearance finding.',
      missingEffect: 'The report would record a passing measurement with no verified survey behind it.'
    },
    {
      id: 'route-six',
      label: 'Withdraw the six identified draft checks, activate their manual review rota and schedule the Mill Lane survey.',
      points: 30,
      requiresEnquiry: 'audit',
      feedback: 'The dispatch trace supports the six-file scope. P-218 remains open for a measured assessment on Monday.',
      effect: 'Six unsigned drafts are intercepted. Each has an assigned reviewer, and the club receives a dated next step while its application remains open.',
      missingFeedback: 'The survey establishes a measurement for one site. You still need the dispatch trace to identify six files and their owners.',
      missingEffect: 'The instruction would claim a six-file review without an evidenced list or an assigned rota.'
    },
    {
      id: 'manual-review',
      label: 'Suspend the affected automated check and send P-218 to the manual route with a named review time.',
      points: 30,
      feedback: 'The stale map is established on both routes. A bounded manual review protects the file while the officer checks the available evidence and the steward establishes the wider impact.',
      effect: 'P-218 stays active, with the stale result excluded from the pack. Other planning checks continue, and the manager can trace outstanding files separately.'
    },
    {
      id: 'refuse',
      label: 'Send the club a refusal citing the afternoon 1.92 m overlay.',
      points: 0,
      feedback: 'The stated uncertainty spans both sides of the threshold. The measurement cannot support a refusal, and the duty manager cannot issue Leena’s decision.',
      effect: 'A draft refusal reaches dispatch with an unresolved measurement and no delegated signature.',
      block: 'An uncertain overlay cannot establish a setback breach or support an unsigned refusal.'
    }
  ],
  claims: [
    {label: 'Which record establishes that the morning check used a superseded corridor layer?', expected: 'P03'},
    {label: 'Which return supports the scope of the intervention you investigated?', expected: 'return'}
  ],
  controls: [
    {
      key: 'owner',
      label: 'Who owns the permit decision after the map discrepancy is resolved?',
      weight: 15,
      page: 18,
      options: [
        {id:'technician',label:'Ellis Rowe, who can confirm which check entered the draft.',points:0,feedback:'Ellis can reconstruct and correct the case record. P01 delegates the permit decision to Leena.',block:'The proposed permit signer lacks the case delegation.'},
        {id:'planner',label:'Leena Park, with her reasoning and signature linked to the case file.',points:15,feedback:'P01 names the delegated officer. Her signed reasons can be matched to the evidence relied on.'},
        {id:'manager',label:'Jo Ames, who manages the deadline and manual rota.',points:0,feedback:'Jo controls dispatch and the review rota. P01 gives Leena the decision signature.',block:'A dispatch manager cannot substitute for the delegated deciding officer.'}
      ]
    },
    {
      key: 'safeguard',
      label: 'How will you protect the club’s place and make review usable?',
      weight: 20,
      page: 20,
      options: [
        {id:'portal',label:'Retain the file date and post a status entry on the public register.',points:8,feedback:'The intake date and record are preserved. The requested callback, next action and fresh-review contact are still missing.'},
        {id:'resubmit',label:'Ask the club to withdraw and submit a new plan after the map is repaired.',points:0,feedback:'The authority supplied the stale layer. Requiring a new submission moves the delay and loss of queue position to the club.',block:'The applicant would lose its filing position because of the authority’s data error.'},
        {id:'contact',label:'Keep the original filing date. Phone by 16:00 with the finding, next review time and fresh-review contact, then record the call.',points:20,feedback:'This preserves the original file and gives the club a usable way to challenge the disputed measurement.'}
      ]
    },
    {
      key: 'retest',
      label: 'What evidence lets the steward restore the automated MC-4 check?',
      weight: 15,
      page: 27,
      options: [
        {id:'boundary-tests',label:'Verify that live lookups use M3, replay affected files and test measurements on both sides of 2.00 m, including an uncertain result for planner review.',points:15,feedback:'The recovery test covers source currency, the affected population and the decision boundary that failed.'},
        {id:'sample',label:'Show M3 in the live lookup and obtain one clear passing result.',points:6,feedback:'This tests the lookup and one positive case. A below-threshold case, uncertain measurements and the earlier affected files still need review.'},
        {id:'survey-only',label:'Use a clearance signed for one application to release the shared checker.',points:0,feedback:'A survey can resolve one application while the shared checker is still reading the wrong layer.',block:'A single-site measurement supplies no evidence that the shared check has recovered.'}
      ]
    }
  ],
  pages: {decision: 10, evidence: 13},
  coach: {
    decision: 'Which part of P-218 can the evidence settle today, and which part still needs the planner?',
    evidence: 'Which record proves a change in the authoritative layer, and which establishes the scope of your follow-up?',
    owner: 'Whose name appears on the delegation, and whose name belongs on the technical correction?',
    safeguard: 'If the club disputes the measurement at 16:00, whom can it reach without losing its place?',
    retest: 'What would a live replay show for a clear pass, a clear breach and an uncertainty band that crosses 2.00 m?',
    passed: 'If you discover a signed notice from an earlier M2 run tomorrow, who should review the affected decision and contact the parties?'
  }
};
