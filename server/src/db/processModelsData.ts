export interface ProcessModelDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  target_tat_minutes: number;
  official_graph: {
    nodes: Array<{ id: string; label: string; department: string; expected_role: string; is_required: boolean }>;
    edges: Array<{ source: string; target: string; is_required: boolean; description?: string }>;
  };
  metadata: Record<string, any>;
  conformance_rules: Array<{
    id: string;
    rule_name: string;
    rule_type: 'ORDERING' | 'MANDATORY_ACTIVITY' | 'CHANNEL_COMPLIANCE' | 'ROLE_AUTHORIZATION' | 'EFFICIENCY';
    source_activity?: string;
    target_activity?: string;
    severity: 'CRITICAL_SAFETY' | 'WARNING' | 'EFFICIENCY';
    description: string;
  }>;
}

export const PROCESS_MODELS_DATA: ProcessModelDefinition[] = [
  {
    id: 'W1_ADMISSION_PREOP',
    name: 'Patient Admission & Pre-Op Registration',
    category: 'Admission',
    description: 'Official SOP for patient reception, initial triage, insurance verification, admission registration, and ward bed transfer.',
    target_tat_minutes: 45,
    official_graph: {
      nodes: [
        { id: 'Patient Arrival', label: 'Patient Arrival & Reception', department: 'Front Desk', expected_role: 'Front Desk', is_required: true },
        { id: 'Triage Assessment', label: 'Triage & Vital Signs Check', department: 'Front Desk', expected_role: 'Ward Nurse', is_required: true },
        { id: 'Insurance Verification', label: 'Insurance Desk Pre-Check', department: 'Billing Desk', expected_role: 'Billing Executive', is_required: true },
        { id: 'Admission Order Signed', label: 'Admission Order Signed', department: 'Front Desk', expected_role: 'Surgeon', is_required: true },
        { id: 'EMR Demographics Entry', label: 'EMR Demographics & ID Creation', department: 'Front Desk', expected_role: 'Front Desk', is_required: true },
        { id: 'Bed Allocation', label: 'Ward Bed Allocated', department: 'Inpatient Ward', expected_role: 'Ward Nurse', is_required: true },
        { id: 'Ward Arrival', label: 'Patient Shifted to Pre-Op Bed', department: 'Inpatient Ward', expected_role: 'Ward Boy', is_required: true }
      ],
      edges: [
        { source: 'Patient Arrival', target: 'Triage Assessment', is_required: true },
        { source: 'Triage Assessment', target: 'Insurance Verification', is_required: true },
        { source: 'Insurance Verification', target: 'Admission Order Signed', is_required: true },
        { source: 'Admission Order Signed', target: 'EMR Demographics Entry', is_required: true },
        { source: 'EMR Demographics Entry', target: 'Bed Allocation', is_required: true },
        { source: 'Bed Allocation', target: 'Ward Arrival', is_required: true }
      ]
    },
    metadata: { sop_code: 'SOP-CS-ADM-01', version: '2.4' },
    conformance_rules: [
      {
        id: 'CR-W1-01',
        rule_name: 'TRIAGE_BEFORE_ADMISSION',
        rule_type: 'ORDERING',
        source_activity: 'Triage Assessment',
        target_activity: 'Admission Order Signed',
        severity: 'WARNING',
        description: 'Triage clinical assessment must precede the final admission order.'
      },
      {
        id: 'CR-W1-02',
        rule_name: 'DIGITAL_EMR_ENTRY',
        rule_type: 'CHANNEL_COMPLIANCE',
        source_activity: 'EMR Demographics Entry',
        severity: 'EFFICIENCY',
        description: 'Demographics must be entered directly in EMR, not on paper slip first.'
      }
    ]
  },
  {
    id: 'W2_PAC_CLEARANCE',
    name: 'Pre-Anaesthetic Checkup (PAC) & Fitness',
    category: 'Perioperative Clearance',
    description: 'SOP mandates full pre-anaesthetic evaluation, investigation review, and digital fitness clearance prior to any OT booking.',
    target_tat_minutes: 120,
    official_graph: {
      nodes: [
        { id: 'PAC Clinic Consultation', label: 'PAC Clinical Consultation', department: 'Anaesthesia OPD', expected_role: 'Anaesthetist', is_required: true },
        { id: 'Lab & ECG Review', label: 'Diagnostic Review (Lab/ECG/CXR)', department: 'Anaesthesia OPD', expected_role: 'Anaesthetist', is_required: true },
        { id: 'ASA Grade Classification', label: 'ASA Grade Classification', department: 'Anaesthesia OPD', expected_role: 'Anaesthetist', is_required: true },
        { id: 'Surgical Fitness Issued', label: 'Formal Surgical Fitness Signed', department: 'Anaesthesia OPD', expected_role: 'Anaesthetist', is_required: true },
        { id: 'EMR Clearance Flagged', label: 'Digital PAC Clearance Flagged', department: 'Anaesthesia OPD', expected_role: 'Anaesthetist', is_required: true },
        { id: 'OT Slot Booking', label: 'OT Slot Booking Initiated', department: 'OT Administration', expected_role: 'Surgeon', is_required: true }
      ],
      edges: [
        { source: 'PAC Clinic Consultation', target: 'Lab & ECG Review', is_required: true },
        { source: 'Lab & ECG Review', target: 'ASA Grade Classification', is_required: true },
        { source: 'ASA Grade Classification', target: 'Surgical Fitness Issued', is_required: true },
        { source: 'Surgical Fitness Issued', target: 'EMR Clearance Flagged', is_required: true },
        { source: 'EMR Clearance Flagged', target: 'OT Slot Booking', is_required: true }
      ]
    },
    metadata: { sop_code: 'SOP-CS-PAC-04', version: '3.1' },
    conformance_rules: [
      {
        id: 'CR-W2-01',
        rule_name: 'PAC_BEFORE_OT_BOOKING',
        rule_type: 'ORDERING',
        source_activity: 'EMR Clearance Flagged',
        target_activity: 'OT Slot Booking',
        severity: 'CRITICAL_SAFETY',
        description: 'Official SOP strictly requires EMR PAC Clearance Flag before OT slot booking.'
      },
      {
        id: 'CR-W2-02',
        rule_name: 'NO_WHATSAPP_CLEARANCE',
        rule_type: 'CHANNEL_COMPLIANCE',
        source_activity: 'Surgical Fitness Issued',
        severity: 'CRITICAL_SAFETY',
        description: 'Surgical fitness clearance cannot be transmitted over WhatsApp or verbal channel.'
      }
    ]
  },
  {
    id: 'W3_OT_SCHEDULING',
    name: 'OT Scheduling & Resource Allocation',
    category: 'Surgical Operations',
    description: 'Master OT schedule generation, surgeon block assignment, anaesthetist & scrub nurse roster lock 24h in advance.',
    target_tat_minutes: 60,
    official_graph: {
      nodes: [
        { id: 'Surgeon Request Submitted', label: 'Surgeon Case Request Logged', department: 'OT Administration', expected_role: 'Surgeon', is_required: true },
        { id: 'OT Room Allocation', label: 'OT Room & Table Assigned', department: 'OT Administration', expected_role: 'Hospital Administrator', is_required: true },
        { id: 'Anaesthesia Staffing', label: 'Anaesthetist Assigned to Case', department: 'Anaesthesia Department', expected_role: 'Anaesthetist', is_required: true },
        { id: 'Nursing Team Assignment', label: 'Scrub & Floor Nurse Assigned', department: 'OT Suite', expected_role: 'OT Nurse', is_required: true },
        { id: 'OT Master Schedule Lock', label: 'Master Schedule Published (T-24h)', department: 'OT Administration', expected_role: 'Hospital Administrator', is_required: true }
      ],
      edges: [
        { source: 'Surgeon Request Submitted', target: 'OT Room Allocation', is_required: true },
        { source: 'OT Room Allocation', target: 'Anaesthesia Staffing', is_required: true },
        { source: 'Anaesthesia Staffing', target: 'Nursing Team Assignment', is_required: true },
        { source: 'Nursing Team Assignment', target: 'OT Master Schedule Lock', is_required: true }
      ]
    },
    metadata: { sop_code: 'SOP-CS-SCHED-02', version: '1.9' },
    conformance_rules: [
      {
        id: 'CR-W3-01',
        rule_name: 'SCHEDULE_LOCK_T24',
        rule_type: 'ORDERING',
        source_activity: 'Nursing Team Assignment',
        target_activity: 'OT Master Schedule Lock',
        severity: 'WARNING',
        description: 'Roster lock must be completed 24 hours prior to operating day.'
      }
    ]
  },
  {
    id: 'W4_PREOP_CHECKLIST_CONSENT',
    name: 'Pre-Op Checklist & Consent (WHO SSCL)',
    category: 'Patient Safety',
    description: 'WHO Surgical Safety Checklist Phase 1 (Sign-In), informed surgical & anaesthetic consent, site marking, and allergy check.',
    target_tat_minutes: 30,
    official_graph: {
      nodes: [
        { id: 'Informed Consent Verified', label: 'Signed Consent Form Verified', department: 'Pre-Op Holding Area', expected_role: 'Surgeon', is_required: true },
        { id: 'Surgical Site Marked', label: 'Surgical Site Marked by Surgeon', department: 'Pre-Op Holding Area', expected_role: 'Surgeon', is_required: true },
        { id: 'Pre-Op Nursing Checklist', label: 'Ward/Pre-Op Nurse Checklist Signed', department: 'Pre-Op Holding Area', expected_role: 'Ward Nurse', is_required: true },
        { id: 'Patient Identity Sign-In', label: 'WHO Sign-In: Identity & Procedure', department: 'OT Suite', expected_role: 'OT Nurse', is_required: true },
        { id: 'Pulse Oximeter & Airway Check', label: 'WHO Sign-In: Pulse Ox & Airway Eval', department: 'OT Suite', expected_role: 'Anaesthetist', is_required: true },
        { id: 'Sign-In Completed', label: 'WHO Phase 1 Sign-In Logged', department: 'OT Suite', expected_role: 'OT Nurse', is_required: true }
      ],
      edges: [
        { source: 'Informed Consent Verified', target: 'Surgical Site Marked', is_required: true },
        { source: 'Surgical Site Marked', target: 'Pre-Op Nursing Checklist', is_required: true },
        { source: 'Pre-Op Nursing Checklist', target: 'Patient Identity Sign-In', is_required: true },
        { source: 'Patient Identity Sign-In', target: 'Pulse Oximeter & Airway Check', is_required: true },
        { source: 'Pulse Oximeter & Airway Check', target: 'Sign-In Completed', is_required: true }
      ]
    },
    metadata: { sop_code: 'SOP-CS-WHO-01', version: '4.0' },
    conformance_rules: [
      {
        id: 'CR-W4-01',
        rule_name: 'CONSENT_BEFORE_SIGNIN',
        rule_type: 'ORDERING',
        source_activity: 'Informed Consent Verified',
        target_activity: 'Patient Identity Sign-In',
        severity: 'CRITICAL_SAFETY',
        description: 'Informed written consent must be verified prior to initiating WHO Sign-In.'
      },
      {
        id: 'CR-W4-02',
        rule_name: 'MANDATORY_SITE_MARKING',
        rule_type: 'MANDATORY_ACTIVITY',
        source_activity: 'Surgical Site Marked',
        severity: 'CRITICAL_SAFETY',
        description: 'Surgical site marking by operating surgeon is non-negotiable for laterality procedures.'
      }
    ]
  },
  {
    id: 'W5_INTRAOP_PACU_TRANSFER',
    name: 'Intra-Op to Recovery (PACU) to Ward Transfer',
    category: 'Perioperative Care',
    description: 'SOP for WHO Time-Out, surgical procedure execution, Sign-Out, PACU vital recovery tracking, and post-op ward shift.',
    target_tat_minutes: 180,
    official_graph: {
      nodes: [
        { id: 'WHO Time-Out', label: 'WHO Phase 2: Time-Out Briefing', department: 'OT Suite', expected_role: 'Surgeon', is_required: true },
        { id: 'Incision & Procedure', label: 'Surgical Procedure Conducted', department: 'OT Suite', expected_role: 'Surgeon', is_required: true },
        { id: 'WHO Sign-Out', label: 'WHO Phase 3: Instrument & Swab Count', department: 'OT Suite', expected_role: 'OT Nurse', is_required: true },
        { id: 'Shift to PACU', label: 'Patient Transferred to PACU', department: 'Recovery / PACU', expected_role: 'Ward Boy', is_required: true },
        { id: 'PACU Monitoring & Vitals', label: 'PACU Continuous Monitoring', department: 'Recovery / PACU', expected_role: 'OT Nurse', is_required: true },
        { id: 'Aldrete Score Signoff', label: 'Modified Aldrete Score >= 9 Certified', department: 'Recovery / PACU', expected_role: 'Anaesthetist', is_required: true },
        { id: 'Transfer to Ward Bed', label: 'Patient Transferred to Post-Op Ward', department: 'Inpatient Ward', expected_role: 'Ward Nurse', is_required: true }
      ],
      edges: [
        { source: 'WHO Time-Out', target: 'Incision & Procedure', is_required: true },
        { source: 'Incision & Procedure', target: 'WHO Sign-Out', is_required: true },
        { source: 'WHO Sign-Out', target: 'Shift to PACU', is_required: true },
        { source: 'Shift to PACU', target: 'PACU Monitoring & Vitals', is_required: true },
        { source: 'PACU Monitoring & Vitals', target: 'Aldrete Score Signoff', is_required: true },
        { source: 'Aldrete Score Signoff', target: 'Transfer to Ward Bed', is_required: true }
      ]
    },
    metadata: { sop_code: 'SOP-CS-PACU-05', version: '2.1' },
    conformance_rules: [
      {
        id: 'CR-W5-01',
        rule_name: 'TIMEOUT_BEFORE_INCISION',
        rule_type: 'ORDERING',
        source_activity: 'WHO Time-Out',
        target_activity: 'Incision & Procedure',
        severity: 'CRITICAL_SAFETY',
        description: 'WHO Time-Out must occur immediately prior to surgical incision.'
      },
      {
        id: 'CR-W5-02',
        rule_name: 'ALDRETE_BEFORE_WARD_SHIFT',
        rule_type: 'ORDERING',
        source_activity: 'Aldrete Score Signoff',
        target_activity: 'Transfer to Ward Bed',
        severity: 'CRITICAL_SAFETY',
        description: 'Patient cannot be discharged from PACU without certified Aldrete score >= 9.'
      }
    ]
  },
  {
    id: 'W6_CSSD_TURNAROUND',
    name: 'Sterilization (CSSD) & Instrument Tray Turnaround',
    category: 'Supply & Sterilization',
    description: 'Decontamination, packing, biological indicator tracking, autoclave cycle, and sterile delivery to OT suite.',
    target_tat_minutes: 150,
    official_graph: {
      nodes: [
        { id: 'Used Tray Received', label: 'Decontaminated Tray Received in CSSD', department: 'CSSD', expected_role: 'CSSD Technician', is_required: true },
        { id: 'Inspection & Tray Packing', label: 'Instrument Inspection & Tray Wrapping', department: 'CSSD', expected_role: 'CSSD Technician', is_required: true },
        { id: 'Autoclave Sterilization', label: 'High-Pressure Steam Autoclave Cycle', department: 'CSSD', expected_role: 'CSSD Technician', is_required: true },
        { id: 'Biological Indicator Verified', label: 'Biological & Chemical Indicator Passed', department: 'CSSD', expected_role: 'CSSD Technician', is_required: true },
        { id: 'Sterile Storage', label: 'Tray Placed in Sterile Storage', department: 'CSSD', expected_role: 'CSSD Technician', is_required: true },
        { id: 'OT Tray Indent Placed', label: 'OT Indent Verified in EMR', department: 'OT Suite', expected_role: 'OT Nurse', is_required: true },
        { id: 'Tray Delivered to OT', label: 'Sterile Tray Delivered to OT Suite', department: 'OT Suite', expected_role: 'Ward Boy', is_required: true }
      ],
      edges: [
        { source: 'Used Tray Received', target: 'Inspection & Tray Packing', is_required: true },
        { source: 'Inspection & Tray Packing', target: 'Autoclave Sterilization', is_required: true },
        { source: 'Autoclave Sterilization', target: 'Biological Indicator Verified', is_required: true },
        { source: 'Biological Indicator Verified', target: 'Sterile Storage', is_required: true },
        { source: 'Sterile Storage', target: 'OT Tray Indent Placed', is_required: true },
        { source: 'OT Tray Indent Placed', target: 'Tray Delivered to OT', is_required: true }
      ]
    },
    metadata: { sop_code: 'SOP-CS-CSSD-03', version: '3.0' },
    conformance_rules: [
      {
        id: 'CR-W6-01',
        rule_name: 'BI_INDICATOR_MANDATORY',
        rule_type: 'MANDATORY_ACTIVITY',
        source_activity: 'Biological Indicator Verified',
        severity: 'CRITICAL_SAFETY',
        description: 'Biological indicator validation is mandatory before tray can be released to sterile storage.'
      },
      {
        id: 'CR-W6-02',
        rule_name: 'NO_REPEAT_INDENT_ENTRY',
        rule_type: 'EFFICIENCY',
        source_activity: 'OT Tray Indent Placed',
        severity: 'EFFICIENCY',
        description: 'Tray indents must be transmitted electronically once; paper and WhatsApp duplicates are prohibited.'
      }
    ]
  },
  {
    id: 'W7_PHARMACY_INDENT',
    name: 'Pharmacy & Consumables Indent',
    category: 'Pharmacy',
    description: 'SOP for OT surgical drug requisition, pharmacist dispense verification, barcode lot scan, and perioperative drug administration.',
    target_tat_minutes: 35,
    official_graph: {
      nodes: [
        { id: 'OT Drug Indent Raised', label: 'Electronic Drug & Implant Indent Raised', department: 'OT Suite', expected_role: 'OT Nurse', is_required: true },
        { id: 'Pharmacist Clinical Review', label: 'Pharmacist Clinical & Stock Review', department: 'Pharmacy', expected_role: 'Pharmacist', is_required: true },
        { id: 'Barcode Scan & Dispense', label: 'Batch/Lot Barcode Scan & Dispensing', department: 'Pharmacy', expected_role: 'Pharmacist', is_required: true },
        { id: 'OT Receipt Confirmation', label: 'OT Nurse Receipt & Count Confirmation', department: 'OT Suite', expected_role: 'OT Nurse', is_required: true },
        { id: 'Drug Administration Logged', label: 'Anaesthesia Drug Admin Recorded', department: 'OT Suite', expected_role: 'Anaesthetist', is_required: true }
      ],
      edges: [
        { source: 'OT Drug Indent Raised', target: 'Pharmacist Clinical Review', is_required: true },
        { source: 'Pharmacist Clinical Review', target: 'Barcode Scan & Dispense', is_required: true },
        { source: 'Barcode Scan & Dispense', target: 'OT Receipt Confirmation', is_required: true },
        { source: 'OT Receipt Confirmation', target: 'Drug Administration Logged', is_required: true }
      ]
    },
    metadata: { sop_code: 'SOP-CS-PHARM-01', version: '2.5' },
    conformance_rules: [
      {
        id: 'CR-W7-01',
        rule_name: 'BARCODE_SCAN_REQUIRED',
        rule_type: 'MANDATORY_ACTIVITY',
        source_activity: 'Barcode Scan & Dispense',
        severity: 'WARNING',
        description: 'All high-alert and surgical implants must be scanned via barcode scanner before dispensing.'
      }
    ]
  },
  {
    id: 'W8_BILLING_PREAUTH_DISCHARGE',
    name: 'Billing, Insurance Pre-Auth & Discharge',
    category: 'Billing & Discharge',
    description: 'Post-op clinical summary generation, implant invoice verification, insurer pre-auth query clearance, final bill, and discharge sign-off.',
    target_tat_minutes: 240,
    official_graph: {
      nodes: [
        { id: 'Post-Op Notes Completed', label: 'Surgeon Post-Op Notes Completed', department: 'OT Suite', expected_role: 'Surgeon', is_required: true },
        { id: 'Implant Sticker Attached', label: 'Implant Serial Stickers Scanned & Billed', department: 'Billing Desk', expected_role: 'Billing Executive', is_required: true },
        { id: 'Pre-Auth Approval Transmitted', label: 'Insurance Final Pre-Auth Approval', department: 'Billing Desk', expected_role: 'Billing Executive', is_required: true },
        { id: 'Final Bill Audit Completed', label: 'Internal Billing Quality Audit', department: 'Billing Desk', expected_role: 'Billing Executive', is_required: true },
        { id: 'Discharge Summary Handover', label: 'Discharge Summary & Meds Handover', department: 'Inpatient Ward', expected_role: 'Ward Nurse', is_required: true },
        { id: 'Patient Gate Pass Issued', label: 'Security Gate Pass Issued', department: 'Front Desk', expected_role: 'Front Desk', is_required: true }
      ],
      edges: [
        { source: 'Post-Op Notes Completed', target: 'Implant Sticker Attached', is_required: true },
        { source: 'Implant Sticker Attached', target: 'Pre-Auth Approval Transmitted', is_required: true },
        { source: 'Pre-Auth Approval Transmitted', target: 'Final Bill Audit Completed', is_required: true },
        { source: 'Final Bill Audit Completed', target: 'Discharge Summary Handover', is_required: true },
        { source: 'Discharge Summary Handover', target: 'Patient Gate Pass Issued', is_required: true }
      ]
    },
    metadata: { sop_code: 'SOP-CS-BILL-06', version: '3.2' },
    conformance_rules: [
      {
        id: 'CR-W8-01',
        rule_name: 'IMPLANT_VERIFIED_BEFORE_BILL',
        rule_type: 'ORDERING',
        source_activity: 'Implant Sticker Attached',
        target_activity: 'Pre-Auth Approval Transmitted',
        severity: 'EFFICIENCY',
        description: 'Implant serials must be validated to prevent payer query rejection loops.'
      },
      {
        id: 'CR-W8-02',
        rule_name: 'NO_MANUAL_NOTE_CHASE',
        rule_type: 'EFFICIENCY',
        source_activity: 'Pre-Auth Approval Transmitted',
        severity: 'EFFICIENCY',
        description: 'Pre-auth documentation must be fetched from digital admission packet without manual handoff delay.'
      }
    ]
  }
];

export const HOSPITAL_ROLES = [
  { role: 'Surgeon', department: 'Surgical Department', tier: 'CLINICAL' },
  { role: 'Anaesthetist', department: 'Anaesthesia Department', tier: 'CLINICAL' },
  { role: 'OT Nurse', department: 'OT Suite', tier: 'NURSING' },
  { role: 'Ward Nurse', department: 'Inpatient Ward', tier: 'NURSING' },
  { role: 'Front Desk', department: 'Front Desk', tier: 'ADMIN' },
  { role: 'Billing Executive', department: 'Billing Desk', tier: 'ADMIN' },
  { role: 'Pharmacist', department: 'Pharmacy', tier: 'ALLIED' },
  { role: 'CSSD Technician', department: 'CSSD', tier: 'ALLIED' },
  { role: 'Ward Boy', department: 'Patient Transfer', tier: 'SUPPORT' },
  { role: 'Hospital Administrator', department: 'Administration', tier: 'EXECUTIVE' },
  { role: 'Quality/Compliance Head', department: 'Quality & Patient Safety', tier: 'EXECUTIVE' }
];
