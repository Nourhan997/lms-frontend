import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  /** Rendered at the trailing (end) edge of the field, e.g. a show/hide toggle. */
  endAdornment?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, label, error, helperText, endAdornment, id, ...props },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const describedById = error
      ? `${inputId}-error`
      : helperText
        ? `${inputId}-helper`
        : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-gray-900 dark:text-gray-100"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={describedById}
            className={cn(
              "h-10 w-full rounded-md border bg-white px-3 text-sm text-gray-900 transition-colors",
              "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0",
              "dark:bg-gray-950 dark:text-gray-50 dark:placeholder:text-gray-500",
              endAdornment && "pe-10",
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-600 dark:border-gray-700",
              className,
            )}
            {...props}
          />
          {endAdornment && (
            <div className="absolute inset-y-0 end-0 flex items-center pe-2">
              {endAdornment}
            </div>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-sm text-red-600">
            {error}
          </p>
        ) : helperText ? (
          <p
            id={`${inputId}-helper`}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
