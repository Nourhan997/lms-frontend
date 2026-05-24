import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth/server";
import { PlacementQuizClient } from "@/components/quiz/PlacementQuizClient";
import { isPlacementSubject } from "@/lib/utils/placement";

export default function PlacementSubjectPage({
  params,
}: {
  params: { subject: string };
}) {
  const auth = getServerAuth();
  if (!auth) {
    redirect(
      `/login?redirect=${encodeURIComponent(`/placement/${params.subject}`)}`,
    );
  }
  // Unknown subject → back to the chooser.
  if (!isPlacementSubject(params.subject)) {
    redirect("/placement");
  }

  return <PlacementQuizClient subject={params.subject} />;
}
