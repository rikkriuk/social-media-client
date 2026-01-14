"use client";

import React, { useEffect, useRef, useState } from "react";

interface Props {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

export default function OtpInputs({ length = 6, value = "", onChange, onComplete }: Props) {
  const [digits, setDigits] = useState<string[]>(() => {
    const arr = new Array(length).fill("");
    for (let i = 0; i < Math.min(value.length, length); i++) arr[i] = value[i];
    return arr;
  });

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const lastEmittedRef = useRef("");
  const lastValueRef = useRef<string>(value);

  useEffect(() => {
    const val = value || "";
    const joined = digits.join("");

    if (val !== joined) {
      const arr = new Array(length).fill("");
      for (let i = 0; i < Math.min(val.length, length); i++) {
        arr[i] = val[i];
      }
      setDigits(arr);
    }

    lastValueRef.current = val;
  }, [value, length]);

  useEffect(() => {
    const joined = digits.join("");

    if (joined !== lastEmittedRef.current) {
      lastEmittedRef.current = joined;
      onChange?.(joined);
    }

    if (joined.length === length) {
      onComplete?.(joined);
    }
  }, [digits, length, onChange, onComplete]);

  const focusInput = (index: number) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const handleChange = (val: string, idx: number) => {
    if (!val) return;
    const char = val.replace(/[^0-9]/g, "").slice(0, 1);
    if (!char) return;

    setDigits((prev) => {
      const next = [...prev];
      next[idx] = char;
      return next;
    });

    if (idx < length - 1) focusInput(idx + 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    const key = e.key;
    const el = e.currentTarget;
    if (key === "Backspace") {
      if (el.value === "" || el.selectionStart === 0) {
        setDigits((prev) => {
          const next = [...prev];
          if (next[idx]) {
            next[idx] = "";
          } else if (idx > 0) {
            next[idx - 1] = "";
          }
          return next;
        });
        if (idx > 0) focusInput(idx - 1);
      } else {
        setDigits((prev) => {
          const next = [...prev];
          next[idx] = "";
          return next;
        });
      }
      e.preventDefault();
    } else if (key === "ArrowLeft") {
      if (idx > 0) focusInput(idx - 1);
      e.preventDefault();
    } else if (key === "ArrowRight") {
      if (idx < length - 1) focusInput(idx + 1);
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("Text").replace(/[^0-9]/g, "");
    if (!text) return;
    const chars = text.slice(0, length).split("");

    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < chars.length; i++) {
        next[i] = chars[i];
      }
      return next;
    });

    const firstEmpty = chars.length < length ? chars.length : length - 1;
    focusInput(firstEmpty);
  };

  return (
    <div className="flex gap-3 justify-center">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          inputMode="numeric"
          pattern="[0-9]*"
          type="text"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          aria-label={`otp-digit-${i + 1}`}
        />
      ))}
    </div>
  );
}
