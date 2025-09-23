import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

// POST /api/log - Create a new log entry
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_type, details, timestamp } = body;

    if (!event_type) {
      return NextResponse.json({ 
        error: 'event_type is required' 
      }, { status: 400 });
    }

    const logEntry = {
      event_type,
      details: details || {},
      timestamp: timestamp || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('logs')
      .insert(logEntry)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to create log entry',
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Log entry created',
      data: data
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Log creation failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// GET /api/log - Retrieve all log entries
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      return NextResponse.json({ 
        error: 'Failed to retrieve logs',
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      logs: data || []
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to retrieve logs',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}