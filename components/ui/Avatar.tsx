import Image from "next/image";
import { cn } from "@/lib/utils/cn";

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-12 w-12 text-base",
} as const;

export interface AvatarProps {
  name: string;
  src?: string | null;
  size?: keyof typeof sizeClasses;
  className?: string;
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

/** Circular avatar — shows the image when provided, otherwise initials. */
export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const dimension = size === "lg" ? 48 : size === "sm" ? 32 : 36;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300",
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={dimension}
          height={dimension}
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{initials(name) || "?"}</span>
      )}
    </span>
  );
}
