# Care Platform PDF Generator with Notification & Activity Logging

A comprehensive Next.js application that generates PDF documents from patient data, manages file storage in Supabase, and provides notification services with activity logging.

## Features

### Backend API Endpoints

#### 1. PDF Generation (`POST /api/generate-pdf`)
- Generates PDF documents from patient data
- Fills PDF forms with provided data
- Uploads to Supabase Storage
- Logs activities to database
- Sends notifications (optional)

**Request Body:**
```json
{
  "type": "fillout",
  "form": "a",
  "notify": true,
  "form_payload": {
    "patient_insurer_name": "AOK Pflegekasse",
    "patient_insured_fullname": "Max Mustermann",
    "patient_birth_date": "1949-02-01",
    "patient_payer_id": "04879",
    "patient_insured_id": "A03248953",
    "patient_status": "99999999",
    "patient_facility_id": "123456789",
    "patient_doctor_id": "987654321",
    "patient_date": "2025-09-04",
    "order_first": false,
    "order_followup": true,
    "care_prepare_med_box": true,
    "care_administer_meds": true,
    "care_injection_prepare": true,
    "care_injection_im": false,
    "care_injection_sc": true,
    "glucose_first_or_new": false,
    "glucose_intensified_insulin": true,
    "comp_stockings_on": true,
    "comp_bandages_apply": true,
    "comp_side_right": true,
    "comp_side_left": false,
    "comp_side_both": false,
    "wound_acute": false,
    "wound_chronic": true,
    "s37_support_care_37a": false,
    "s37_hospital_avoid_37_1": true,
    "s37_base_care": true,
    "s37_household_care": true
  }
}
```

#### 2. Notification Service (`POST /api/notify`)
- Simulates sending SMS, Email, and Push notifications
- Logs notification activities
- Supports multiple notification types

**Request Body:**
```json
{
  "type": "pdf_ready",
  "recipient": {
    "email": "patient@example.com",
    "phone": "+1234567890",
    "name": "Max Mustermann"
  },
  "message": "Your care document is ready for download",
  "document": {
    "id": "sample-doc-id",
    "name": "Care Document - Max Mustermann",
    "download_url": "https://example.com/doc.pdf"
  },
  "notification_types": ["email", "sms", "push"]
}
```

#### 3. Activity Logging (`POST /api/log`)
- Creates new log entries
- Stores event types and details

**Request Body:**
```json
{
  "event_type": "manual_test_log",
  "details": {
    "test_type": "api_endpoint_test",
    "message": "Testing log creation endpoint"
  }
}
```

#### 4. Log Retrieval (`GET /api/log`)
- Returns all activity logs
- Ordered by timestamp (newest first)

#### 5. PDF Management (`GET /api/pdfs`)
- Lists all generated PDFs
- Includes download links and metadata

### Frontend Interface

A modern React-based web interface with three main sections:

1. **Generate PDF Tab**
   - One-click PDF generation with sample data
   - Test notification sending
   - Real-time feedback

2. **PDFs Tab**
   - Table view of all generated PDFs
   - Download links for each document
   - Metadata display (ID, creation date, type, patient ID, file size)

3. **Activity Logs Tab**
   - Real-time activity log viewer
   - Detailed event information
   - JSON details for each log entry

## Technology Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **PDF Processing:** pdf-lib
- **Database & Storage:** Supabase
- **Styling:** Tailwind CSS
- **UI Components:** React with modern hooks

## Environment Setup

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PDF_TEMPLATE_PATH=./public/template_form_fillable.pdf
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Supabase Database Schema

### Tables Required:

#### `logs` table:
```sql
CREATE TABLE logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  details JSONB,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

#### `files` table:
```sql
CREATE TABLE files (
  id UUID PRIMARY KEY,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  meta JSONB
);
```

#### Storage Bucket:
- Create a bucket named `document` in Supabase Storage
- Set it to public for direct file access

## Installation & Usage

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Supabase credentials

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - API endpoints: http://localhost:3000/api/*

## API Testing

### Test PDF Generation:
```bash
curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d '{"type":"fillout","form":"a","notify":true,"form_payload":{"patient_insurer_name":"Test Insurance","patient_insured_fullname":"Test Patient"}}'
```

### Test Notifications:
```bash
curl -X POST http://localhost:3000/api/notify \
  -H "Content-Type: application/json" \
  -d '{"type":"pdf_ready","recipient":{"email":"test@example.com","name":"Test User"},"message":"Test notification","notification_types":["email"]}'
```

### Test Logging:
```bash
curl -X POST http://localhost:3000/api/log \
  -H "Content-Type: application/json" \
  -d '{"event_type":"test_event","details":{"message":"Test log entry"}}'
```

## Key Features

- **Robust Error Handling:** Graceful handling of PDF processing errors
- **Activity Logging:** Comprehensive logging of all system activities
- **File Management:** Secure file storage and retrieval
- **Notification System:** Multi-channel notification support
- **Modern UI:** Clean, responsive interface with real-time updates
- **Type Safety:** Full TypeScript implementation
- **Production Ready:** Optimized for deployment

## File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate-pdf/route.ts    # PDF generation endpoint
│   │   ├── notify/route.ts          # Notification service
│   │   ├── log/route.ts             # Activity logging
│   │   └── pdfs/route.ts            # PDF management
│   └── page.tsx                     # Frontend interface
├── public/
│   └── template_form_fillable.pdf   # PDF template
└── README.md
```

## Development Notes

- The system handles PDF form field mapping automatically
- Checkbox values support multiple truthy formats (true, "true", 1, "Yes", "On")
- File uploads are stored in Supabase Storage with public URLs
- All activities are logged for audit and debugging purposes
- The frontend provides real-time updates and error handling

## Production Deployment

1. Set up production environment variables
2. Configure Supabase production instance
3. Deploy to your preferred platform (Vercel, Netlify, etc.)
4. Update `NEXT_PUBLIC_BASE_URL` to your production domain

## Support

For issues or questions, please check the activity logs in the frontend interface or review the Supabase logs for detailed error information.