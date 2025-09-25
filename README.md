# Care Platform

A modern web application for generating patient care PDFs with notification and activity logging capabilities.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase
- **Storage**: Supabase Storage
- **PDF Processing**: pdf-lib

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone and install dependencies:
```bash
git clone https://github.com/zikrullahMd/vocare
cd vocare-backend
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Configure your `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PDF_TEMPLATE_PATH=./public/template_form_fillable.pdf
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Set up Supabase database and storage (see [Supabase Setup](#supabase-setup) below)

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Supabase Setup

### 1. Create Tables

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create logs table
CREATE TABLE logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create files table
CREATE TABLE files (
  id UUID PRIMARY KEY,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  meta JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX idx_logs_timestamp ON logs(timestamp DESC);
CREATE INDEX idx_logs_event_type ON logs(event_type);
CREATE INDEX idx_files_created_at ON files(created_at DESC);
```

### 2. Create Storage Bucket

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `document`
3. Set the bucket to public
4. Configure RLS policies:

```sql
-- Allow public access to documents
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'document');

-- Allow service role to upload documents
CREATE POLICY "Service Role Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'document');
```

### 3. Get Your Credentials

1. Go to Settings > API in your Supabase dashboard
2. Copy your Project URL and Service Role Key
3. Add them to your `.env.local` file

## Testing with Postman

Import the provided Postman collection [Vocare.postman_collection.json](https://github.com/zikrullahMd/vocare/blob/main/Vocare.postman_collection.json) into Postman to test all endpoints with pre-configured requests and example data.

## API Endpoints

### POST /api/generate-pdf
Generate a PDF document from form data.

**Request Body:**
```json
{
  "type": "fillout",
  "form": "a",
  "notify": true,
  "form_payload": {
    "patient_id": "PAT-001",
    "patient_insurer_name": "AOK Bayern",
    "patient_insured_fullname": "Max Mustermann",
    "patient_insured_vorname": "Max",
    "patient_insured_nachname": "Mustermann",
    "patient_birth_date": "1985-07-21",
    "patient_payer_id": "PAYER-123",
    "patient_insured_id": "INS-987654",
    "patient_status": "active",
    "patient_facility_id": "FAC-55",
    "patient_doctor_id": "DOC-22",
    "patient_date": "2025-09-25",

    "order_first": true,
    "order_followup": true,
    "order_accident": true,
    "order_ser": true,

    "diagnosis_icd10": "E11.9",
    "diagnosis_restrictions": "Limited mobility and diabetes management required",
    "restrictions_text": "Patient requires home care due to mobility limitations and diabetes management needs",

    "period_from": "2025-10-01",
    "period_to": "2025-12-31",
    "care_meds_text": "Metformin 500mg twice daily, Insulin as needed",
    "panel_freq_daily": 2,
    "panel_freq_weekly": 3,
    "panel_freq_monthly": 1,
    "panel_dur_from": "2025-10",
    "panel_dur_to": "2025-12",

    "care_prepare_med_box": true,
    "care_administer_meds": true,
    "care_injection": true,
    "care_injection_prepare": true,
    "care_injection_im": true,
    "care_injection_sc": true,

    "glucose_first_or_new": true,
    "glucose_intensified_insulin": true,

    "comp_stockings_on": true,
    "comp_bandages_apply": true,
    "comp_side_right": true,
    "comp_side_left": true,
    "comp_side_both": true,
    "comp_bandages_remove": true,
    "comp_support_bandage_type": "Class II Compression Stockings",
    "supportive_and_stabilizing": true,

    "wound_acute": true,
    "wound_chronic": true,
    "wound_type": "Diabetic ulcer",
    "wound_materials": "Hydrocolloid dressing, saline solution",
    "wound_location": "Left foot, plantar surface",
    "wound_size_lwd": "2.5cm x 1.8cm x 0.3cm",
    "wound_grade": "Grade 2",

    "s37_support_care_37a": true,
    "s37_hospital_avoid_37_1": true,
    "s37_base_care": true,
    "s37_household_care": true,
    "s37_freq_daily": 2,
    "s37_freq_weekly": 4,
    "s37_freq_monthly": 1,
    "s37_from": "2025-10-01",
    "s37_to": "2025-12-31",

    "other_measures": "Physiotherapy referral, dietary consultation, podiatry care",
    "instruction_text": "Comprehensive caregiver instruction including medication administration, wound care, and glucose monitoring",
    "instruction_count": 5,
    "doctor_signature": "Dr. Johannes Arzt",
    "notes_text": "Patient requires comprehensive care plan. Family caregiver training completed. Regular follow-up appointments scheduled.",

    "doctor": {
      "name": "Dr. Johannes Arzt",
      "dr_nr": "DR-7788",
      "establishment_nr": "EST-4455",
      "street": "Hauptstr. 10",
      "city": "München",
      "postal_code": "80331"
    },

    "medi_multi": {
      "injection": true,
      "herrichten": true,
      "intra_muscular": true,
      "subkutan": true
    },

    "p37_1": {
      "base_care": {
        "active": true,
        "daily": 2,
        "weekly": 4,
        "monthly": 1
      }
    }
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "file_url": "https://...",
  "success": true,
  "message": "PDF generated successfully",
  "file_size": 12345
}
```

### POST /api/log
Create a new activity log entry.

**Request Body:**
```json
{
  "event_type": "user_action",
  "details": {
    "action": "form_submitted",
    "user_id": "user123"
  }
}
```

### POST /api/notify
Send notifications (email, SMS, push).

**Request Body:**
```json
{
  "type": "pdf_ready",
  "recipient": {
    "email": "patient@example.com",
    "phone": "+1234567890"
  },
  "message": "Your care document is ready",
  "document": {
    "id": "doc123",
    "name": "Care Document",
    "download_url": "https://..."
  },
  "notification_types": ["email", "sms"]
}
```

### GET /api/pdfs
Retrieve all generated PDF documents.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "pdfs": [
    {
      "id": "uuid",
      "file_url": "https://...",
      "created_at": "2024-01-15T10:30:00Z",
      "form_type": "fillout",
      "patient_id": "patient123"
    }
  ]
}
```

### GET /api/log
Retrieve all activity logs.

**Response:**
```json
{
  "success": true,
  "count": 10,
  "logs": [
    {
      "id": "uuid",
      "event_type": "pdf_generated",
      "details": {...},
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```