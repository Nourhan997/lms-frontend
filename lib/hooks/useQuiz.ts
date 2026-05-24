"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyPlacementResult,
  getPlacementQuiz,
  getQuizAttempts,
  getSectionQuiz,
  submitPlacement,
  submitQuiz,
  type SubmitQuizPayload,
} from "@/lib/api/quizzes";
import { useAuthStore } from "@/lib/store/authStore";
import { authKeys } from "@/lib/hooks/useAuth";
import type {
  ApiError,
  PlacementResult,
  PlacementSubject,
  Quiz,
  QuizAttempt,
} from "@/lib/types";

export const quizKeys = {
  section: (sectionId: number) => ["quiz", "section", sectionId] as const,
  attempts: (quizId: number) => ["quiz", "attempts", quizId] as const,
  placementQuiz: (subject: PlacementSubject) =>
    ["placement", "quiz", subject] as const,
  placementResult: ["placement", "me"] as const,
};

/** Section quiz, by section id. */
export function useQuiz(sectionId: number) {
  const token = useAuthStore((s) => s.token);
  return useQuery<Quiz, ApiError>({
    queryKey: quizKeys.section(sectionId),
    queryFn: () => getSectionQuiz(sectionId),
    enabled: Boolean(token) && Number.isFinite(sectionId) && sectionId > 0,
  });
}

export interface SubmitQuizVariables {
  quizId: number;
  payload: SubmitQuizPayload;
}

export function useSubmitQuiz() {
  const queryClient = useQueryClient();
  return useMutation<QuizAttempt, ApiError, SubmitQuizVariables>({
    mutationFn: ({ quizId, payload }) => submitQuiz(quizId, payload),
    onSuccess: (_attempt, { quizId }) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.attempts(quizId) });
      // Completing a quiz can advance course progress.
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
  });
}

export function useQuizAttempts(quizId: number) {
  const token = useAuthStore((s) => s.token);
  return useQuery<QuizAttempt[], ApiError>({
    queryKey: quizKeys.attempts(quizId),
    queryFn: () => getQuizAttempts(quizId),
    enabled: Boolean(token) && Number.isFinite(quizId) && quizId > 0,
  });
}

export function usePlacementQuiz(subject: PlacementSubject) {
  const token = useAuthStore((s) => s.token);
  return useQuery<Quiz, ApiError>({
    queryKey: quizKeys.placementQuiz(subject),
    queryFn: () => getPlacementQuiz(subject),
    enabled: Boolean(token),
  });
}

export interface SubmitPlacementVariables {
  subject: PlacementSubject;
  payload: SubmitQuizPayload;
}

export function useSubmitPlacement() {
  const queryClient = useQueryClient();
  return useMutation<PlacementResult, ApiError, SubmitPlacementVariables>({
    mutationFn: ({ subject, payload }) => submitPlacement(subject, payload),
    onSuccess: (result) => {
      queryClient.setQueryData(quizKeys.placementResult, result);
      // placement_completed flips on the user — refresh `me`.
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

export function useMyPlacementResult() {
  const token = useAuthStore((s) => s.token);
  return useQuery<PlacementResult | null, ApiError>({
    queryKey: quizKeys.placementResult,
    queryFn: getMyPlacementResult,
    enabled: Boolean(token),
  });
}
