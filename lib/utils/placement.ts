import type { PlacementSubject } from "@/lib/types";

export const PLACEMENT_SUBJECTS: PlacementSubject[] = ["english", "french"];

export function isPlacementSubject(value: string): value is PlacementSubject {
  return (PLACEMENT_SUBJECTS as string[]).includes(value);
}
