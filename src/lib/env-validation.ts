/**
 * Environment Variable Validation System
 * Validates critical environment variables at startup to prevent security issues
 */

interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface EnvVar {
  name: string;
  required: boolean;
  minLength?: number;
  pattern?: RegExp;
  description: string;
  sensitive?: boolean;
}

/**
 * Critical environment variables that must be validated
 */
const ENV_VARIABLES: EnvVar[] = [
  // Authentication & Security
  {
    name: 'NEXTAUTH_SECRET',
    required: true,
    minLength: 32,
    description: 'NextAuth.js secret for JWT signing',
    sensitive: true,
  },
  {
    name: 'NEXTAUTH_URL',
    required: true,
    pattern: /^https?:\/\/.+/,
    description: 'NextAuth.js callback URL',
  },

  // Database
  {
    name: 'DATABASE_URL',
    required: true,
    pattern: /^(postgresql|postgres|file):\/\/.+/,
    description: 'Database connection string',
    sensitive: true,
  },

  // Redis (optional but validated if present)
  {
    name: 'UPSTASH_REDIS_REST_URL',
    required: false,
    pattern: /^https:\/\/.+\.upstash\.io/,
    description: 'Upstash Redis REST URL',
  },
  {
    name: 'UPSTASH_REDIS_REST_TOKEN',
    required: false,
    minLength: 32,
    description: 'Upstash Redis REST token',
    sensitive: true,
  },

  // Payment Gateway
  {
    name: 'RAZORPAY_KEY_ID',
    required: false,
    pattern: /^rzp_(test_|live_)[a-zA-Z0-9]+$/,
    description: 'Razorpay API key ID',
  },
  {
    name: 'RAZORPAY_KEY_SECRET',
    required: false,
    minLength: 24,
    description: 'Razorpay API secret',
    sensitive: true,
  },

  // Sanity CMS
  {
    name: 'NEXT_PUBLIC_SANITY_PROJECT_ID',
    required: true,
    pattern: /^[a-z0-9]+$/,
    description: 'Sanity project ID',
  },
  {
    name: 'NEXT_PUBLIC_SANITY_DATASET',
    required: true,
    description: 'Sanity dataset name',
  },
  {
    name: 'SANITY_API_TOKEN',
    required: false,
    minLength: 40,
    description: 'Sanity API token for write operations',
    sensitive: true,
  },

  // Application
  {
    name: 'NEXT_PUBLIC_APP_URL',
    required: false,
    pattern: /^https?:\/\/.+/,
    description: 'Application public URL',
  },
  {
    name: 'SUPPORT_PHONE',
    required: false,
    pattern: /^\+[1-9]\d{1,14}$/,
    description: 'Support phone number in E.164 format',
  },

  // Development/Monitoring
  {
    name: 'NEXT_PUBLIC_SENTRY_DSN',
    required: false,
    pattern: /^https:\/\/[a-f0-9]+@[o0-9]+\.ingest\.sentry\.io\/[0-9]+$/,
    description: 'Sentry DSN for error monitoring',
  },
];

/**
 * Validate a single environment variable
 */
function validateEnvVar(envVar: EnvVar): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const value = process.env[envVar.name];

  // Check if required variable is missing
  if (envVar.required && !value) {
    errors.push(`Missing required environment variable: ${envVar.name} (${envVar.description})`);
    return { errors, warnings };
  }

  // Skip validation if variable is not set and not required
  if (!value) {
    return { errors, warnings };
  }

  // Validate minimum length
  if (envVar.minLength && value.length < envVar.minLength) {
    errors.push(
      `Environment variable ${envVar.name} must be at least ${envVar.minLength} characters long (current: ${value.length})`
    );
  }

  // Validate pattern
  if (envVar.pattern && !envVar.pattern.test(value)) {
    errors.push(
      `Environment variable ${envVar.name} does not match required pattern (${envVar.description})`
    );
  }

  // Security checks for sensitive variables
  if (envVar.sensitive) {
    // Check for common weak values
    const weakValues = ['test', 'development', 'dev', 'admin', 'password', '123456', 'secret'];
    if (weakValues.some(weak => value.toLowerCase().includes(weak))) {
      warnings.push(
        `Environment variable ${envVar.name} appears to contain weak/test values. Ensure you're using production-grade secrets.`
      );
    }

    // Check for insufficient entropy in secrets
    if (envVar.minLength && value.length >= envVar.minLength) {
      const uniqueChars = new Set(value).size;
      const entropyRatio = uniqueChars / value.length;
      if (entropyRatio < 0.5) {
        warnings.push(
          `Environment variable ${envVar.name} has low entropy. Consider using a stronger secret.`
        );
      }
    }
  }

  return { errors, warnings };
}

/**
 * Validate all environment variables
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Validate each environment variable
  for (const envVar of ENV_VARIABLES) {
    const { errors, warnings } = validateEnvVar(envVar);
    allErrors.push(...errors);
    allWarnings.push(...warnings);
  }

  // Additional cross-variable validation
  const nodeEnv = process.env.NODE_ENV;
  
  // Production-specific checks
  if (nodeEnv === 'production') {
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    if (nextAuthUrl && !nextAuthUrl.startsWith('https://')) {
      allErrors.push('NEXTAUTH_URL must use HTTPS in production');
    }

    // Ensure no test/development values in production
    const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
    if (razorpayKeyId && razorpayKeyId.includes('test')) {
      allErrors.push('Cannot use test Razorpay keys in production');
    }

    // Check for strong NextAuth secret in production
    const nextAuthSecret = process.env.NEXTAUTH_SECRET;
    if (nextAuthSecret && nextAuthSecret.length < 64) {
      allWarnings.push('NEXTAUTH_SECRET should be at least 64 characters in production for maximum security');
    }
  }

  // Development-specific warnings
  if (nodeEnv === 'development') {
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    if (nextAuthUrl && nextAuthUrl.startsWith('https://') && !nextAuthUrl.includes('localhost')) {
      allWarnings.push('Using HTTPS URL in development. Make sure this is intentional.');
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Log validation results with appropriate formatting
 */
export function logValidationResults(result: EnvValidationResult): void {
  if (result.isValid) {
    console.log('✅ Environment variable validation passed');
  } else {
    console.error('❌ Environment variable validation failed');
  }

  // Log errors
  if (result.errors.length > 0) {
    console.error('\n🚨 Critical Issues:');
    result.errors.forEach(error => console.error(`  • ${error}`));
  }

  // Log warnings
  if (result.warnings.length > 0) {
    console.warn('\n⚠️  Warnings:');
    result.warnings.forEach(warning => console.warn(`  • ${warning}`));
  }

  if (!result.isValid) {
    console.error('\n💡 Fix the above issues before starting the application.');
    console.error('📖 Refer to env.example for configuration guidance.');
  }
}

/**
 * Validate environment and exit if critical issues found
 */
export function validateAndExit(): void {
  const result = validateEnvironmentVariables();
  logValidationResults(result);

  if (!result.isValid) {
    console.error('\n🛑 Application startup aborted due to environment validation failures.');
    process.exit(1);
  }
}

/**
 * Get a summary of environment configuration (safe for logging)
 */
export function getEnvSummary(): Record<string, string> {
  const summary: Record<string, string> = {};
  
  for (const envVar of ENV_VARIABLES) {
    const value = process.env[envVar.name];
    if (value) {
      if (envVar.sensitive) {
        // Show only first few characters for sensitive vars
        summary[envVar.name] = value.substring(0, 4) + '****';
      } else {
        summary[envVar.name] = value;
      }
    } else {
      summary[envVar.name] = 'not set';
    }
  }

  return summary;
} 