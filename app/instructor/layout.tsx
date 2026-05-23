import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function InstructorPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayout role="instructor">{children}</DashboardLayout>;
}
