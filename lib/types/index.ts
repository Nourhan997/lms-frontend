/**
 * Shared application types.
 *
 * Keep domain models here so API functions, React Query hooks and components
 * all reference a single source of truth. No `any` — model the real shape.
 */

export type UserRole = "admin" | "instructor" | "student";

export type Locale = "en" | "ar";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  preferred_language: Locale;
  placement_completed: boolean;
  suggested_course: Course | null;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail_url: string | null;
  price: number;
  level: "beginner" | "intermediate" | "advanced";
  language: Locale;
  instructor_id: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  progress: number; // 0–100
  completed: boolean;
  enrolled_at: string;
}

export interface Quiz {
  id: number;
  course_id: number;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  options: string[];
  // Correct answer is resolved server-side; never trust the client.
}

export interface QuizResult {
  id: number;
  quiz_id: number;
  user_id: number;
  score: number;
  passed: boolean;
  submitted_at: string;
}

export interface Payment {
  id: number;
  user_id: number;
  course_id: number;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  created_at: string;
}

/** Consistent error shape thrown by the API client. */
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

/** Standard paginated list envelope. */
export interface Paginated<T> {
  data: T[];
  page: number;
  per_page: number;
  total: number;
}
