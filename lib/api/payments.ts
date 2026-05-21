import { apiClient } from "@/lib/api/client";
import type { Payment, Paginated } from "@/lib/types";

export interface CreateCheckoutPayload {
  course_id: number;
}

export interface CheckoutSession {
  checkout_url: string;
  payment_id: number;
}

export async function createCheckout(
  payload: CreateCheckoutPayload,
): Promise<CheckoutSession> {
  const { data } = await apiClient.post<CheckoutSession>(
    "/payments/checkout",
    payload,
  );
  return data;
}

export async function getMyPayments(): Promise<Payment[]> {
  const { data } = await apiClient.get<Payment[]>("/payments");
  return data;
}

export async function getAllPayments(
  page = 1,
): Promise<Paginated<Payment>> {
  const { data } = await apiClient.get<Paginated<Payment>>("/admin/payments", {
    params: { page },
  });
  return data;
}
