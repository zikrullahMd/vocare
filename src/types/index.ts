// Core application types

export interface PDF {
  id: string;
  file_url: string;
  created_at: string;
  file_size: string;
  form_type: string;
  form_id: string;
  patient_id: string;
  doctor_id: string;
  download_url: string;
}

export interface Log {
  id: string;
  event_type: string;
  details: any;
  timestamp: string;
}

export interface Notification {
  id: string;
  event_type: string;
  details: {
    type: string;
    recipient: {
      name?: string;
      email?: string;
      phone?: string;
    };
    message: string;
    document?: {
      id: string;
      name: string;
      download_url: string;
    };
    status: string;
    sent_at: string;
  };
  timestamp: string;
}

// Form types
export interface PatientFormData {
  // Header
  patient_insurer_name: string;
  patient_insured_fullname: string;
  patient_insured_vorname: string;
  patient_insured_nachname: string;
  patient_birth_date: string;
  patient_payer_id: string;
  patient_insured_id: string;
  patient_status: string;
  patient_facility_id: string;
  patient_doctor_id: string;
  patient_date: string;
  patient_id: string;
  
  // Orders
  order_first: boolean;
  order_followup: boolean;
  order_accident: boolean;
  order_ser: boolean;
  
  // Diagnosis & Period
  diagnosis_icd10: string;
  diagnosis_restrictions: string;
  period_from: string;
  period_to: string;
  restrictions_text: string;
  
  // Panel (meds + frequency & duration)
  care_meds_text: string;
  panel_freq_daily: string;
  panel_freq_weekly: string;
  panel_freq_monthly: string;
  panel_dur_from: string;
  panel_dur_to: string;
  freq_from: string;
  freq_to: string;
  duration_from: string;
  duration_to: string;
  
  // Care & glucose
  care_prepare_med_box: boolean;
  care_administer_meds: boolean;
  care_injection: boolean;
  care_injection_prepare: boolean;
  care_injection_im: boolean;
  care_injection_sc: boolean;
  glucose_first_or_new: boolean;
  glucose_intensified_insulin: boolean;
  
  // Compression & wound
  comp_stockings_on: boolean;
  comp_bandages_apply: boolean;
  comp_support_bandage_type: string;
  supportive_and_stabilizing: boolean;
  comp_side_right: boolean;
  comp_side_left: boolean;
  comp_side_both: boolean;
  comp_bandages_remove: boolean;
  wound_acute: boolean;
  wound_chronic: boolean;
  wound_type: string;
  wound_materials: string;
  wound_location: string;
  wound_size_lwd: string;
  wound_grade: string;
  
  // Other/instruction
  other_measures: string;
  instruction_text: string;
  instruction_count: string;
  
  // S37 section
  s37_freq_daily: string;
  s37_freq_weekly: string;
  s37_freq_monthly: string;
  s37_from: string;
  s37_to: string;
  s37_support_care_37a: boolean;
  s37_hospital_avoid_37_1: boolean;
  s37_base_care: boolean;
  s37_household_care: boolean;
  
  // Footer
  doctor_signature: string;
  notes_text: string;
}

export interface DoctorData {
  id: string;
  establishment_nr: string;
  dr_nr: string;
  name: string;
  street: string;
  city: string;
  postal_code: string;
}

export interface MediMultiData {
  injection: boolean;
  herrichten: boolean;
  intra_muscular: boolean;
  subkutan: boolean;
}

export interface BaseCareData {
  active: boolean;
  daily: string;
  weekly: string;
  monthly: string;
}

// API types
export interface GeneratePDFRequest {
  type: string;
  form: string;
  notify: boolean;
  form_payload: PatientFormData;
}

export interface GeneratePDFResponse {
  id: string;
  file_url: string;
  success: boolean;
  message: string;
  file_size: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component prop types
export interface NavbarProps {
  pdfCount?: number;
  logCount?: number;
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface PDFFormProps {
  onGenerate: (formData: any) => void;
  loading: boolean;
  lastDoc: { id: string; url: string } | null;
}
