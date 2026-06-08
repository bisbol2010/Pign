"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { CloseIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

type EmailChipInputProps = {
  emails: string[];
  onChange: (emails: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function EmailChipInput({
  emails,
  onChange,
  placeholder = "Enter email address...",
  disabled = false,
}: EmailChipInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const addEmails = (rawInput: string) => {
    setError(null);
    // Split on separators: comma, semicolon, space, newline
    const candidateEmails = rawInput
      .split(/[,\s;]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e !== "");

    if (candidateEmails.length === 0) return;

    const validEmails: string[] = [];
    const invalidEmails: string[] = [];

    for (const email of candidateEmails) {
      if (validateEmail(email)) {
        if (!emails.includes(email)) {
          validEmails.push(email);
        }
      } else {
        invalidEmails.push(email);
      }
    }

    if (invalidEmails.length > 0) {
      setError(`Invalid email address: ${invalidEmails.join(", ")}`);
    }

    if (validEmails.length > 0) {
      onChange([...emails, ...validEmails]);
    }

    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    // Trigger on enter, comma, semicolon
    if (e.key === "Enter" || e.key === "," || e.key === ";") {
      e.preventDefault();
      addEmails(inputValue);
    }
    // Backspace: remove last tag if input is empty
    else if (e.key === "Backspace" && inputValue === "") {
      e.preventDefault();
      if (emails.length > 0) {
        onChange(emails.slice(0, -1));
      }
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addEmails(inputValue);
    }
  };

  const removeEmail = (indexToRemove: number) => {
    if (disabled) return;
    onChange(emails.filter((_, index) => index !== indexToRemove));
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-[6px] w-full">
      <div
        onClick={focusInput}
        className={cn(
          "flex min-h-[44px] w-full flex-wrap items-center gap-[8px] border border-grey-6 bg-white px-[12px] py-[6px] transition-colors focus-within:border-pign-black cursor-text",
          disabled && "bg-grey-7 opacity-60 cursor-not-allowed focus-within:border-grey-6"
        )}
      >
        {emails.map((email, index) => (
          <div
            key={`${email}-${index}`}
            className="flex h-[28px] items-center gap-[6px] rounded-[14px] bg-pign-black px-[12px] py-[4px] text-[13px] font-medium text-white transition-opacity hover:opacity-95 shrink-0"
          >
            <span>{email}</span>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeEmail(index);
                }}
                className="flex size-[14px] shrink-0 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                aria-label={`Remove ${email}`}
              >
                <CloseIcon size={12} className="rotate-45 text-white" />
              </button>
            )}
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={emails.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="flex-1 min-w-[120px] h-[28px] bg-transparent text-[14px] font-medium text-pign-black outline-none placeholder:text-grey-4 disabled:cursor-not-allowed"
        />
      </div>
      {error && (
        <p className="text-[12px] font-medium text-verify-red" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
