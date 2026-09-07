import { type ChangeEvent, useState } from "react";
import type { RegisterFormValues } from "../../features/auth/auth-schemas";

function EyeIcon() {
  return (
    <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" width="18">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 24 24" width="18">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a3 3 0 0 0 4.24 4.24" />
      <path d="M9.36 5.11A9.9 9.9 0 0 1 12 5c6.5 0 10 7 10 7a15.6 15.6 0 0 1-3.13 4.02M6.6 6.6C4.3 8.1 2 12 2 12a15.6 15.6 0 0 0 5.24 5.94" />
    </svg>
  );
}

export default function TextField({ label, name, value, error, type = "text", autoComplete, onChange }: {
  label: string;
  name: keyof RegisterFormValues;
  value: string;
  error?: string;
  type?: "text" | "email" | "password";
  autoComplete: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const errorId = `${name}-error`;
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);

  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="relative mt-1.5 block">
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          autoComplete={autoComplete}
          className={`block w-full rounded-md border bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:ring-2 ${isPassword ? "pr-10" : ""} ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-slate-500 focus:ring-slate-200"}`}
          name={name}
          onChange={onChange}
          type={isPassword && revealed ? "text" : type}
          value={value}
        />
        {isPassword && (
          <button
            aria-label={revealed ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-slate-400 hover:text-slate-600 hover:cursor-pointer"
            onClick={() => setRevealed((current) => !current)}
            tabIndex={-1}
            type="button"
          >
            {revealed ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </span>
      {error && <span className="mt-1.5 block text-sm text-red-700" id={errorId}>{error}</span>}
    </label>
  );
}