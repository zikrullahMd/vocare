# Care Platform

A modern web application for generating patient care PDFs with notification and activity logging capabilities.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
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
git clone <repository-url>
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
    "patient_insurer_name": "AOK Pflegekasse",
    "patient_insured_fullname": "Max Mustermann",
    "patient_birth_date": "1990-01-01",
    "patient_payer_id": "12345",
    "patient_insured_id": "67890",
    "patient_status": "active",
    "patient_facility_id": "facility123",
    "patient_doctor_id": "doctor456",
    "patient_date": "2024-01-15",
    "order_first": true
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

## Testing with Postman

Import the provided `Care-Platform-API.postman_collection.json` file into Postman to test all endpoints with pre-configured requests and example data.

## Development

### Project Structure

```
src/
├── app/
│   ├── api/               # API routes
│   ├── logs/              # Logs page
│   ├── notifications/     # Notifications page
│   ├── pdfs/              # PDFs page
│   └── page.tsx           # Home page
├── components/            # React components
├── hooks/                 # Custom hooks
├── lib/                   # Utilities
├── styles/                # CSS files
├── types/                 # TypeScript types
└── utils/                 # Helper functions
```

### Code Style

- Use TypeScript for all code
- Follow Next.js 15 conventions
- Use Tailwind CSS for styling
- Write modular, reusable components

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

The app can also be deployed to Netlify, Railway, or any platform supporting Next.js.