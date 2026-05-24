import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth/server";
import { CheckoutClient } from "@/components/payment/CheckoutClient";

export default function CheckoutPage({
  params,
}: {
  params: { slug: string };
}) {
  // Checkout requires an account.
  const auth = getServerAuth();
  if (!auth) {
    redirect(
      `/login?redirect=${encodeURIComponent(`/courses/${params.slug}/checkout`)}`,
    );
  }
  return <CheckoutClient slug={params.slug} />;
}
