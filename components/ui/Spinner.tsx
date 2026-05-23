import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-8 w-8",
} as const;

export interface SpinnerProps {
  size?: keyof typeof sizeClasses;
  className?: string;
  /** Accessible label; falls back to "Loading". */
  label?: string;
}

export function Spinner({ size = "md", className, label = "Loading" }: SpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label={label}
      className={cn("animate-spin", sizeClasses[size], className)}
    />
  );
}
