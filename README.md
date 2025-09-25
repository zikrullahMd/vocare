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