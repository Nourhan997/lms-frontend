import type { Metadata } from "next";
import { getPublicSettings } from "@/lib/api/settings";
import { LandingContent } from "@/components/landing/LandingContent";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings().catch(() => null);
  return {
    title: settings?.platform_name ?? "LMS",
    description: settings?.tagline ?? "Learn anything, anywhere.",
  };
}

export default function LandingPage() {
  return <LandingContent />;
}
