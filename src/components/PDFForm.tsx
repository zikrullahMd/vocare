'use client';

import { useState } from 'react';
import { PDFFormProps, PatientFormData, DoctorData, MediMultiData, BaseCareData } from '../types';
import { DEFAULT_FORM_VALUES, DEFAULT_DOCTOR_VALUES, DEFAULT_MEDI_MULTI_VALUES, DEFAULT_BASE_CARE_VALUES, FORM_FIELDS } from '../constants';

export default function PDFForm({ onGenerate, loading, lastDoc }: PDFFormProps) {
  const [formState, setFormState] = useState<PatientFormData>(DEFAULT_FORM_VALUES);
  const [doctor, setDoctor] = useState<DoctorData>(DEFAULT_DOCTOR_VALUES);
  const [mediMulti, setMediMulti] = useState<MediMultiData>(DEFAULT_MEDI_MULTI_VALUES);
  const [baseCare, setBaseCare] = useState<BaseCareData>(DEFAULT_BASE_CARE_VALUES);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Required fields
  const requiredFields = [
    'patient_id',
    'patient_insurer_name', 
    'patient_insured_vorname',
    'patient_insured_nachname',
    'patient_birth_date',
    'patient_payer_id',
    'patient_insured_id',
    'patient_status',
    'patient_facility_id',
    'patient_doctor_id',
    'patient_date',
    'diagnosis_icd10',
    'doctor_name',
    'doctor_dr_nr',
    'doctor_establishment_nr',
    'doctor_postal_code',
    'doctor_city'
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Check patient fields
    if (!formState.patient_id?.trim()) newErrors.patient_id = 'Patient ID is required';
    if (!formState.patient_insurer_name?.trim()) newErrors.patient_insurer_name = 'Insurer Name is required';
    if (!formState.patient_insured_vorname?.trim()) newErrors.patient_insured_vorname = 'Insured Vorname is required';
    if (!formState.patient_insured_nachname?.trim()) newErrors.patient_insured_nachname = 'Insured Nachname is required';
    if (!formState.patient_birth_date?.trim()) newErrors.patient_birth_date = 'Birth Date is required';
    if (!formState.patient_payer_id?.trim()) newErrors.patient_payer_id = 'Payer ID is required';
    if (!formState.patient_insured_id?.trim()) newErrors.patient_insured_id = 'Insured ID is required';
    if (!formState.patient_status?.trim()) newErrors.patient_status = 'Status is required';
    if (!formState.patient_facility_id?.trim()) newErrors.patient_facility_id = 'Facility ID is required';
    if (!formState.patient_doctor_id?.trim()) newErrors.patient_doctor_id = 'Doctor ID is required';
    if (!formState.patient_date?.trim()) newErrors.patient_date = 'Date is required';
    if (!formState.diagnosis_icd10?.trim()) newErrors.diagnosis_icd10 = 'ICD-10 Diagnosis Code is required';
    
    // Require at least one order type
    const hasOrder = !!(
      (formState as any).order_first ||
      (formState as any).order_followup ||
      (formState as any).order_accident ||
      (formState as any).order_ser
    );
    if (!hasOrder) newErrors.order_type = 'Select at least one order type';
    
    // Check doctor fields
    if (!doctor.name?.trim()) newErrors.doctor_name = 'Doctor Name is required';
    if (!doctor.dr_nr?.trim()) newErrors.doctor_dr_nr = 'Doctor Nr is required';
    if (!doctor.establishment_nr?.trim()) newErrors.doctor_establishment_nr = 'Facility Nr is required';
    if (!doctor.postal_code?.trim()) newErrors.doctor_postal_code = 'Postal Code is required';
    if (!doctor.city?.trim()) newErrors.doctor_city = 'City is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handlePatientFieldChange = (field: string, value: string) => {
    setFormState((s: any) => ({ ...s, [field]: value }));
    clearError(field);
  };

  const handleDoctorFieldChange = (field: string, value: string) => {
    setDoctor((s: any) => ({ ...s, [field]: value }));
    clearError(`doctor_${field}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const formData = {
      ...formState,
      // Flatten doctor fields
      doctor_establishment_nr: doctor.establishment_nr,
      doctor_dr_nr: doctor.dr_nr,
      doctor_name: doctor.name,
      doctor_street: doctor.street,
      doctor_city: doctor.city,
      doctor_postal_code: doctor.postal_code,
      // Flatten medi_multi fields
      medi_injection: mediMulti.injection,
      medi_herrichten: mediMulti.herrichten,
      medi_intra_muscular: mediMulti.intra_muscular,
      medi_subkutan: mediMulti.subkutan,
      // Flatten p37_1 base_care fields
      p37_base_care_active: baseCare.active,
      p37_base_care_daily: baseCare.daily,
      p37_base_care_weekly: baseCare.weekly,
      p37_base_care_monthly: baseCare.monthly
    };

    onGenerate(formData);
  };

  return (
    <div className="max-w-3xl">
      {lastDoc && (
        <div className="mb-6 p-3 border border-gray-200 rounded">
          <p className="text-sm text-gray-600 mb-1">Last generated</p>
          <a href={lastDoc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
            Download PDF
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Required Fields Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">
              <span className="font-medium">Required Fields:</span> Fields marked with <span className="text-red-500">*</span> are mandatory and must be filled out before generating the PDF.
            </p>
          </div>
        </div>

        {/* Patient Header */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">
                Patient ID <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded px-3 py-2 text-sm ${errors.patient_id ? 'border-red-500' : 'border-gray-300'}`} 
                value={formState.patient_id}
                onChange={(e)=>handlePatientFieldChange('patient_id', e.target.value)} 
              />
              {errors.patient_id && <p className="text-red-500 text-xs mt-1">{errors.patient_id}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Insurer Name <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded px-3 py-2 text-sm ${errors.patient_insurer_name ? 'border-red-500' : 'border-gray-300'}`} 
                value={formState.patient_insurer_name}
                onChange={(e)=>setFormState((s:any)=>({...s, patient_insurer_name:e.target.value}))} 
              />
              {errors.patient_insurer_name && <p className="text-red-500 text-xs mt-1">{errors.patient_insurer_name}</p>}
            </div>
            
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Insured Vorname <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded px-3 py-2 text-sm ${errors.patient_insured_vorname ? 'border-red-500' : 'border-gray-300'}`} 
                value={formState.patient_insured_vorname}
                onChange={(e)=>setFormState((s:any)=>({...s, patient_insured_vorname:e.target.value}))} 
              />
              {errors.patient_insured_vorname && <p className="text-red-500 text-xs mt-1">{errors.patient_insured_vorname}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Insured Nachname <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded px-3 py-2 text-sm ${errors.patient_insured_nachname ? 'border-red-500' : 'border-gray-300'}`} 
                value={formState.patient_insured_nachname}
                onChange={(e)=>setFormState((s:any)=>({...s, patient_insured_nachname:e.target.value}))} 
              />
              {errors.patient_insured_nachname && <p className="text-red-500 text-xs mt-1">{errors.patient_insured_nachname}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Birth Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                className={`w-full border rounded px-3 py-2 text-sm ${errors.patient_birth_date ? 'border-red-500' : 'border-gray-300'}`} 
                value={formState.patient_birth_date}
                onChange={(e)=>setFormState((s:any)=>({...s, patient_birth_date:e.target.value}))} 
              />
              {errors.patient_birth_date && <p className="text-red-500 text-xs mt-1">{errors.patient_birth_date}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Payer ID <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded px-3 py-2 text-sm ${errors.patient_payer_id ? 'border-red-500' : 'border-gray-300'}`} 
                value={formState.patient_payer_id}
                onChange={(e)=>setFormState((s:any)=>({...s, patient_payer_id:e.target.value}))} 
              />
              {errors.patient_payer_id && <p className="text-red-500 text-xs mt-1">{errors.patient_payer_id}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Insured ID <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded px-3 py-2 text-sm ${errors.patient_insured_id ? 'border-red-500' : 'border-gray-300'}`} 
                value={formState.patient_insured_id}
                onChange={(e)=>setFormState((s:any)=>({...s, patient_insured_id:e.target.value}))} 
              />
              {errors.patient_insured_id && <p className="text-red-500 text-xs mt-1">{errors.patient_insured_id}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded px-3 py-2 text-sm ${errors.patient_status ? 'border-red-500' : 'border-gray-300'}`} 
                value={formState.patient_status}
                onChange={(e)=>setFormState((s:any)=>({...s, patient_status:e.target.value}))} 
              />
              {errors.patient_status && <p className="text-red-500 text-xs mt-1">{errors.patient_status}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Facility ID <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded px-3 py-2 text-sm ${errors.patient_facility_id ? 'border-red-500' : 'border-gray-300'}`} 
                value={formState.patient_facility_id}
                onChange={(e)=>setFormState((s:any)=>({...s, patient_facility_id:e.target.value}))} 
              />
              {errors.patient_facility_id && <p className="text-red-500 text-xs mt-1">{errors.patient_facility_id}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Doctor ID <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded px-3 py-2 text-sm ${errors.patient_doctor_id ? 'border-red-500' : 'border-gray-300'}`} 
                value={formState.patient_doctor_id}
                onChange={(e)=>setFormState((s:any)=>({...s, patient_doctor_id:e.target.value}))} 
              />
              {errors.patient_doctor_id && <p className="text-red-500 text-xs mt-1">{errors.patient_doctor_id}</p>}
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input 
                type="date" 
                className={`w-full border rounded px-3 py-2 text-sm ${errors.patient_date ? 'border-red-500' : 'border-gray-300'}`} 
                value={formState.patient_date}
                onChange={(e)=>setFormState((s:any)=>({...s, patient_date:e.target.value}))} 
              />
              {errors.patient_date && <p className="text-red-500 text-xs mt-1">{errors.patient_date}</p>}
            </div>
          </div>
        </div>

        {/* Order Type */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-1">Order Type <span className="text-red-500">*</span></h2>
          {errors.order_type && (<p className="text-red-500 text-xs mb-3">{errors.order_type}</p>)}
          <div className="grid sm:grid-cols-2 gap-4">
            {FORM_FIELDS.ORDER_TYPES.map(({ key, label }) => (
              <label key={key} className="flex items-center space-x-2 text-sm text-gray-700">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                  checked={!!(formState as any)[key]}
                  onChange={(e) => setFormState((s: any) => ({ ...s, [key]: e.target.checked }))} 
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Diagnosis & Restrictions */}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-sm font-medium text-slate-700 mb-2">Diagnosis & Restrictions</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                ICD-10 Diagnosis Code <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded-lg px-3 py-2 ${errors.diagnosis_icd10 ? 'border-red-500' : 'border-slate-300'}`} 
                value={formState.diagnosis_icd10}
                onChange={(e)=>setFormState((s:any)=>({...s, diagnosis_icd10:e.target.value}))} 
              />
              {errors.diagnosis_icd10 && <p className="text-red-500 text-xs mt-1">{errors.diagnosis_icd10}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Diagnosis Restrictions</label>
              <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2" rows={2} value={formState.diagnosis_restrictions}
                onChange={(e)=>setFormState((s:any)=>({...s, diagnosis_restrictions:e.target.value}))}></textarea>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-slate-600 mb-1">Restrictions (why home care is required)</label>
              <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2" rows={3} value={formState.restrictions_text}
                onChange={(e)=>setFormState((s:any)=>({...s, restrictions_text:e.target.value}))}></textarea>
            </div>
          </div>
        </div>

        {/* Period & Care Medication */}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-sm font-medium text-slate-700 mb-2">Period & Care Medication</p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Period From (YYYY-MM-DD)</label>
              <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.period_from}
                onChange={(e)=>setFormState((s:any)=>({...s, period_from:e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Period To (YYYY-MM-DD)</label>
              <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.period_to}
                onChange={(e)=>setFormState((s:any)=>({...s, period_to:e.target.value}))} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm text-slate-600 mb-1">Care Meds Text</label>
            <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2" rows={2} value={formState.care_meds_text}
              onChange={(e)=>setFormState((s:any)=>({...s, care_meds_text:e.target.value}))}></textarea>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Panel Freq Daily</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.panel_freq_daily}
                onChange={(e)=>setFormState((s:any)=>({...s, panel_freq_daily:Number(e.target.value)}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Panel Freq Weekly</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.panel_freq_weekly}
                onChange={(e)=>setFormState((s:any)=>({...s, panel_freq_weekly:Number(e.target.value)}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Panel Freq Monthly</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.panel_freq_monthly}
                onChange={(e)=>setFormState((s:any)=>({...s, panel_freq_monthly:Number(e.target.value)}))} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Panel Duration From (YYYY-MM)</label>
              <input type="month" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.panel_dur_from}
                onChange={(e)=>setFormState((s:any)=>({...s, panel_dur_from:e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Panel Duration To (YYYY-MM)</label>
              <input type="month" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.panel_dur_to}
                onChange={(e)=>setFormState((s:any)=>({...s, panel_dur_to:e.target.value}))} />
            </div>
          </div>
        </div>

        {/* Care & Glucose */}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-sm font-medium text-slate-700 mb-2">Care & Glucose</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['care_prepare_med_box','Prepare Med Box'],
              ['care_administer_meds','Administer Meds'],
              ['care_injection','Injection'],
              ['care_injection_prepare','Injection Prepare'],
              ['care_injection_im','Injection IM'],
              ['care_injection_sc','Injection SC'],
              ['glucose_first_or_new','Glucose First/New'],
              ['glucose_intensified_insulin','Glucose Intensified Insulin']
            ].map(([key,label])=> (
              <label key={key} className="inline-flex items-center space-x-2 text-slate-700">
                <input type="checkbox" checked={!!(formState as any)[key]}
                  onChange={(e)=>setFormState((s:any)=>({...s, [key]: e.target.checked}))} />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Compression & Wound */}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-sm font-medium text-slate-700 mb-2">Compression & Wound</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['comp_stockings_on','Compression Stockings On'],
              ['comp_bandages_apply','Bandages Apply'],
              ['comp_side_right','Side Right'],
              ['comp_side_left','Side Left'],
              ['comp_side_both','Side Both'],
              ['comp_bandages_remove','Bandages Remove'],
              ['wound_acute','Wound Acute'],
              ['wound_chronic','Wound Chronic']
            ].map(([key,label])=> (
              <label key={key} className="inline-flex items-center space-x-2 text-slate-700">
                <input type="checkbox" checked={!!(formState as any)[key]}
                  onChange={(e)=>setFormState((s:any)=>({...s, [key]: e.target.checked}))} />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Compression/Support Bandage Type</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.comp_support_bandage_type}
                onChange={(e)=>setFormState((s:any)=>({...s, comp_support_bandage_type:e.target.value}))} />
            </div>
            <div className="flex items-center mt-6">
              <label className="inline-flex items-center space-x-2 text-slate-700">
                <input type="checkbox" checked={!!formState.supportive_and_stabilizing}
                  onChange={(e)=>setFormState((s:any)=>({...s, supportive_and_stabilizing:e.target.checked}))} />
                <span>Supportive & Stabilizing</span>
              </label>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Wound Type</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.wound_type}
                onChange={(e)=>setFormState((s:any)=>({...s, wound_type:e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Wound Materials</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.wound_materials}
                onChange={(e)=>setFormState((s:any)=>({...s, wound_materials:e.target.value}))} />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Wound Location</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.wound_location}
                onChange={(e)=>setFormState((s:any)=>({...s, wound_location:e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Wound Size (LWD)</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.wound_size_lwd}
                onChange={(e)=>setFormState((s:any)=>({...s, wound_size_lwd:e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Wound Grade</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.wound_grade}
                onChange={(e)=>setFormState((s:any)=>({...s, wound_grade:e.target.value}))} />
            </div>
          </div>
        </div>

        {/* S37 & Doctor */}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-sm font-medium text-slate-700 mb-2">S37 & Doctor</p>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            {[
              ['s37_support_care_37a','Support Care §37a'],
              ['s37_hospital_avoid_37_1','Avoid Hospital §37.1'],
              ['s37_base_care','Base Care'],
              ['s37_household_care','Household Care']
            ].map(([key,label])=> (
              <label key={key} className="inline-flex items-center space-x-2 text-slate-700">
                <input type="checkbox" checked={!!(formState as any)[key]}
                  onChange={(e)=>setFormState((s:any)=>({...s, [key]: e.target.checked}))} />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">S37 Freq Daily</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.s37_freq_daily}
                onChange={(e)=>setFormState((s:any)=>({...s, s37_freq_daily:Number(e.target.value)}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">S37 Freq Weekly</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.s37_freq_weekly}
                onChange={(e)=>setFormState((s:any)=>({...s, s37_freq_weekly:Number(e.target.value)}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">S37 Freq Monthly</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.s37_freq_monthly}
                onChange={(e)=>setFormState((s:any)=>({...s, s37_freq_monthly:Number(e.target.value)}))} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">S37 From (YYYY-MM-DD)</label>
              <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.s37_from}
                onChange={(e)=>setFormState((s:any)=>({...s, s37_from:e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">S37 To (YYYY-MM-DD)</label>
              <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.s37_to}
                onChange={(e)=>setFormState((s:any)=>({...s, s37_to:e.target.value}))} />
            </div>
          </div>
          <div className="grid sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Base Daily</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={baseCare.daily}
                onChange={(e)=>setBaseCare((s:any)=>({...s, daily:Number(e.target.value)}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Base Weekly</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={baseCare.weekly}
                onChange={(e)=>setBaseCare((s:any)=>({...s, weekly:Number(e.target.value)}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Base Monthly</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={baseCare.monthly}
                onChange={(e)=>setBaseCare((s:any)=>({...s, monthly:Number(e.target.value)}))} />
            </div>
            <div className="flex items-center mt-6">
              <label className="inline-flex items-center space-x-2 text-slate-700">
                <input type="checkbox" checked={!!baseCare.active}
                  onChange={(e)=>setBaseCare((s:any)=>({...s, active:e.target.checked}))} />
                <span>Active</span>
              </label>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Doctor Name <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded-lg px-3 py-2 ${errors.doctor_name ? 'border-red-500' : 'border-slate-300'}`} 
                value={doctor.name}
                onChange={(e)=>setDoctor((s:any)=>({...s, name:e.target.value}))} 
              />
              {errors.doctor_name && <p className="text-red-500 text-xs mt-1">{errors.doctor_name}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Doctor Nr <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded-lg px-3 py-2 ${errors.doctor_dr_nr ? 'border-red-500' : 'border-slate-300'}`} 
                value={doctor.dr_nr}
                onChange={(e)=>setDoctor((s:any)=>({...s, dr_nr:e.target.value}))} 
              />
              {errors.doctor_dr_nr && <p className="text-red-500 text-xs mt-1">{errors.doctor_dr_nr}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Facility Nr <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded-lg px-3 py-2 ${errors.doctor_establishment_nr ? 'border-red-500' : 'border-slate-300'}`} 
                value={doctor.establishment_nr}
                onChange={(e)=>setDoctor((s:any)=>({...s, establishment_nr:e.target.value}))} 
              />
              {errors.doctor_establishment_nr && <p className="text-red-500 text-xs mt-1">{errors.doctor_establishment_nr}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-slate-600 mb-1">Street</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2" value={doctor.street}
                onChange={(e)=>setDoctor((s:any)=>({...s, street:e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded-lg px-3 py-2 ${errors.doctor_postal_code ? 'border-red-500' : 'border-slate-300'}`} 
                value={doctor.postal_code}
                onChange={(e)=>setDoctor((s:any)=>({...s, postal_code:e.target.value}))} 
              />
              {errors.doctor_postal_code && <p className="text-red-500 text-xs mt-1">{errors.doctor_postal_code}</p>}
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input 
                className={`w-full border rounded-lg px-3 py-2 ${errors.doctor_city ? 'border-red-500' : 'border-slate-300'}`} 
                value={doctor.city}
                onChange={(e)=>setDoctor((s:any)=>({...s, city:e.target.value}))} 
              />
              {errors.doctor_city && <p className="text-red-500 text-xs mt-1">{errors.doctor_city}</p>}
            </div>
          </div>
        </div>

        {/* Other Measures & Instructions */}
        <div className="border-t border-slate-200 pt-4">
          <p className="text-sm font-medium text-slate-700 mb-2">Other Measures & Instructions</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-slate-600 mb-1">Other Measures</label>
              <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2" rows={3} value={formState.other_measures}
                onChange={(e)=>setFormState((s:any)=>({...s, other_measures:e.target.value}))}></textarea>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-slate-600 mb-1">Instruction Text</label>
              <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2" rows={3} value={formState.instruction_text}
                onChange={(e)=>setFormState((s:any)=>({...s, instruction_text:e.target.value}))}></textarea>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Instruction Count</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.instruction_count}
                onChange={(e)=>setFormState((s:any)=>({...s, instruction_count:e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Doctor Signature</label>
              <input className="w-full border border-slate-300 rounded-lg px-3 py-2" value={formState.doctor_signature}
                onChange={(e)=>setFormState((s:any)=>({...s, doctor_signature:e.target.value}))} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-slate-600 mb-1">Notes</label>
              <textarea className="w-full border border-slate-300 rounded-lg px-3 py-2" rows={3} value={formState.notes_text}
                onChange={(e)=>setFormState((s:any)=>({...s, notes_text:e.target.value}))}></textarea>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <button type="submit" disabled={loading} className="bg-gray-900 text-white px-6 py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
            {loading ? 'Generating...' : 'Generate PDF'}
          </button>
        </div>
      </form>
    </div>
  );
}

