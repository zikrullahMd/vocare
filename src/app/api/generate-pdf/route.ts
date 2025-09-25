import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PDFDocument, StandardFonts } from "pdf-lib";
import fs from "node:fs/promises";
import { v4 as uuid } from "uuid";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

async function logActivity(eventType: string, details: any) {
  try {
    await supabase.from('logs').insert({
      event_type: eventType,
      details: details,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Silent fail for logging
  }
}

export async function POST(req: NextRequest) {
  const requestId = uuid();
  
  try {
    const body = await req.json();
    const { type, form: formType, notify, form_payload } = body;

    if (!form_payload) {
      return NextResponse.json({ 
        error: 'form_payload is required' 
      }, { status: 400 });
    }

    // Basic validation for mandatory form area (header section)
    const requiredFields = [
      'patient_insurer_name',
      'patient_insured_fullname',
      'patient_birth_date',
      'patient_payer_id',
      'patient_insured_id',
      'patient_status',
      'patient_facility_id',
      'patient_doctor_id',
      'patient_date'
    ];

    const missing: string[] = [];
    for (const key of requiredFields) {
      const v = (form_payload as any)[key];
      if (v === undefined || v === null || String(v).trim() === '') {
        missing.push(key);
      }
    }

    // Require at least one order type checkbox
    const hasOrder = !!(form_payload.order_first || form_payload.order_followup || form_payload.order_accident || form_payload.order_ser);
    if (!hasOrder) {
      missing.push('order_type');
    }

    if (missing.length > 0) {
      return NextResponse.json({
        error: 'Missing mandatory fields',
        missing
      }, { status: 400 });
    }

    // Load PDF template
    const templatePath = process.env.PDF_TEMPLATE_PATH!;
    const templateBytes = await fs.readFile(templatePath);
    
    let pdf;
    try {
      pdf = await PDFDocument.load(templateBytes);
    } catch (loadError) {
      return NextResponse.json({ 
        error: 'Invalid PDF template',
        details: 'Failed to load PDF template file'
      }, { status: 500 });
    }

    // Prepare form data
    const formData = { ...form_payload };
    
    // Fix field name mismatches
    if (formData.patient_doctor_id) {
      formData.patient_doctor_number = formData.patient_doctor_id;
      delete formData.patient_doctor_id;
    }
    
    if (formData.care_injection_prepare) {
      formData.care_injectioin_prepare = formData.care_injection_prepare;
      delete formData.care_injection_prepare;
    }
    
    if (formData.s37_hospital_avoid_37_1) {
      formData.s37_hospital_acoid_37_1 = formData.s37_hospital_avoid_37_1;
      delete formData.s37_hospital_avoid_37_1;
    }
    
    delete formData.comp_stockings_off;

    // Split patient name
    if (form_payload.patient_insured_fullname) {
      const nameParts = form_payload.patient_insured_fullname.split(' ');
      if (nameParts.length >= 2) {
        formData.patient_insured_vorname = nameParts[0];
        formData.patient_insured_nachname = nameParts.slice(1).join(' ');
      } else {
        formData.patient_insured_vorname = form_payload.patient_insured_fullname;
      }
    }

    // Handle nested objects
    if (form_payload.doctor) {
      const doctor = form_payload.doctor;
      if (doctor.establishment_nr) formData.patient_facility_id = doctor.establishment_nr;
      if (doctor.dr_nr) formData.patient_doctor_number = doctor.dr_nr;
      if (doctor.name) formData.doctor_stamp_name = doctor.name;
    }

    if (form_payload.medi_multi) {
      const m = form_payload.medi_multi;
      formData.care_injectioin_prepare = !!m.injection;
      formData.care_prepare_med_box = !!m.herrichten;
      formData.care_injection_im = !!m.intra_muscular;
      formData.care_injection_sc = !!m.subkutan;
    }

    if (form_payload.p37_1?.base_care) {
      const care = form_payload.p37_1.base_care;
      if (care.active) formData.s37_base_care = care.active;
      if (care.daily) formData.s37_freq_daily = care.daily;
      if (care.weekly) formData.s37_freq_weekly = care.weekly;
      if (care.monthly) formData.s37_freq_monthly = care.monthly;
    }

    // Fill PDF form
    try {
      const pdfForm = pdf.getForm();
      const fields = pdfForm.getFields();
      
      for (const field of fields) {
        const fieldName = field.getName();
        const value = formData[fieldName];
        
        if (value === undefined) continue;

        try {
          const fieldAny = field as any;
          
          if (typeof fieldAny.setText === "function") {
            fieldAny.setText(String(value ?? ""));
          } else if (typeof fieldAny.check === "function") {
            const isChecked = value === true || value === "true" || value === 1 || value === "1" || value === "Yes" || value === "On";
            if (isChecked) {
              fieldAny.check();
            } else {
              fieldAny.uncheck();
            }
          } else if (typeof fieldAny.select === "function") {
            fieldAny.select(String(value));
          }
        } catch (fieldError) {
          // Skip problematic fields
          continue;
        }
      }
      
      // Update appearances and flatten
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      pdfForm.updateFieldAppearances(font);
      pdfForm.flatten();
    } catch (formError) {
      // If form processing fails, continue without filling
      // This allows the API to work even with problematic PDF templates
    }

    // Generate and save PDF
    const pdfBytes = await pdf.save();
    const fileId = uuid();
    const fileName = `${fileId}.pdf`;
    const filePath = `document/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('document')
      .upload(filePath, pdfBytes, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (uploadError) {
      return NextResponse.json({ 
        error: 'Failed to upload PDF',
        details: uploadError.message
      }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('document')
      .getPublicUrl(filePath);
    
    const fileUrl = urlData.publicUrl;

    // Save to database
    await supabase.from('files').insert({
      id: fileId,
      file_url: fileUrl,
      created_at: new Date().toISOString(),
      meta: {
        form_id: formType,
        type: type,
        patient_id: form_payload.patient_id,
        doctor_id: form_payload.doctor?.id
      }
    });

    // Send notification if requested
    if (notify) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        await fetch(`${baseUrl}/api/notify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'pdf_ready',
            recipient: {
              patient_id: form_payload.patient_id,
              name: form_payload.patient_insured_fullname || 'Patient'
            },
            document: {
              id: fileId,
              name: `Care Document - ${form_payload.patient_insured_fullname || 'Patient'}`,
              download_url: fileUrl,
              created_at: new Date().toISOString()
            },
            notification_types: ['email', 'sms']
          })
        });
      } catch (notifyError) {
        // Silent fail for notifications
      }
    }

    return NextResponse.json({
      id: fileId,
      file_url: fileUrl,
      success: true,
      message: 'PDF generated successfully',
      file_size: pdfBytes.length
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'PDF generation failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
