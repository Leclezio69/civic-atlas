export default {
  id: 'procurement-supplier',
  title: 'The model behind the signature',
  brief: 'Northbridge has accepted a supplier’s assistant for drafting housing repair callbacks. The supplier is about to switch the model behind the service endpoint, hours before the first live shift.',
  deadline: 'Friday 15:00 · sign the first-shift release instruction',
  role: 'Commercial lead at the service release board',
  imagePage: 20,
  openingTime: 'Friday · 09:00',
  updateTime: 'Friday · 13:10',
  openingQuestion: 'What instruction do you give the mobilisation team while it prepares the first shift?',
  initial: [
    {id:'schedule', label:'Reserve the 15:00 launch slot on the signed acceptance.', effect:'The contact centre has reserved the slot. Six advisers expect the tool at 15:00 and will need a revised shift instruction if release conditions change.'},
    {id:'verify', label:'Make deployment conditional on a last check of the served version.', effect:'The release engineer has retained the accepted configuration and added a version check to the deployment checklist. Live traffic remains disconnected.'},
    {id:'manual', label:'Keep the Friday shift on manual drafting pending a board decision.', effect:'The manual rota is active. The team has reserved capacity for Friday’s callbacks and can use the supplier endpoint only after the board issues a new instruction.'}
  ],
  opening: [
    {id:'P01',title:'Signed change schedule',owner:'Eve Rahman · commercial lead',time:'Contract file · 6 March',body:'Schedule 4 requires advance notice for a model change, a city-run regression test and service-owner approval. If the agreed floor fails, the city may hold the release, continue a verified earlier version, or invoke a priced assisted transition after a successful handover rehearsal. The supplier must preserve version and audit records.',limit:'The contract establishes these rights. Exercising a pin or transferring a live queue still requires operational proof.'},
    {id:'P02',title:'Acceptance certificate for version 3.6',owner:'Jon Reed · independent assurance lead',time:'Thursday · 16:20',body:'Jon ran the city’s 48 held callback cases on version 3.6 with prompt H12. All 48 retained the resident’s agreed contact method, including eight interpreter bookings. The floor is zero lost arrangements. The certificate covers this version and prompt for officer-reviewed drafts only.',limit:'The certificate identifies one model and prompt configuration. A matching endpoint name alone cannot extend acceptance to a replacement model.'},
    {id:'P03',title:'First-shift continuity sheet',owner:'Lena Ortiz · housing repairs service owner',time:'Friday · 08:40',body:'Lena holds delegated release and pause authority. Eve issues contract notices and Jon signs test evidence. Today’s 24 callbacks fit a staffed manual shift with capacity for 30. At 15:00 the duty supervisor must reconcile every open job, its contact preference and its named adviser. Advisers approve every outbound draft. Lena reviews the queue and any temporary arrangement at 17:00.',limit:'The rota covers today’s shift. A permanent transfer needs a successful export, import and reconciliation of the live queue.'}
  ],
  update: {id:'P04', title:'Version change and failed replay',owner:'Jon Reed · independent assurance lead',time:'Friday · 13:10',body:'The supplier confirms that the release endpoint now serves version 3.7 with prompt H12. Jon reruns the same 48 held cases against that configuration. Three of the eight interpreter bookings lose the requested language arrangement. All 48 drafts still look complete to the supplier’s format checker. No live resident messages have been sent.',limit:'The replay establishes a material failure against the contractual floor. It says nothing about whether 3.6 can still be pinned or whether an exit can be executed today.'},
  enquiryQuestion:'There is time for one witnessed rehearsal before 15:00. Which option do you investigate?',
  enquiries:[
    {id:'pin',label:'Test a time-limited pin to the accepted model.',record:{id:'P05',title:'Pinned endpoint rehearsal',owner:'Jon Reed · witnessed by release engineering',time:'Friday · 14:20',body:'Engineering isolated a separate endpoint, pinned model 3.6 and prompt H12, and disabled automatic substitution. Jon inspected the served version and replayed all 48 cases through the release configuration. Every agreed arrangement survived. A forced version mismatch stopped drafting and routed the job to its adviser. The pin expires at 17:00.',limit:'The evidence supports officer-reviewed use on this endpoint until 17:00. Neither 3.7 nor the exit transfer was cleared by this rehearsal.'}},
    {id:'exit',label:'Rehearse an assisted transfer into the city’s work queue.',record:{id:'P06',title:'Witnessed exit and queue reconciliation',owner:'Lena Ortiz · witnessed by records operations',time:'Friday · 14:20',body:'The supplier exported the open jobs, contact preferences, version logs and draft history under Schedule 4. The city imported the package into its isolated work queue. All 24 job IDs, due times and contact arrangements reconciled against the source. The transition team confirmed staffed cover through handover and a repeat reconciliation at cutover.',limit:'The rehearsal supports invoking the assisted transition with the live cutover check. It provides no assurance that an older model can be pinned in production.'}}
  ],
  decisionQuestion:'What release or contract instruction will you put to Lena at 15:00?',
  actions:[
    {id:'hold',label:'Hold all AI drafting and call for a supplier correction.',points:30,feedback:'The failed floor activates the change hold. The staffed manual shift keeps the service running while the supplier cures the defect.',effect:'The supplier endpoint stays disconnected. Advisers draft the 24 callbacks manually, and the commercial team opens a correction notice.'},
    {id:'limited',label:'Permit the verified 3.6 endpoint until the pin expires.',points:30,requiresEnquiry:'pin',feedback:'The bounded release matches the accepted version, witnessed replay and tested stop control. The time limit is enforceable.',effect:'Advisers can review drafts from the pinned endpoint through 17:00. A version mismatch stops drafting and returns the job to its adviser.',missingFeedback:'The file contains no witnessed test of the 3.6 pin or its mismatch stop. The earlier certificate cannot establish the endpoint still serves that configuration.',missingEffect:'The release team cannot verify the proposed pin. The board returns the instruction and the staffed manual shift must cover the gap.'},
    {id:'transfer',label:'Invoke assisted transition with a reconciled live handover.',points:30,requiresEnquiry:'exit',feedback:'Schedule 4 permits the transition. The witnessed import and named roster support cutover with a final reconciliation.',effect:'The city can start the priced transfer, retain the audit trail and reconcile the live jobs before taking over the queue.',missingFeedback:'The contract grants an exit right, but the file contains no successful import or queue reconciliation. A contractual right alone does not clear live cutover.',missingEffect:'The handover lacks a verified receiving queue. The board withholds cutover until the city can account for every open callback.'},
    {id:'release',label:'Release 3.7 now with a first-day exception review.',points:0,feedback:'Three lost interpreter arrangements breach the agreed floor. Reviewing exceptions after release relies on a format checker that passed all three failures.',effect:'Drafts with missing interpreter arrangements can reach advisers looking at apparently complete callbacks.',block:'Version 3.7 failed the contractual floor and has no release approval.'}
  ],
  claims:[
    {label:'Which exhibit establishes what the changed configuration did to interpreter arrangements?',expected:'P04'},
    {label:'Which exhibit proves the operational option your team rehearsed before the board met?',expected:'return'}
  ],
  controls:[
    {key:'owner',label:'Who authorises the operating boundary and records the supplier action?',weight:15,page:19,options:[
      {id:'service',label:'Lena signs the release boundary. Eve records the contract instruction.',points:15,feedback:'The delegated service owner accepts the operating risk and the commercial lead preserves the contractual record.'},
      {id:'assurance',label:'Jon signs the release after certifying the replay. Eve informs Lena.',points:4,feedback:'Jon can certify the technical evidence. The continuity sheet reserves the service decision for Lena.',block:'The officer with delegated release authority has not signed the instruction.'},
      {id:'supplier',label:'The supplier’s release lead approves the endpoint and sends the city its logs.',points:0,feedback:'Supplier logs can identify a version. The supplier has no authority to accept Northbridge’s service risk.',block:'The supplier would be approving its own city release.'}
    ]},
    {key:'safeguard',label:'How will the shift protect the callbacks already promised?',weight:20,page:23,options:[
      {id:'reconcile',label:'At 15:00 reconcile all 24 jobs, contact arrangements and adviser assignments. Require officer approval before sending.',points:20,feedback:'Every open job stays attached to a person, a contact arrangement and an adviser who can correct a draft.'},
      {id:'sample',label:'Allocate all 24 jobs, check interpreter bookings and have advisers approve every draft.',points:12,feedback:'This protects known interpreter requests and keeps officers in control. It misses verification of other contact preferences across the handover.'},
      {id:'receipt',label:'Use the supplier’s 24-row receipt to close the handover and investigate exceptions tomorrow.',points:0,feedback:'Matching a record count does not show that contact arrangements or adviser ownership survived the handover.',block:'No verified owner or usable contact arrangement is established for each open callback.'}
    ]},
    {key:'retest',label:'What will Lena require at the next release review?',weight:15,page:22,options:[
      {id:'held',label:'Review capacity at 17:00. Before any new live configuration, replay all 48 held cases, verify served version and require zero lost arrangements.',points:15,feedback:'The control covers the exact release configuration, the contracted floor and the end of the temporary operating window.'},
      {id:'subset',label:'Review the queue at 17:00 and rerun the three failures before scheduling the full acceptance set.',points:8,feedback:'The three cases provide useful early evidence. The regression floor covers the full held set before a new configuration can go live.'},
      {id:'format',label:'Release the replacement once the supplier’s format checker passes and review contact failures at month end.',points:0,feedback:'The format checker already passed the faulty drafts. This condition cannot detect the defect that stopped release.',block:'A new live release could pass without independent regression evidence.'}
    ]}
  ],
  pages:{decision:22,evidence:16},
  coach:{
    decision:'Which live configuration or receiving queue can your signed rehearsal actually support at 15:00?',
    evidence:'Which record observed the lost arrangement, and which one tested your proposed route out of the problem?',
    owner:'Who can accept a service interruption, and who can turn that instruction into a contract notice?',
    safeguard:'How would the supervisor find one missed interpreter booking if the total stayed at 24?',
    retest:'Would the evidence you require catch the three failures that passed the supplier’s format checker?',
    passed:'If the 17:00 queue reaches 31 open jobs, who must act before the temporary capacity runs out?'
  }
};
