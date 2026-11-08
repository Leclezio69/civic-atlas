export default {
  id: 'benefits-casework',
  title: 'Two payslips, one pay packet',
  brief: 'An income check has doubled Dani Reed’s weekly wages and drafted a $92 recovery from her next housing-support payment. Decide what can go into the payment file and what the service still needs to prove.',
  deadline: 'Monday 15:45 · signed payment-file instruction',
  role: 'Benefits duty manager',
  imagePage: 8,
  openingTime: 'Monday 13:00',
  updateTime: 'Monday 14:20',
  openingQuestion: 'What will you do while the two wage entries are being checked?',
  initial: [
    {
      id: 'ringfence',
      label: 'Remove the draft recovery from the posting queue and retain the evidence.',
      effect: 'Payments marks the draft as held. Dani’s current award will go into the file unless her caseworker signs a different instruction.'
    },
    {
      id: 'quality',
      label: 'Send the calculation for a second check and leave its queue status unchanged.',
      effect: 'A checker confirms the addition is correct. The recovery still sits in the sign-off queue because the check did not establish whether the two entries belong together.'
    },
    {
      id: 'request',
      label: 'Ask Dani for both payslips and a statement before changing the queue.',
      effect: 'Dani can provide one payslip. She asks why she must submit it again when she already authorised the city to check payroll. The draft still awaits a posting instruction.'
    }
  ],
  opening: [
    {
      id: 'B01', title: 'Draft recovery calculation', owner: 'Helena Ward, deciding caseworker', time: 'Monday 12:35',
      body: 'Case HS-208 was assessed using gross wages of $410 for the week ending Friday 9 October. The matching tool found two payroll events at $410 each, used $820 for that week and drafted a $92 recovery. Its summary calls this a second payment. Helena has not signed it.',
      limit: 'The arithmetic adds the two event values. The summary supplies no payment reference or evidence that both events should count.'
    },
    {
      id: 'B02', title: 'Dani’s phone account', owner: 'Luca Ames, resident contact officer', time: 'Monday 12:48',
      body: 'Dani recalls one payment for that week. Her supervisor had corrected the cost centre on a payslip. She cannot access the employer portal during her shift. Dani authorised a direct payroll check, requested a phone call after 17:00 and a paper decision. She can challenge a decision by telephone.',
      limit: 'Dani describes a plausible explanation. She cannot verify the employer’s gross-pay ledger herself.'
    },
    {
      id: 'B03', title: 'Payment-file instruction and duty rota', owner: 'Priya Moss, benefits duty manager', time: 'Monday 12:55',
      body: 'For this Northbridge exercise, disputed recoveries stay out of the payment file until a deciding officer verifies the pay period, records the reason and signs. The existing award continues during verification. Helena decides HS-208. Priya can pause the importer, and Asha Bell handles fresh reconsiderations. Instructions are due at 15:45 and the file seals at 16:00. Priya reviews unresolved cases at 10:00 Tuesday.',
      limit: 'The rota establishes authority and deadlines. It contains no evidence about Dani’s earnings.'
    }
  ],
  update: {
    id: 'B04', title: 'Event-history extract', owner: 'Sai Kwan, payroll liaison', time: 'Monday 14:20',
    body: 'The employer feed shows the same worker, pay period and $410 gross amount in both events. Event 721 arrived at 08:12 and event 739 at 08:19. The second envelope says “amendment”. The city’s import view hides the field that identifies which earlier entry it changes.',
    limit: 'The amendment label makes the two-payment inference unsafe. This extract cannot establish which entry was settled or how the importer handles other people’s amendments.'
  },
  enquiryQuestion: 'One specialist can return a signed result before the file closes. Which question do you put to them?',
  enquiries: [
    {
      id: 'payroll', label: 'Reconcile Dani’s two event IDs against the employer’s signed payroll register.',
      record: {
        id: 'B05', title: 'Employer reconciliation', owner: 'Nora Finch, employer payroll controller', time: 'Monday 15:05',
        body: 'Nora matches both events to payroll reference W19 for the week ending 9 October. Event 739 replaced 721 to correct a cost centre. The signed register shows one gross entitlement of $410 and one settlement. Helena’s original assessment already used $410.',
        limit: 'This settles the earnings question for HS-208. It does not identify the software behaviour or establish how many other cases were affected.'
      }
    },
    {
      id: 'replay', label: 'Replay the importer using an amendment pair and a genuine two-payment control.',
      record: {
        id: 'B06', title: 'Controlled import replay', owner: 'Evan Liu, assurance analyst', time: 'Monday 15:10',
        body: 'On importer build 2.6, a fixture with one $410 wage and a replacement event produces $820. A separate fixture with two genuine $410 payments correctly produces $820. Evan can reproduce the error on amendment pairs. The case-specific settlement register is still with the employer.',
        limit: 'The replay proves a repeatable defect on this build. Its synthetic data cannot establish Dani’s actual gross pay or how many production awards need correction.'
      }
    }
  ],
  decisionQuestion: 'Which instruction will you give before the payment file is sealed?',
  actions: [
    {
      id: 'withdraw', label: 'Have Helena withdraw the $92 draft and confirm Dani’s existing award.',
      points: 30, requiresEnquiry: 'payroll',
      feedback: 'The signed register ties the two events to one $410 wage. The original assessment used that amount, so Helena can sign a case-specific correction.',
      effect: 'Dani receives her existing award. Helena adds the employer’s reconciliation to HS-208, and Priya opens a separate defect enquiry.',
      missingFeedback: 'The synthetic replay cannot establish Dani’s actual pay. The employer’s case-specific settlement evidence is still outstanding.',
      missingEffect: 'The payment is protected, but Helena would close the income question using evidence from a test fixture.'
    },
    {
      id: 'isolate', label: 'Pause automated summing of amendment pairs, protect Dani’s payment and keep her earnings review open.',
      points: 30, requiresEnquiry: 'replay',
      feedback: 'The controlled replay supports a targeted pause on build 2.6. The individual case stays open until an officer verifies the employer’s original records.',
      effect: 'Priya diverts amendment pairs to manual checking and identifies affected assessments. Dani receives the current award and Helena owns the outstanding payroll verification.',
      missingFeedback: 'The employer’s register settles Dani’s case. It does not show that build 2.6 reproduced the defect on a controlled input.',
      missingEffect: 'Dani’s recovery stays off the file, but the change to the importer lacks a reproducible test and her verified case remains open.'
    },
    {
      id: 'manual', label: 'Hold this recovery for manual verification and assign a Tuesday review without a wider instruction.',
      points: 18,
      feedback: 'The hold protects the payment. Use the signed return to resolve the individual case or contain the reproduced defect, whichever the investigation supports.',
      effect: 'Dani receives the current award. The case remains on Tuesday’s queue and the importer continues processing other amendment pairs.'
    },
    {
      id: 'post', label: 'Post the $92 recovery and refund it if Dani supplies stronger evidence.',
      points: 0, block: 'The instruction would reduce a payment using disputed, unsigned evidence.',
      feedback: 'The matching tool counted events. Recovery requires a verified assessment and an officer’s signed decision under the exercise rules.',
      effect: 'The next payment file would deduct $92 before the service could justify that deduction to Dani.'
    }
  ],
  claims: [
    {label: 'Which record first establishes that the second incoming event was labelled an amendment?', expected: 'B04'},
    {label: 'Which signed return supports the finding from the investigation you commissioned?', expected: 'return'}
  ],
  controls: [
    {
      key: 'owner', label: 'Who owns the decision on HS-208 and a subsequent reconsideration?', weight: 15, page: 21,
      options: [
        {id: 'pair', label: 'Helena signs the individual decision. Asha handles a fresh reconsideration.', points: 15, feedback: 'The roster gives Helena case authority and Asha an independent review role.'},
        {id: 'same', label: 'Helena signs the decision and decides any reconsideration herself.', points: 7, feedback: 'Helena can sign the original case. A different officer must hear a challenge.', block: 'A fresh officer is missing from the reconsideration route.'},
        {id: 'vendor', label: 'The supplier signs the calculation and Payments decides any challenge.', points: 0, feedback: 'Neither party holds the case or reconsideration authority in B03.', block: 'The recovery decision lacks an authorised caseworker.'}
      ]
    },
    {
      key: 'safeguard', label: 'How do you protect the payment and make the decision usable for Dani?', weight: 20, page: 21,
      options: [
        {id: 'portal', label: 'Protect the payment and explain the result through the employer portal.', points: 7, feedback: 'Dani’s payment is protected, but an employer portal is an unsuitable route for a city decision and a challenge.', block: 'The resident has no usable city review route in this instruction.'},
        {id: 'file', label: 'Hold the recovery and leave a case note for the next officer.', points: 9, feedback: 'The internal hold prevents a deduction. Dani still needs the decision, its reasons and a way to challenge it.', block: 'An internal note leaves Dani without notice or a route to review.'},
        {id: 'callback', label: 'Exclude the draft from the 16:00 file. Call after 17:00, post reasons and explain telephone review.', points: 20, feedback: 'The instruction protects the current payment and provides the contact, written reasons and review channel Dani can use.'}
      ]
    },
    {
      key: 'retest', label: 'What should Priya require at Tuesday’s 10:00 review?', weight: 15, page: 27,
      options: [
        {id: 'monitor', label: 'Check whether the total number of recovery drafts has returned to normal.', points: 4, feedback: 'A normal total can conceal errors for workers whose employers send amendments.'},
        {id: 'paired', label: 'Check amendments and genuine second payments against originals, trace resulting awards and assign any corrections before sign-off.', points: 15, feedback: 'The paired checks catch double counting as well as accidental deletion of real second wages. Tracing awards exposes downstream harm.'},
        {id: 'sample', label: 'Check a sample of amended gross amounts and close the review if they match.', points: 8, feedback: 'This tests amended amounts. Genuine second payments and any previously affected awards remain outside the check.'}
      ]
    }
  ],
  pages: {decision: 7, evidence: 12},
  coach: {
    decision: 'What can your signed return establish about Dani personally, and what can it establish about build 2.6?',
    evidence: 'Which record describes an incoming event, and which return verifies settlement or reproduces a calculation?',
    owner: 'If Dani challenges the signed decision, which officer on the roster can give her a fresh hearing?',
    safeguard: 'How will Dani know before her next shift what she will receive, why, and how to challenge the outcome?',
    retest: 'Could a fix that suppresses every second $410 entry erase a genuine second payment?',
    passed: 'If an earlier deduction has already reached another resident, how will Priya find the person and trace the correction all the way to payment?'
  }
};
