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

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  video_url: string | null;
  duration_minutes: number;
  order: number;
  /** Free preview lessons are playable without enrolling. */
  is_preview: boolean;
}

/** Course with its curriculum and aggregate metadata (detail endpoint). */
export interface CourseDetail extends Course {
  lessons: Lesson[];
  instructor_name: string | null;
  students_count: number;
  rating: number | null;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  progress: number; // 0–100
  completed: boolean;
  enrolled_at: string;
  /** Embedded course, when the API expands the relation (list endpoints). */
  course?: Course;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  /** Optional in-app link to navigate to when the notification is opened. */
  link?: string | null;
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
