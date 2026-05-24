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
  bio?: string | null;
  avatar_url?: string | null;
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
  /** Number of sections, when the API provides it (used on checkout). */
  sections_count?: number;
}

export type LessonContentType = "video" | "audio" | "text" | "pdf";

export interface LessonContentItem {
  id: number;
  type: LessonContentType;
  /** Media/file URL for video, audio and pdf content. */
  url: string | null;
  /** Raw HTML body for `text` content (sanitized before rendering). */
  html: string | null;
  order: number;
}

/** A lesson within an enrolled course, with completion + content payload. */
export interface LessonWithProgress extends Lesson {
  section_id: number;
  completed: boolean;
  content: LessonContentItem[];
  /** Normally false for enrolled students; guards the UI just in case. */
  locked?: boolean;
}

export interface CourseSection {
  id: number;
  course_id: number;
  title: string;
  order: number;
  lessons: LessonWithProgress[];
  /** Set when the section has an end-of-section quiz. */
  quiz_id?: number | null;
}

/** Full learning payload for an enrolled course (player view). */
export interface CourseContent {
  enrollment_id: number;
  course: Course;
  sections: CourseSection[];
  progress: number; // 0–100
  completed: boolean;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  progress: number; // 0–100
  completed: boolean;
  enrolled_at: string;
  last_accessed_at?: string | null;
  /** Embedded course, when the API expands the relation (list endpoints). */
  course?: Course;
}

export interface Certificate {
  id: number;
  course_id: number;
  course_title: string;
  issued_at: string;
  /** Human-readable unique serial / certificate ID. */
  serial: string;
  pdf_url: string | null;
  share_url: string;
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

export type QuizQuestionType = "multiple_choice" | "true_false" | "fill_blank";

export interface QuizQuestion {
  id: number;
  type: QuizQuestionType;
  prompt: string;
  /** Selectable options for multiple_choice / true_false. Empty for fill_blank. */
  options: string[];
  // Correct answer is resolved server-side; never trust the client.
}

export interface Quiz {
  id: number;
  course_id: number;
  /** Present for section quizzes; null for placement/standalone quizzes. */
  section_id: number | null;
  title: string;
  /** Passing threshold as a percentage (0–100). */
  pass_score: number;
  questions: QuizQuestion[];
}

/**
 * A single answer. Option index (number) for multiple_choice / true_false,
 * free text (string) for fill_blank.
 */
export type QuizAnswer = number | string;

/** Per-question outcome returned with a graded attempt. */
export interface QuizQuestionResult {
  question_id: number;
  prompt: string;
  your_answer: string;
  correct_answer: string;
  correct: boolean;
}

export interface QuizAttempt {
  id: number;
  quiz_id: number;
  score: number; // percentage 0–100
  passed: boolean;
  submitted_at: string;
  results: QuizQuestionResult[];
}

export type PlacementSubject = "english" | "french";

export interface PlacementResult {
  id: number;
  subject: PlacementSubject;
  score: number; // percentage 0–100
  /** CEFR-style code, e.g. "B1". */
  level_code: string;
  /** Human-readable level, e.g. "Intermediate". */
  level_label: string;
  suggested_course: Course | null;
  completed_at: string;
}

export type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

export interface Payment {
  id: number;
  user_id: number;
  course_id: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  created_at: string;
  /** Embedded course, when the API expands the relation (history list). */
  course?: Course;
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
