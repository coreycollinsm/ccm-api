/**
 * Validates password complexity requirements
 * @returns Object with isValid flag and error message if invalid
 */
export function validatePasswordComplexity(password: string): {
  isValid: boolean;
  error?: string;
} {
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter",
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one number",
    };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one special character",
    };
  }
  return { isValid: true };
}
