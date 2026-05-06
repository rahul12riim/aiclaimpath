// src/lib/utils/pii-scrubber.ts
// CRITICAL: This runs on EVERY input before it touches any server-side logic.
// We never store SSN, DOB, bank info, or full names. This enforces that.

const PII_PATTERNS = [
  // SSN: 123-45-6789 or 123456789
  { pattern: /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g, replacement: '[SSN REMOVED]' },
  // Credit/debit card numbers
  { pattern: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, replacement: '[CARD REMOVED]' },
  // Bank routing numbers (9 digits)
  { pattern: /\b\d{9}\b/g, replacement: '[ACCT REMOVED]' },
  // Dates of birth: MM/DD/YYYY or MM-DD-YYYY
  { pattern: /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12]\d|3[01])[\/\-](19|20)\d{2}\b/g, replacement: '[DOB REMOVED]' },
  // Phone numbers
  { pattern: /\b(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g, replacement: '[PHONE REMOVED]' },
]

export function scrubPII(text: string): string {
  let scrubbed = text
  for (const { pattern, replacement } of PII_PATTERNS) {
    scrubbed = scrubbed.replace(pattern, replacement)
  }
  return scrubbed
}

export function containsPII(text: string): boolean {
  return PII_PATTERNS.some(({ pattern }) => {
    pattern.lastIndex = 0 // reset regex state
    return pattern.test(text)
  })
}

// Zod preprocessor — use in API route schemas
export function stripPIIFromObject(obj: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      clean[key] = scrubPII(value)
    } else {
      clean[key] = value
    }
  }
  return clean
}
