'use client';

import * as React from "react";
import { useState } from "react";
import { Input } from "./input";
import { cn } from "./utils";
import { validatePassword, ValidationResult } from "@/helpers/validation";

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, 'type'> {
  inputType?: "danger" | "normal";
  showValidation?: boolean;
  validationMessages?: {
    minLength?: string;
    specialChar?: string;
  };
  onValidationChange?: (result: ValidationResult) => void;
  errorMessage?: string;
}

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const PasswordInput = ({
  className,
  inputType,
  showValidation = false,
  validationMessages,
  onValidationChange,
  onChange,
  value,
  errorMessage,
  ...props
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: [] });
  const [hasTyped, setHasTyped] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!hasTyped && newValue.length > 0) {
      setHasTyped(true);
    }

    if (showValidation) {
      const result = validatePassword(newValue);
      setValidation(result);
      onValidationChange?.(result);
    }

    onChange?.(e);
  };

  const hasValidationError = showValidation && hasTyped && !validation.isValid;
  const hasExternalError = !!errorMessage;
  const hasError = hasValidationError || hasExternalError;
  const showValidationErrors = showValidation && hasTyped && validation.errors.length > 0;

  return (
    <div className="w-full">
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          inputType={hasError ? "danger" : inputType}
          className={cn("pr-10", className)}
          onChange={handleChange}
          value={value}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {showValidationErrors && value && (
        <ul className="mt-1.5 space-y-0.5">
          {validation.errors.map((error) => (
            <li key={error} className="text-xs text-red-500 flex items-center gap-1">
              <span>•</span>
              <span>{validationMessages?.[error as keyof typeof validationMessages] || error}</span>
            </li>
          ))}
        </ul>
      )}

      {hasExternalError && !showValidationErrors && (
        <p className="text-xs text-red-500 mt-1.5">{errorMessage}</p>
      )}
    </div>
  );
};

export { PasswordInput };
