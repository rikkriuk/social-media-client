"use client";

import * as React from "react";
import { cn } from "./utils";
import { Label } from "./label";

// Built-in patterns
const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  alphanumeric: /^[a-zA-Z0-9]+$/,
  numeric: /^[0-9]+$/,
};

type PatternType = keyof typeof PATTERNS;

export type ValidationRule = {
  required?: boolean;
  message?: string;
  pattern?: RegExp | PatternType;
  min?: number;
  max?: number;
  validator?: (value: string) => boolean;
};

type FormItemProps = {
  label?: string;
  name: string;
  rules?: ValidationRule[];
  error?: string;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  type?: PatternType;
};

type FormItemContextType = {
  error: string | null;
  name: string;
  validateField: (value: string) => string | null;
};

const FormItemContext = React.createContext<FormItemContextType | null>(null);

export const useFormItem = () => {
  const context = React.useContext(FormItemContext);
  return context;
};

const getPattern = (pattern: RegExp | PatternType): RegExp => {
  if (typeof pattern === "string") {
    return PATTERNS[pattern];
  }
  return pattern;
};

// Default error messages for pattern types
const getPatternErrorMessage = (type: PatternType, label: string): string => {
  const messages: Record<PatternType, string> = {
    email: `Please enter a valid email address`,
    phone: `Please enter a valid phone number`,
    url: `Please enter a valid URL`,
    alphanumeric: `${label} must contain only letters and numbers`,
    numeric: `${label} must contain only numbers`,
  };
  return messages[type];
};

const FormItem = ({
  label,
  name,
  rules = [],
  error: externalError,
  children,
  className,
  labelClassName,
  required,
  type,
}: FormItemProps) => {
  const [internalError, setInternalError] = React.useState<string | null>(null);

  const displayError = externalError || internalError;

  const allRules = React.useMemo(() => {
    const combinedRules: ValidationRule[] = [];

    if (required) {
      combinedRules.push({ required: true, message: `${label || name} is required` });
    }

    if (type && PATTERNS[type]) {
      combinedRules.push({
        pattern: type,
        message: getPatternErrorMessage(type, label || name),
      });
    }

    combinedRules.push(...rules);

    return combinedRules;
  }, [required, type, rules, label, name]);

  const validateField = React.useCallback(
    (value: string): string | null => {
      for (const rule of allRules) {
        if (rule.required && (!value || value.trim() === "")) {
          return rule.message || `${label || name} is required`;
        }

        if (!value) continue;

        if (rule.pattern) {
          const regex = getPattern(rule.pattern);
          if (!regex.test(value)) {
            if (typeof rule.pattern === "string") {
              return rule.message || getPatternErrorMessage(rule.pattern, label || name);
            }
            return rule.message || `${label || name} format is invalid`;
          }
        }

        if (rule.min !== undefined && value.length < rule.min) {
          return rule.message || `${label || name} must be at least ${rule.min} characters`;
        }

        if (rule.max !== undefined && value.length > rule.max) {
          return rule.message || `${label || name} must be at most ${rule.max} characters`;
        }

        if (rule.validator && !rule.validator(value)) {
          return rule.message || `${label || name} is invalid`;
        }
      }
      return null;
    },
    [allRules, label, name]
  );

  const handleValidation = React.useCallback(
    (value: string) => {
      const errorMsg = validateField(value);
      setInternalError(errorMsg);
      return errorMsg;
    },
    [validateField]
  );

  const enhancedChild = React.cloneElement(children, {
    id: name,
    name: name,
    "aria-invalid": !!displayError,
    "aria-describedby": displayError ? `${name}-error` : undefined,
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      handleValidation(e.target.value);
      const childOnBlur = children.props.onBlur as ((e: React.FocusEvent<HTMLInputElement>) => void) | undefined;
      childOnBlur?.(e);
    },
    className: cn(
      children.props.className,
      displayError && "border-red-500 focus-visible:ring-red-300"
    ),
  });

  const contextValue = React.useMemo(
    () => ({
      error: displayError,
      name,
      validateField,
    }),
    [displayError, name, validateField]
  );

  const isRequired = required || allRules.some((r) => r.required);

  return (
    <FormItemContext.Provider value={contextValue}>
      <div className={cn("space-y-1", className)}>
        {label && (
          <Label htmlFor={name} className={cn(labelClassName)}>
            {label}
            {isRequired && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        {enhancedChild}
        {displayError && (
          <p
            id={`${name}-error`}
            className="text-red-500 text-sm mt-1 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            {displayError}
          </p>
        )}
      </div>
    </FormItemContext.Provider>
  );
};

export { FormItem };
