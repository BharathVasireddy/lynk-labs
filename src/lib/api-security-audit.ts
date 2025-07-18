/**
 * API Security Audit Utility
 * Helps identify security vulnerabilities in API endpoints
 */

export interface SecurityAuditResult {
  endpoint: string;
  method: string;
  issues: SecurityIssue[];
  score: number; // 0-100, higher is better
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface SecurityIssue {
  type: 'MISSING_AUTH' | 'INCONSISTENT_AUTH' | 'MISSING_RATE_LIMIT' | 'MISSING_INPUT_VALIDATION' | 'INSUFFICIENT_AUTHORIZATION' | 'SENSITIVE_DATA_EXPOSURE' | 'MISSING_CSRF_PROTECTION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  recommendation: string;
}

/**
 * Security requirements matrix for different endpoint categories
 */
const SECURITY_REQUIREMENTS = {
  PUBLIC: {
    requiresAuth: false,
    requiresRateLimit: true,
    allowedMethods: ['GET'],
    examples: ['/api/status', '/api/health', '/api/categories', '/api/tests', '/api/packages']
  },
  USER_DATA: {
    requiresAuth: true,
    requiresRateLimit: true,
    requiresOwnershipCheck: true,
    allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    examples: ['/api/orders', '/api/addresses', '/api/cart', '/api/auth/profile']
  },
  ADMIN_ONLY: {
    requiresAuth: true,
    requiresAdminRole: true,
    requiresRateLimit: true,
    allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    examples: ['/api/admin/*']
  },
  SENSITIVE_OPERATIONS: {
    requiresAuth: true,
    requiresRateLimit: true,
    requiresSecureHeaders: true,
    requiresInputValidation: true,
    allowedMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],
    examples: ['/api/payments/*', '/api/auth/*']
  },
  AGENT_ONLY: {
    requiresAuth: true,
    requiresAgentRole: true,
    requiresRateLimit: true,
    allowedMethods: ['GET', 'POST', 'PUT', 'PATCH'],
    examples: ['/api/agent/*']
  }
};

/**
 * Known secure endpoints (publicly accessible by design)
 */
const SECURE_PUBLIC_ENDPOINTS = [
  '/api/status',
  '/api/health',
  '/api/categories',
  '/api/tests',
  '/api/packages',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
  '/api/auth/[...nextauth]'
];

/**
 * Endpoints that should require authentication
 */
const PROTECTED_ENDPOINTS = [
  '/api/orders',
  '/api/addresses',
  '/api/cart',
  '/api/user/*',
  '/api/auth/me',
  '/api/auth/profile',
  '/api/auth/complete-profile',
  '/api/payments/*',
  '/api/checkout/*',
  '/api/coupons/*',
  '/api/admin/*',
  '/api/agent/*',
  '/api/cron/*'
];

/**
 * Admin-only endpoints
 */
const ADMIN_ONLY_ENDPOINTS = [
  '/api/admin/*',
  '/api/cron/*'
];

/**
 * Agent-only endpoints
 */
const AGENT_ONLY_ENDPOINTS = [
  '/api/agent/*'
];

/**
 * Audit an API endpoint for security issues
 */
export function auditEndpoint(
  endpoint: string,
  method: string,
  hasAuth: boolean,
  hasRateLimit: boolean,
  hasRoleCheck: boolean,
  hasInputValidation: boolean,
  hasOwnershipCheck: boolean
): SecurityAuditResult {
  const issues: SecurityIssue[] = [];
  let score = 100;

  // Check if endpoint should be protected
  const shouldBeProtected = PROTECTED_ENDPOINTS.some(pattern =>
    endpoint.includes(pattern.replace('/*', ''))
  );

  const isAdminOnly = ADMIN_ONLY_ENDPOINTS.some(pattern =>
    endpoint.includes(pattern.replace('/*', ''))
  );

  const isAgentOnly = AGENT_ONLY_ENDPOINTS.some(pattern =>
    endpoint.includes(pattern.replace('/*', ''))
  );

  const isPublic = SECURE_PUBLIC_ENDPOINTS.some(pattern =>
    endpoint.includes(pattern.replace('/*', ''))
  );

  // Check authentication requirements
  if (shouldBeProtected && !hasAuth) {
    issues.push({
      type: 'MISSING_AUTH',
      severity: 'CRITICAL',
      description: 'Endpoint requires authentication but has none',
      recommendation: 'Add verifyAuth() check at the beginning of the handler'
    });
    score -= 40;
  }

  // Check authorization requirements
  if (isAdminOnly && !hasRoleCheck) {
    issues.push({
      type: 'INSUFFICIENT_AUTHORIZATION',
      severity: 'CRITICAL',
      description: 'Admin endpoint missing role verification',
      recommendation: 'Add user.role !== "ADMIN" check after authentication'
    });
    score -= 35;
  }

  if (isAgentOnly && !hasRoleCheck) {
    issues.push({
      type: 'INSUFFICIENT_AUTHORIZATION',
      severity: 'CRITICAL',
      description: 'Agent endpoint missing role verification',
      recommendation: 'Add user.role !== "HOME_VISIT_AGENT" check after authentication'
    });
    score -= 35;
  }

  // Check rate limiting
  if (!hasRateLimit && !isPublic) {
    issues.push({
      type: 'MISSING_RATE_LIMIT',
      severity: 'HIGH',
      description: 'Endpoint missing rate limiting protection',
      recommendation: 'Add rate limiting using checkRateLimit() or specialized auth rate limiters'
    });
    score -= 20;
  }

  // Check input validation for state-changing methods
  if (['POST', 'PUT', 'PATCH'].includes(method) && !hasInputValidation) {
    issues.push({
      type: 'MISSING_INPUT_VALIDATION',
      severity: 'HIGH',
      description: 'State-changing endpoint missing input validation',
      recommendation: 'Add Zod schema validation for request body'
    });
    score -= 15;
  }

  // Check ownership verification for user data endpoints
  if (shouldBeProtected && !isAdminOnly && !hasOwnershipCheck && ['GET', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    issues.push({
      type: 'INSUFFICIENT_AUTHORIZATION',
      severity: 'HIGH',
      description: 'User data endpoint missing ownership verification',
      recommendation: 'Verify that the resource belongs to the authenticated user'
    });
    score -= 25;
  }

  // Determine overall severity
  const criticalIssues = issues.filter(i => i.severity === 'CRITICAL').length;
  const highIssues = issues.filter(i => i.severity === 'HIGH').length;

  let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  if (criticalIssues > 0) {
    severity = 'CRITICAL';
  } else if (highIssues > 1) {
    severity = 'HIGH';
  } else if (highIssues > 0 || issues.length > 2) {
    severity = 'MEDIUM';
  } else {
    severity = 'LOW';
  }

  return {
    endpoint,
    method,
    issues,
    score: Math.max(0, score),
    severity
  };
}

/**
 * Security best practices checklist
 */
export const SECURITY_CHECKLIST = [
  {
    category: 'Authentication',
    items: [
      'All sensitive endpoints use verifyAuth() for consistent authentication',
      'JWT tokens are properly validated and checked against blacklist',
      'Authentication errors return appropriate HTTP status codes (401/403)',
      'No hardcoded credentials or test passwords in production code'
    ]
  },
  {
    category: 'Authorization',
    items: [
      'Admin endpoints verify user.role === "ADMIN"',
      'Agent endpoints verify user.role === "HOME_VISIT_AGENT"',
      'User data endpoints verify resource ownership',
      'Cross-user data access is prevented'
    ]
  },
  {
    category: 'Rate Limiting',
    items: [
      'All endpoints have appropriate rate limiting',
      'Authentication endpoints use stricter rate limits',
      'Rate limit headers are included in responses',
      'Different rate limits for different user roles'
    ]
  },
  {
    category: 'Input Validation',
    items: [
      'All input data is validated using Zod schemas',
      'File uploads have proper validation and limits',
      'SQL injection prevention through parameterized queries',
      'XSS prevention through proper input sanitization'
    ]
  },
  {
    category: 'Data Protection',
    items: [
      'Sensitive data (passwords, tokens) are properly hashed/encrypted',
      'PII data is masked in logs and error messages',
      'Database transactions are used for multi-step operations',
      'Proper error handling without information disclosure'
    ]
  },
  {
    category: 'Security Headers',
    items: [
      'Secure cookie settings (HttpOnly, Secure, SameSite)',
      'HTTPS enforcement in production',
      'Content Security Policy headers',
      'Proper CORS configuration'
    ]
  }
];

/**
 * Generate a security report summary
 */
export function generateSecurityReport(auditResults: SecurityAuditResult[]): {
  overall: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL_ISSUES';
  score: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  recommendations: string[];
} {
  const criticalCount = auditResults.filter(r => r.severity === 'CRITICAL').length;
  const highCount = auditResults.filter(r => r.severity === 'HIGH').length;
  const mediumCount = auditResults.filter(r => r.severity === 'MEDIUM').length;
  const lowCount = auditResults.filter(r => r.severity === 'LOW').length;

  const averageScore = auditResults.reduce((sum, r) => sum + r.score, 0) / auditResults.length;

  let overall: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL_ISSUES';
  if (criticalCount > 0) {
    overall = 'CRITICAL_ISSUES';
  } else if (highCount > 3 || averageScore < 70) {
    overall = 'NEEDS_IMPROVEMENT';
  } else if (averageScore >= 90) {
    overall = 'EXCELLENT';
  } else {
    overall = 'GOOD';
  }

  // Generate top recommendations
  const allIssues = auditResults.flatMap(r => r.issues);
  const issuesByType = allIssues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recommendations = Object.entries(issuesByType)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([type, count]) => {
      const issue = allIssues.find(i => i.type === type);
      return `${issue?.recommendation} (Found in ${count} endpoint${count > 1 ? 's' : ''})`;
    });

  return {
    overall,
    score: Math.round(averageScore),
    criticalCount,
    highCount,
    mediumCount,
    lowCount,
    recommendations
  };
} 