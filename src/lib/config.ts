// Application configuration

export const config = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    timeout: 30000, // 30 seconds
  },

  // PDF Configuration
  pdf: {
    templatePath: process.env.PDF_TEMPLATE_PATH || './public/template_form_fillable.pdf',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['application/pdf'],
  },

  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    bucket: 'document',
  },

  // Form Configuration
  form: {
    maxTextLength: 1000,
    maxTextareaLength: 5000,
    requiredFields: [
      'patient_insurer_name',
      'patient_insured_fullname',
      'patient_birth_date',
      'patient_payer_id',
      'patient_insured_id',
      'patient_status',
      'patient_facility_id',
      'patient_doctor_id',
      'patient_date'
    ],
  },

  // Notification Configuration
  notification: {
    types: ['email', 'sms', 'push'],
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // UI Configuration
  ui: {
    itemsPerPage: 20,
    searchDebounceMs: 300,
    animationDuration: 200,
  },

  // Development Configuration
  dev: {
    enableLogging: process.env.NODE_ENV === 'development',
    enableDebugMode: process.env.NODE_ENV === 'development',
  },
} as const;

// Type for configuration
export type Config = typeof config;

// Helper function to get configuration value
export const getConfig = <K extends keyof Config>(key: K): Config[K] => {
  return config[key];
};

// Validation function for required environment variables
export const validateConfig = (): { isValid: boolean; missingVars: string[] } => {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'PDF_TEMPLATE_PATH',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  return {
    isValid: missingVars.length === 0,
    missingVars,
  };
};
