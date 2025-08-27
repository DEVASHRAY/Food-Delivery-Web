import { EMAIL_REGEX, MOBILE_REGEX } from './regex.js';

export const isValidEmail = (email?: string) =>
  !!email && EMAIL_REGEX.test(email.trim());

export function normalizeMobile(input?: string): string | null {
  if (!input) return null;

  let digits = input.replace(MOBILE_REGEX, '');

  if (digits.startsWith('0091')) digits = digits.slice(4);
  else if (digits.startsWith('091')) digits = digits.slice(3);
  else if (digits.startsWith('91') && digits.length > 10)
    digits = digits.slice(2);

  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);

  return MOBILE_REGEX.test(digits) ? digits : null;
}

export const isValidMobileNumber = (input?: string) =>
  normalizeMobile(input) !== null;
