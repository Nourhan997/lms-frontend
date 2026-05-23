import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { cn } from "@/lib/utils/cn";

export interface StatsCardTrend {
  direction: "up" | "down";
  /** Percentage change, e.g. 12 → "12%". */
  value: number;
}

export interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: StatsCardTrend;
  isLoading?: boolean;
  className?: string;
}

/** Compact metric tile: icon + value + label, with an optional trend chip. */
export function StatsCard({
  icon: Icon,
  label,
  value,
  trend,
  isLoading = false,
  className,
}: StatsCardProps) {
  if (isLoading) {
    return <SkeletonCard variant="stat" className={className} />;
  }

  const TrendIcon = trend?.direction === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <Card className={className}>
      <CardContent className="flex items-center gap-4 p-6 pt-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
              {value}
            </span>
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 text-xs font-medium",
                  trend.direction === "up"
                    ? "text-green-600"
                    : "text-red-600",
                )}
              >
                <TrendIcon className="h-3 w-3" aria-hidden="true" />
                {trend.value}%
              </span>
            )}
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
