/**
 * Application Startup Validation
 * Runs critical security checks before the application starts
 */

import { validateAndExit, getEnvSummary } from './env-validation';

/**
 * Run all startup validations
 */
export function runStartupValidation(): void {
  console.log('🔍 Running application startup validation...');
  
  try {
    // Validate environment variables
    validateAndExit();
    
    // Log environment summary (safe for production)
    const envSummary = getEnvSummary();
    console.log('📋 Environment Configuration:');
    Object.entries(envSummary).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    
    console.log('✅ Startup validation completed successfully');
    
  } catch (error) {
    console.error('💥 Startup validation failed:', error);
    process.exit(1);
  }
}

// Auto-run validation in production and when explicitly enabled
const shouldValidate = 
  process.env.NODE_ENV === 'production' || 
  process.env.ENABLE_STARTUP_VALIDATION === 'true';

if (shouldValidate) {
  runStartupValidation();
} 