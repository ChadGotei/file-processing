import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { LoadingState } from "./loading-state";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400",
  secondary: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 disabled:border-slate-200 disabled:text-slate-400",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 disabled:text-slate-400",
  danger: "bg-red-600 text-white hover:bg-red-500 disabled:bg-red-300",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-base gap-2",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    isLoading = false,
    loadingText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = "",
    children,
    type = "button",
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center rounded-md font-medium transition",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2",
        "hover:cursor-pointer disabled:cursor-not-allowed",
        fullWidth ? "w-full" : "",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {isLoading ? (
        <>
          <LoadingState compact message={loadingText ?? "Loading"} />
          {loadingText ?? children}
        </>
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
});