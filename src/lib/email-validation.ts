import { z } from "zod";

/**
 * Comprehensive Email Validation System
 * Provides consistent email validation across all endpoints and components
 * Implements multiple validation levels for different use cases
 */

/**
 * RFC 5322 compliant email regex (simplified but robust)
 * More comprehensive than basic patterns while remaining practical
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

/**
 * Stricter email regex for high-security contexts
 * Excludes some edge cases that might be problematic
 */
export const STRICT_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Common email validation rules
 */
export const EMAIL_VALIDATION_RULES = {
  MAX_LENGTH: 254, // RFC 5321 limit
  MIN_LENGTH: 5,   // Minimum reasonable email length (a@b.c)
  MAX_LOCAL_PART: 64, // RFC 5321 limit for local part (before @)
  MAX_DOMAIN_PART: 253, // RFC 5321 limit for domain part (after @)
} as const;

/**
 * Disposable email domains to block (common temporary email services)
 */
export const DISPOSABLE_EMAIL_DOMAINS = new Set([
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'temp-mail.org',
  'throwaway.email',
  'tempmail.email',
  'yopmail.com',
  'maildrop.cc',
  'dispostable.com',
  'fakeinbox.com',
  'jetable.org',
  'mailnesia.com',
  'sharklasers.com',
  'grr.la',
  'guerrillamailblock.com',
  'pokemail.net',
  'spam4.me',
  'tempail.com',
  'tempemail.com',
  'tempr.email',
  'trashmail.com',
  'mohmal.com',
  'email-generator.org'
]);

/**
 * Email validation result interface
 */
export interface EmailValidationResult {
  isValid: boolean;
  email?: string; // Normalized email if valid
  errors: string[];
  warnings: string[];
  metadata: {
    localPart: string;
    domain: string;
    isDisposable: boolean;
    isInternational: boolean;
    hasValidMx?: boolean; // For future MX record validation
  };
}

/**
 * Email validation options
 */
export interface EmailValidationOptions {
  strict?: boolean;           // Use strict validation rules
  allowDisposable?: boolean;  // Allow disposable email domains
  normalize?: boolean;        // Normalize email (lowercase, trim)
  checkMx?: boolean;         // Check MX records (for future implementation)
  maxLength?: number;        // Override max length
  minLength?: number;        // Override min length
}

/**
 * Basic email format validation
 */
export function isValidEmailFormat(email: string, strict: boolean = false): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const regex = strict ? STRICT_EMAIL_REGEX : EMAIL_REGEX;
  return regex.test(email.trim());
}

/**
 * Check if email domain is disposable
 */
export function isDisposableEmail(email: string): boolean {
  try {
    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? DISPOSABLE_EMAIL_DOMAINS.has(domain) : false;
  } catch {
    return false;
  }
}

/**
 * Normalize email address
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Parse email into local and domain parts
 */
export function parseEmail(email: string): { localPart: string; domain: string } | null {
  try {
    const normalized = normalizeEmail(email);
    const atIndex = normalized.lastIndexOf('@');
    
    if (atIndex <= 0 || atIndex === normalized.length - 1) {
      return null;
    }

    return {
      localPart: normalized.substring(0, atIndex),
      domain: normalized.substring(atIndex + 1)
    };
  } catch {
    return null;
  }
}

/**
 * Comprehensive email validation with detailed results
 */
export function validateEmail(
  email: string, 
  options: EmailValidationOptions = {}
): EmailValidationResult {
  const {
    strict = false,
    allowDisposable = false,
    normalize = true,
    maxLength = EMAIL_VALIDATION_RULES.MAX_LENGTH,
    minLength = EMAIL_VALIDATION_RULES.MIN_LENGTH
  } = options;

  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic input validation
  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
    return {
      isValid: false,
      errors,
      warnings,
      metadata: {
        localPart: '',
        domain: '',
        isDisposable: false,
        isInternational: false
      }
    };
  }

  const trimmedEmail = email.trim();
  
  // Length validation
  if (trimmedEmail.length < minLength) {
    errors.push(`Email must be at least ${minLength} characters long`);
  }
  
  if (trimmedEmail.length > maxLength) {
    errors.push(`Email must be no more than ${maxLength} characters long`);
  }

  // Format validation
  if (!isValidEmailFormat(trimmedEmail, strict)) {
    errors.push('Email format is invalid');
    return {
      isValid: false,
      errors,
      warnings,
      metadata: {
        localPart: '',
        domain: '',
        isDisposable: false,
        isInternational: false
      }
    };
  }

  // Parse email parts
  const parsed = parseEmail(trimmedEmail);
  if (!parsed) {
    errors.push('Unable to parse email address');
    return {
      isValid: false,
      errors,
      warnings,
      metadata: {
        localPart: '',
        domain: '',
        isDisposable: false,
        isInternational: false
      }
    };
  }

  const { localPart, domain } = parsed;

  // Validate local part length
  if (localPart.length > EMAIL_VALIDATION_RULES.MAX_LOCAL_PART) {
    errors.push(`Email local part (before @) is too long (max ${EMAIL_VALIDATION_RULES.MAX_LOCAL_PART} characters)`);
  }

  // Validate domain part length
  if (domain.length > EMAIL_VALIDATION_RULES.MAX_DOMAIN_PART) {
    errors.push(`Email domain part (after @) is too long (max ${EMAIL_VALIDATION_RULES.MAX_DOMAIN_PART} characters)`);
  }

  // Check for disposable email
  const isDisposable = isDisposableEmail(trimmedEmail);
  if (isDisposable && !allowDisposable) {
    errors.push('Disposable email addresses are not allowed');
  } else if (isDisposable) {
    warnings.push('This appears to be a disposable email address');
  }

  // Check for international characters
  const isInternational = !/^[\x00-\x7F]*$/.test(trimmedEmail);
  if (isInternational && strict) {
    errors.push('International characters are not allowed in strict mode');
  }

  // Common problematic patterns
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    errors.push('Email local part cannot start or end with a period');
  }

  if (localPart.includes('..')) {
    errors.push('Email local part cannot contain consecutive periods');
  }

  // Domain validation
  if (domain.startsWith('-') || domain.endsWith('-')) {
    errors.push('Email domain cannot start or end with a hyphen');
  }

  if (!domain.includes('.')) {
    errors.push('Email domain must contain at least one period');
  }

  const domainParts = domain.split('.');
  if (domainParts.some(part => part.length === 0)) {
    errors.push('Email domain cannot have empty parts');
  }

  // TLD validation
  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2) {
    errors.push('Email domain top-level domain must be at least 2 characters');
  }

  const normalizedEmail = normalize ? normalizeEmail(trimmedEmail) : trimmedEmail;

  return {
    isValid: errors.length === 0,
    email: errors.length === 0 ? normalizedEmail : undefined,
    errors,
    warnings,
    metadata: {
      localPart,
      domain,
      isDisposable,
      isInternational
    }
  };
}

/**
 * Simple email validation (returns boolean)
 */
export function isValidEmail(email: string, strict: boolean = false): boolean {
  const result = validateEmail(email, { strict });
  return result.isValid;
}

/**
 * Zod email validation schema (standard)
 */
export const emailSchema = z.string()
  .min(EMAIL_VALIDATION_RULES.MIN_LENGTH, `Email must be at least ${EMAIL_VALIDATION_RULES.MIN_LENGTH} characters`)
  .max(EMAIL_VALIDATION_RULES.MAX_LENGTH, `Email must be no more than ${EMAIL_VALIDATION_RULES.MAX_LENGTH} characters`)
  .refine((email) => isValidEmailFormat(email), {
    message: "Invalid email format"
  })
  .transform((email) => normalizeEmail(email));

/**
 * Zod email validation schema (strict)
 */
export const strictEmailSchema = z.string()
  .min(EMAIL_VALIDATION_RULES.MIN_LENGTH, `Email must be at least ${EMAIL_VALIDATION_RULES.MIN_LENGTH} characters`)
  .max(EMAIL_VALIDATION_RULES.MAX_LENGTH, `Email must be no more than ${EMAIL_VALIDATION_RULES.MAX_LENGTH} characters`)
  .refine((email) => isValidEmailFormat(email, true), {
    message: "Invalid email format"
  })
  .refine((email) => !isDisposableEmail(email), {
    message: "Disposable email addresses are not allowed"
  })
  .transform((email) => normalizeEmail(email));

/**
 * Zod email validation schema (optional)
 */
export const optionalEmailSchema = emailSchema.optional();

/**
 * Zod email validation schema (strict, optional)
 */
export const strictOptionalEmailSchema = strictEmailSchema.optional();

/**
 * Email validation for API endpoints
 */
export function validateEmailForAPI(
  email: string, 
  strict: boolean = false
): { valid: boolean; email?: string; error?: string } {
  const result = validateEmail(email, { strict, normalize: true });
  
  if (!result.isValid) {
    return {
      valid: false,
      error: result.errors[0] || 'Invalid email address'
    };
  }

  return {
    valid: true,
    email: result.email
  };
}

/**
 * Security-focused email validation for sensitive operations
 */
export function validateEmailForSensitiveOps(email: string): EmailValidationResult {
  return validateEmail(email, {
    strict: true,
    allowDisposable: false,
    normalize: true
  });
} 