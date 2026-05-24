import { apiClient } from "@/lib/api/client";
import type { Enrollment, Payment, Paginated } from "@/lib/types";

/** Step 1 of checkout: create a pending payment for a course. */
export async function initiateCheckout(courseId: number): Promise<Payment> {
  const { data } = await apiClient.post<Payment>(
    `/student/courses/${courseId}/checkout`,
  );
  return data;
}

export interface ConfirmPaymentResponse {
  payment: Payment;
  enrollment: Enrollment;
}

/** Step 2 of checkout: confirm the (demo) payment, which creates the enrollment. */
export async function confirmPayment(
  paymentId: number,
): Promise<ConfirmPaymentResponse> {
  const { data } = await apiClient.post<ConfirmPaymentResponse>(
    `/student/payments/${paymentId}/confirm`,
  );
  return data;
}

export async function getMyPayments(): Promise<Payment[]> {
  const { data } = await apiClient.get<Payment[]>("/student/payments");
  return data;
}

export async function getAllPayments(page = 1): Promise<Paginated<Payment>> {
  const { data } = await apiClient.get<Paginated<Payment>>("/admin/payments", {
    params: { page },
  });
  return data;
}
