import { Skeleton } from "@/components/ui/Skeleton";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

type SkeletonVariant = "course" | "stat" | "list-item";

export interface SkeletonCardProps {
  variant?: SkeletonVariant;
  className?: string;
}

/**
 * Loading placeholder matching the shape of the content it stands in for.
 *  - `course`: thumbnail + title + meta + progress
 *  - `stat`: icon + number + label
 *  - `list-item`: avatar/icon + two lines of text
 */
export function SkeletonCard({ variant = "course", className }: SkeletonCardProps) {
  if (variant === "stat") {
    return (
      <Card className={className}>
        <CardContent className="flex items-center gap-4 p-6 pt-6">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "list-item") {
    return (
      <div className={cn("flex items-start gap-3 p-3", className)}>
        <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    );
  }

  // course
  return (
    <Card className={className}>
      <Skeleton className="h-36 w-full rounded-b-none" />
      <CardContent className="flex flex-col gap-3 p-4 pt-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-2 w-full rounded-full" />
      </CardContent>
    </Card>
  );
}
