import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth/server";
import { PlacementIntro } from "@/components/quiz/PlacementIntro";

export default function PlacementPage() {
  // Public route, but the placement test requires an account.
  const auth = getServerAuth();
  if (!auth) {
    redirect(`/login?redirect=${encodeURIComponent("/placement")}`);
  }
  return <PlacementIntro />;
}
