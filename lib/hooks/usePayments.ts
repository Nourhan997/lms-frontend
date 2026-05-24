"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  confirmPayment,
  getMyPayments,
  initiateCheckout,
} from "@/lib/api/payments";
import { enroll } from "@/lib/api/enrollments";
import { useAuthStore } from "@/lib/store/authStore";
import type { ApiError, Enrollment, Payment } from "@/lib/types";

export const paymentKeys = {
  mine: ["payments", "mine"] as const,
};

/**
 * Two-step demo checkout: initiate a payment, then confirm it. Resolves to the
 * created enrollment. `isPending` covers both network calls.
 */
export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation<Enrollment, ApiError, number>({
    mutationFn: async (courseId) => {
      const payment = await initiateCheckout(courseId);
      const { enrollment } = await confirmPayment(payment.id);
      return enrollment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: paymentKeys.mine });
    },
  });
}

export function useMyPayments() {
  const token = useAuthStore((s) => s.token);
  return useQuery<Payment[], ApiError>({
    queryKey: paymentKeys.mine,
    queryFn: getMyPayments,
    enabled: Boolean(token),
  });
}

/** Direct enrollment for free courses (no payment). */
export function useEnrollFreeCourse() {
  const queryClient = useQueryClient();
  return useMutation<Enrollment, ApiError, number>({
    mutationFn: (courseId) => enroll(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}
