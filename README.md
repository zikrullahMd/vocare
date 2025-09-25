# Care Platform

A modern, minimalistic web application for generating patient care PDFs with notification and activity logging capabilities.

## Features

- **PDF Generation**: Fill out and generate patient care documents from templates
- **Activity Logging**: Track all system activities and events
- **Notifications**: Send email, SMS, and push notifications
- **Document Management**: View, search, and download generated PDFs
- **Responsive Design**: Clean, minimalistic UI that works on all devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with custom component classes
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **PDF Processing**: pdf-lib

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── logs/              # Logs page
│   ├── notifications/     # Notifications page
│   ├── pdfs/              # PDFs page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── Layout.tsx         # Main layout wrapper
│   ├── Navbar.tsx         # Navigation component
│   ├── PDFForm.tsx        # PDF generation form
│   └── index.ts           # Component exports
├── hooks/                 # Custom React hooks
│   ├── useApi.ts          # API data fetching hooks
│   ├── useForm.ts         # Form state management hook
│   └── index.ts           # Hook exports
├── lib/                   # Utility libraries
│   ├── api.ts             # API client functions
│   ├── config.ts          # Application configuration
│   └── index.ts           # Library exports
├── styles/                # CSS/SCSS files
│   ├── globals.css        # Global styles and CSS variables
│   └── components.css     # Component-specific styles
├── types/                 # TypeScript type definitions
│   └── index.ts           # All type definitions
├── utils/                 # Utility functions
│   └── index.ts           # Utility function exports
└── constants/             # Application constants
    └── index.ts           # All constants
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vocare-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PDF_TEMPLATE_PATH=./public/template_form_fillable.pdf
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

5. Set up Supabase:
   - Create a new Supabase project
   - Create the following tables:
     - `logs` (id, event_type, details, timestamp)
     - `files` (id, file_url, created_at, meta)
   - Create a storage bucket named `document`
   - Set up RLS policies

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### POST /api/generate-pdf
Generate a new PDF document from form data.

**Request Body:**
```json
{
  "type": "fillout",
  "form": "a",
  "notify": true,
  "form_payload": {
    "patient_insurer_name": "AOK Pflegekasse",
    "patient_insured_fullname": "Max Mustermann",
    // ... other form fields
  }
}
```

### GET /api/pdfs
Retrieve all generated PDF documents.

### GET /api/log
Retrieve all activity logs.

### POST /api/log
Create a new activity log entry.

### POST /api/notify
Send notifications (email, SMS, push).

## Development

### Code Style

- Use TypeScript for all new code
- Follow the established project structure
- Use the provided CSS classes from `styles/components.css`
- Write reusable components in the `components/` directory
- Use custom hooks for data fetching and state management

### Adding New Features

1. Define types in `src/types/index.ts`
2. Add constants in `src/constants/index.ts`
3. Create API functions in `src/lib/api.ts`
4. Build components in `src/components/`
5. Add styles in `src/styles/components.css`

### Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@example.com or create an issue in the repository.