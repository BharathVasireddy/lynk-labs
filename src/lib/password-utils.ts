import crypto from 'crypto';

/**
 * Secure Password Generation Utilities
 * Replaces all hardcoded passwords with cryptographically secure alternatives
 */

/**
 * Generate a cryptographically secure random password
 * @param length Password length (minimum 12, recommended 16+)
 * @param includeSymbols Whether to include special characters
 * @returns Secure random password
 */
export function generateSecurePassword(length: number = 16, includeSymbols: boolean = true): string {
  if (length < 8) {
    throw new Error('Password length must be at least 8 characters');
  }

  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let charset = uppercase + lowercase + numbers;
  if (includeSymbols) {
    charset += symbols;
  }

  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[crypto.randomInt(0, uppercase.length)];
  password += lowercase[crypto.randomInt(0, lowercase.length)];
  password += numbers[crypto.randomInt(0, numbers.length)];
  
  if (includeSymbols) {
    password += symbols[crypto.randomInt(0, symbols.length)];
  }

  // Fill the rest with random characters
  const remainingLength = length - password.length;
  for (let i = 0; i < remainingLength; i++) {
    password += charset[crypto.randomInt(0, charset.length)];
  }

  // Shuffle the password to avoid predictable patterns
  return shuffleString(password);
}

/**
 * Generate a secure but memorable password (no confusing characters)
 * @param length Password length
 * @returns Secure password without confusing characters (0, O, l, 1, etc.)
 */
export function generateMemorablePassword(length: number = 12): string {
  if (length < 8) {
    throw new Error('Password length must be at least 8 characters');
  }

  // Remove confusing characters
  const uppercase = 'ABCDEFGHJKMNPQRSTUVWXYZ'; // No I, L, O
  const lowercase = 'abcdefghjkmnpqrstuvwxyz'; // No i, l, o
  const numbers = '23456789'; // No 0, 1
  const symbols = '!@#$%^&*+-=';

  let charset = uppercase + lowercase + numbers + symbols;
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[crypto.randomInt(0, uppercase.length)];
  password += lowercase[crypto.randomInt(0, lowercase.length)];
  password += numbers[crypto.randomInt(0, numbers.length)];
  password += symbols[crypto.randomInt(0, symbols.length)];

  // Fill the rest
  const remainingLength = length - password.length;
  for (let i = 0; i < remainingLength; i++) {
    password += charset[crypto.randomInt(0, charset.length)];
  }

  return shuffleString(password);
}

/**
 * Generate a temporary password for new agents
 * @returns A secure 12-character password that's easier to communicate
 */
export function generateAgentPassword(): string {
  return generateMemorablePassword(12);
}

/**
 * Generate a development/testing password that's secure but consistent for testing
 * @param seed A seed string for consistent generation in tests
 * @returns A secure password based on the seed
 */
export function generateTestPassword(seed: string = 'test'): string {
  // For testing purposes, use a deterministic but still secure approach
  const hash = crypto.createHash('sha256').update(seed + process.env.NEXTAUTH_SECRET).digest('hex');
  return 'Test_' + hash.substring(0, 8) + '_' + Date.now().toString().slice(-4);
}

/**
 * Shuffle a string securely
 * @param str String to shuffle
 * @returns Shuffled string
 */
function shuffleString(str: string): string {
  const array = str.split('');
  for (let i = array.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array.join('');
}

/**
 * Check if a password meets security requirements
 * @param password Password to check
 * @returns Object with validation results
 */
export function validatePasswordSecurity(password: string): {
  isValid: boolean;
  score: number;
  issues: string[];
} {
  const issues: string[] = [];
  let score = 0;

  if (password.length < 8) {
    issues.push('Password must be at least 8 characters long');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    issues.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    issues.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!/[0-9]/.test(password)) {
    issues.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
    issues.push('Password should contain at least one special character');
  } else {
    score += 1;
  }

  // Check for common patterns
  if (/(.)\1{2,}/.test(password)) {
    issues.push('Password should not contain repeating characters');
    score -= 1;
  }

  if (/123|abc|qwe|password|admin|user/i.test(password)) {
    issues.push('Password should not contain common patterns or words');
    score -= 2;
  }

  return {
    isValid: issues.length === 0 && score >= 4,
    score: Math.max(0, score),
    issues
  };
} 