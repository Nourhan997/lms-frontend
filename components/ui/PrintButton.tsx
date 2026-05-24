"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Triggers the browser print dialog. */
export function PrintButton({ label }: { label: string }) {
  return (
    <Button variant="outline" onClick={() => window.print()}>
      <Printer className="h-4 w-4" aria-hidden="true" />
      {label}
    </Button>
  );
}
