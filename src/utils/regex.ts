// RFC 5322-ish email regex (good enough for server-side)
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Indian phone number regex (10 digits, starts with 6–9)
// ⚠️ This is *after* stripping +91 / 0 prefixes.
export const MOBILE_REGEX = /^[6-9]\d{9}$/;

// Optional: reusable helpers for trimming non-digits
export const DIGIT_ONLY_REGEX = /\D+/g;
