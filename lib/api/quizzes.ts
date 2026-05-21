import { apiClient } from "@/lib/api/client";
import type { Quiz, QuizResult } from "@/lib/types";

export async function getQuiz(quizId: number): Promise<Quiz> {
  const { data } = await apiClient.get<Quiz>(`/quizzes/${quizId}`);
  return data;
}

export interface SubmitQuizPayload {
  // Map of question id -> selected option index.
  answers: Record<number, number>;
}

export async function submitQuiz(
  quizId: number,
  payload: SubmitQuizPayload,
): Promise<QuizResult> {
  const { data } = await apiClient.post<QuizResult>(
    `/quizzes/${quizId}/submit`,
    payload,
  );
  return data;
}
