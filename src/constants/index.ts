// Application constants

export const API_ENDPOINTS = {
  GENERATE_PDF: '/api/generate-pdf',
  LOGS: '/api/log',
  NOTIFY: '/api/notify',
  PDFS: '/api/pdfs',
} as const;

export const ROUTES = {
  HOME: '/',
  PDFS: '/pdfs',
  LOGS: '/logs',
  NOTIFICATIONS: '/notifications',
} as const;

export const FORM_FIELDS = {
  ORDER_TYPES: [
    { key: 'order_first', label: 'First' },
    { key: 'order_followup', label: 'Follow-up' },
    { key: 'order_accident', label: 'Accident' },
    { key: 'order_ser', label: 'SER' },
  ],
  CARE_OPTIONS: [
    { key: 'care_prepare_med_box', label: 'Prepare Med Box' },
    { key: 'care_administer_meds', label: 'Administer Meds' },
    { key: 'care_injection', label: 'Injection' },
    { key: 'care_injection_prepare', label: 'Injection Prepare' },
    { key: 'care_injection_im', label: 'Injection IM' },
    { key: 'care_injection_sc', label: 'Injection SC' },
    { key: 'glucose_first_or_new', label: 'Glucose First/New' },
    { key: 'glucose_intensified_insulin', label: 'Glucose Intensified Insulin' },
  ],
  COMPRESSION_OPTIONS: [
    { key: 'comp_stockings_on', label: 'Compression Stockings On' },
    { key: 'comp_bandages_apply', label: 'Bandages Apply' },
    { key: 'comp_side_right', label: 'Side Right' },
    { key: 'comp_side_left', label: 'Side Left' },
    { key: 'comp_side_both', label: 'Side Both' },
    { key: 'comp_bandages_remove', label: 'Bandages Remove' },
    { key: 'wound_acute', label: 'Wound Acute' },
    { key: 'wound_chronic', label: 'Wound Chronic' },
  ],
  S37_OPTIONS: [
    { key: 's37_support_care_37a', label: 'Support Care §37a' },
    { key: 's37_hospital_avoid_37_1', label: 'Avoid Hospital §37.1' },
    { key: 's37_base_care', label: 'Base Care' },
    { key: 's37_household_care', label: 'Household Care' },
  ],
} as const;

export const FILTER_OPTIONS = {
  LOGS: [
    { key: 'all', label: 'All' },
    { key: 'pdf', label: 'PDF' },
    { key: 'notification', label: 'Notifications' },
    { key: 'upload', label: 'Uploads' },
    { key: 'error', label: 'Errors' },
  ],
  NOTIFICATIONS: [
    { key: 'all', label: 'All' },
    { key: 'email', label: 'Email' },
    { key: 'sms', label: 'SMS' },
    { key: 'push', label: 'Push' },
    { key: 'sent', label: 'Sent' },
    { key: 'failed', label: 'Failed' },
  ],
} as const;

export const SORT_OPTIONS = {
  PDFS: [
    { key: 'date', label: 'Date' },
    { key: 'size', label: 'Size' },
    { key: 'type', label: 'Type' },
  ],
} as const;

export const NOTIFICATION_TYPES = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
} as const;

export const PDF_FORM_TYPES = {
  FILLOUT: 'fillout',
  CREATE: 'create',
} as const;

export const DEFAULT_FORM_VALUES = {
  patient_insurer_name: '',
  patient_insured_fullname: '',
  patient_insured_vorname: '',
  patient_insured_nachname: '',
  patient_birth_date: '',
  patient_payer_id: '',
  patient_insured_id: '',
  patient_status: '',
  patient_facility_id: '',
  patient_doctor_id: '',
  patient_date: '',
  patient_id: '',
  order_first: false,
  order_followup: false,
  order_accident: false,
  order_ser: false,
  diagnosis_icd10: '',
  diagnosis_restrictions: '',
  period_from: '',
  period_to: '',
  restrictions_text: '',
  care_meds_text: '',
  panel_freq_daily: '',
  panel_freq_weekly: '',
  panel_freq_monthly: '',
  panel_dur_from: '',
  panel_dur_to: '',
  freq_from: '',
  freq_to: '',
  duration_from: '',
  duration_to: '',
  care_prepare_med_box: false,
  care_administer_meds: false,
  care_injection: false,
  care_injection_prepare: false,
  care_injection_im: false,
  care_injection_sc: false,
  glucose_first_or_new: false,
  glucose_intensified_insulin: false,
  comp_stockings_on: false,
  comp_bandages_apply: false,
  comp_support_bandage_type: '',
  supportive_and_stabilizing: false,
  comp_side_right: false,
  comp_side_left: false,
  comp_side_both: false,
  comp_bandages_remove: false,
  wound_acute: false,
  wound_chronic: false,
  wound_type: '',
  wound_materials: '',
  wound_location: '',
  wound_size_lwd: '',
  wound_grade: '',
  other_measures: '',
  instruction_text: '',
  instruction_count: '',
  s37_freq_daily: '',
  s37_freq_weekly: '',
  s37_freq_monthly: '',
  s37_from: '',
  s37_to: '',
  s37_support_care_37a: false,
  s37_hospital_avoid_37_1: false,
  s37_base_care: false,
  s37_household_care: false,
  doctor_signature: '',
  notes_text: '',
} as const;

export const DEFAULT_DOCTOR_VALUES = {
  id: '',
  establishment_nr: '',
  dr_nr: '',
  name: '',
  street: '',
  city: '',
  postal_code: '',
} as const;

export const DEFAULT_MEDI_MULTI_VALUES = {
  injection: false,
  herrichten: false,
  intra_muscular: false,
  subkutan: false,
} as const;

export const DEFAULT_BASE_CARE_VALUES = {
  active: false,
  daily: '',
  weekly: '',
  monthly: '',
} as const;
