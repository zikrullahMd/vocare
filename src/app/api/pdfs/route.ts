import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// GET /api/pdfs - Retrieve all generated PDFs
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to retrieve PDFs',
        details: error.message
      }, { status: 500 });
    }

    // Format basic records
    const records = (data || []).map(pdf => ({
      id: pdf.id as string,
      file_url: pdf.file_url as string,
      created_at: pdf.created_at as string,
      file_size: (pdf.meta?.file_size as string) || 'Unknown',
      form_type: (pdf.meta?.type as string) || 'Unknown',
      form_id: (pdf.meta?.form_id as string) || 'Unknown',
      patient_id: (pdf.meta?.patient_id as string) || 'Unknown',
      doctor_id: (pdf.meta?.doctor_id as string) || 'Unknown',
      download_url: pdf.file_url as string
    }));

    // Verify each file exists (HEAD request). Filter out missing files.
    const checks = await Promise.all(records.map(async (r) => {
      try {
        const res = await fetch(r.download_url, { method: 'HEAD' });
        return { exists: res.ok, record: r };
      } catch {
        return { exists: false, record: r };
      }
    }));

    const existing = checks.filter(c => c.exists).map(c => c.record);

    return NextResponse.json({
      success: true,
      count: existing.length,
      pdfs: existing
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to retrieve PDFs',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
