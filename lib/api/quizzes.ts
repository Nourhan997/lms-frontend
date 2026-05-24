import { apiClient } from "@/lib/api/client";
import type {
  PlacementResult,
  PlacementSubject,
  Quiz,
  QuizAnswer,
  QuizAttempt,
} from "@/lib/types";

/** The quiz attached to a course section. */
export async function getSectionQuiz(sectionId: number): Promise<Quiz> {
  const { data } = await apiClient.get<Quiz>(`/sections/${sectionId}/quiz`);
  return data;
}

export interface SubmitQuizPayload {
  // Map of question id -> answer (option index or free text).
  answers: Record<number, QuizAnswer>;
}

export async function submitQuiz(
  quizId: number,
  payload: SubmitQuizPayload,
): Promise<QuizAttempt> {
  const { data } = await apiClient.post<QuizAttempt>(
    `/quizzes/${quizId}/submit`,
    payload,
  );
  return data;
}

export async function getQuizAttempts(quizId: number): Promise<QuizAttempt[]> {
  const { data } = await apiClient.get<QuizAttempt[]>(
    `/quizzes/${quizId}/attempts`,
  );
  return data;
}

/** Placement quiz for a subject (e.g. english, french). */
export async function getPlacementQuiz(
  subject: PlacementSubject,
): Promise<Quiz> {
  const { data } = await apiClient.get<Quiz>(`/placement/${subject}/quiz`);
  return data;
}

export async function submitPlacement(
  subject: PlacementSubject,
  payload: SubmitQuizPayload,
): Promise<PlacementResult> {
  const { data } = await apiClient.post<PlacementResult>(
    `/placement/${subject}/submit`,
    payload,
  );
  return data;
}

/** The current user's placement result, or null if not taken yet. */
export async function getMyPlacementResult(): Promise<PlacementResult | null> {
  const { data } = await apiClient.get<PlacementResult | null>("/placement/me");
  return data;
}
