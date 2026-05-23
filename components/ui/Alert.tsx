import * as React from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type AlertVariant = "success" | "error" | "warning" | "info";

const variantConfig: Record<AlertVariant, { icon: LucideIcon; classes: string }> = {
  success: {
    icon: CheckCircle2,
    classes:
      "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200",
  },
  error: {
    icon: AlertCircle,
    classes:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
  },
  warning: {
    icon: AlertTriangle,
    classes:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
  },
  info: {
    icon: Info,
    classes:
      "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200",
  },
};

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
}

export function Alert({
  variant = "info",
  title,
  className,
  children,
  ...props
}: AlertProps) {
  const { icon: Icon, classes } = variantConfig[variant];
  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-3 rounded-md border p-3 text-sm",
        classes,
        className,
      )}
      {...props}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex flex-col gap-0.5">
        {title && <p className="font-medium">{title}</p>}
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}

export type { AlertVariant };
