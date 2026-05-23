import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AdminPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardLayout role="admin">{children}</DashboardLayout>;
}
