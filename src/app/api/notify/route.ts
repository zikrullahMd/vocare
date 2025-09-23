import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      type, 
      recipient, 
      message, 
      document, 
      notification_types = ['email'] 
    } = body;

    if (!type || !recipient || !message) {
      return NextResponse.json({ 
        error: 'Missing required fields: type, recipient, message' 
      }, { status: 400 });
    }

    const results = [];

    // Simulate sending notifications
    for (const notificationType of notification_types) {
      try {
        // Simulate notification sending
        const notificationData = {
          type: notificationType,
          recipient: recipient,
          message: message,
          document: document,
          sent_at: new Date().toISOString(),
          status: 'sent'
        };

        // Log to database
        await supabase.from('logs').insert({
          event_type: `${notificationType}_notification_sent`,
          details: notificationData,
          timestamp: new Date().toISOString()
        });

        results.push({
          type: notificationType,
          status: 'sent',
          recipient: recipient.email || recipient.phone || recipient.device_id
        });

      } catch (error) {
        results.push({
          type: notificationType,
          status: 'failed',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications processed',
      results: results
    });

  } catch (error) {
    return NextResponse.json({ 
      error: 'Notification processing failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
