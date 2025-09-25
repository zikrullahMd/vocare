import { useState, useCallback } from 'react';
import { PatientFormData, DoctorData, MediMultiData, BaseCareData } from '../types';
import { DEFAULT_FORM_VALUES, DEFAULT_DOCTOR_VALUES, DEFAULT_MEDI_MULTI_VALUES, DEFAULT_BASE_CARE_VALUES } from '../constants';

export const useForm = () => {
  const [formState, setFormState] = useState<PatientFormData>(DEFAULT_FORM_VALUES);
  const [doctor, setDoctor] = useState<DoctorData>(DEFAULT_DOCTOR_VALUES);
  const [mediMulti, setMediMulti] = useState<MediMultiData>(DEFAULT_MEDI_MULTI_VALUES);
  const [baseCare, setBaseCare] = useState<BaseCareData>(DEFAULT_BASE_CARE_VALUES);

  const updateFormField = useCallback((field: keyof PatientFormData, value: any) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateDoctorField = useCallback((field: keyof DoctorData, value: any) => {
    setDoctor(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateMediMultiField = useCallback((field: keyof MediMultiData, value: any) => {
    setMediMulti(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateBaseCareField = useCallback((field: keyof BaseCareData, value: any) => {
    setBaseCare(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState(DEFAULT_FORM_VALUES);
    setDoctor(DEFAULT_DOCTOR_VALUES);
    setMediMulti(DEFAULT_MEDI_MULTI_VALUES);
    setBaseCare(DEFAULT_BASE_CARE_VALUES);
  }, []);

  const getFormData = useCallback(() => {
    return {
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
  }, [formState, doctor, mediMulti, baseCare]);

  return {
    formState,
    doctor,
    mediMulti,
    baseCare,
    updateFormField,
    updateDoctorField,
    updateMediMultiField,
    updateBaseCareField,
    resetForm,
    getFormData,
  };
};
