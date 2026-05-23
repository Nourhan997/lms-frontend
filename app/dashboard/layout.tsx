import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function StudentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayout role="student">{children}</DashboardLayout>;
}
