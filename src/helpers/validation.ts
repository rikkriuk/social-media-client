export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (password.length < 7) {
    errors.push('minLength');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('specialChar');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
