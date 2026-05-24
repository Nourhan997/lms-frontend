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
  /** Admin views only. */
  student_name?: string | null;
  gateway?: string | null;
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

// ---------------------------------------------------------------------------
// Admin domain
// ---------------------------------------------------------------------------

export type StudentStatus = "active" | "suspended";

export interface AdminStudent {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  status: StudentStatus;
  enrollments_count: number;
  created_at: string;
}

export interface AdminStudentDetail extends AdminStudent {
  role: UserRole;
  completed_count: number;
  certificates_count: number;
  total_spent: number;
  enrollments: Enrollment[];
  payments: Payment[];
  certificates: Certificate[];
}

export type CourseStatus = "draft" | "published" | "archived";

export interface AdminCourse extends Course {
  status: CourseStatus;
  instructor_name: string | null;
  enrollments_count: number;
  // Raw bilingual fields, present on the single-course (edit) response.
  title_en?: string;
  title_ar?: string;
  description_en?: string;
  description_ar?: string;
  category_id?: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface CategoryWithCount extends Category {
  course_count: number;
}

export interface AdminInstructor {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  is_active: boolean;
  courses_count: number;
  students_count: number;
  created_at: string;
}

export interface CreateInstructorInput {
  name: string;
  email: string;
  password: string;
  bio: string;
}

export interface AuditLogEntry {
  id: number;
  created_at: string;
  admin_name: string;
  action: string;
  target_type: string;
  target_id: number | null;
}

/** Public certificate verification payload. */
export interface PublicCertificate {
  uid: string;
  student_name: string;
  course_title: string;
  instructor_name: string | null;
  issued_at: string;
  serial: string;
  valid: boolean;
}

/** Languages a course can be taught in (superset of the UI Locale). */
export type CourseLanguage = "en" | "ar" | "fr";

export interface AdminCourseInput {
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  category_id: number;
  level: Course["level"];
  language: CourseLanguage;
  price: number;
  thumbnail_url: string | null;
  status: CourseStatus;
}

export type BlogStatus = "draft" | "published";

export interface BlogPost {
  id: number;
  title: string;
  title_en: string;
  title_ar: string;
  body_en: string;
  body_ar: string;
  slug: string;
  status: BlogStatus;
  is_published: boolean;
  thumbnail_url: string | null;
  published_at: string | null;
  created_at: string;
  author_name?: string | null;
  /** Short summary for cards (public list). */
  excerpt?: string | null;
}

export interface AdminBlogInput {
  title_en: string;
  title_ar: string;
  body_en: string;
  body_ar: string;
  thumbnail_url: string | null;
  is_published: boolean;
}

export interface RecentEnrollment {
  id: number;
  student_name: string;
  course_title: string;
  enrolled_at: string;
  status: "active" | "completed";
}

export interface AdminDashboard {
  total_students: number;
  total_courses: number;
  total_revenue: number;
  active_enrollments: number;
  certificates_issued: number;
  recent_enrollments: RecentEnrollment[];
}

export interface RevenuePoint {
  /** Period label, e.g. "2026-05". */
  month: string;
  revenue: number;
}

export interface AdminSettings {
  platform_name: string;
  platform_tagline: string;
  support_email: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  from_name: string;
  from_address: string;
  footer_text: string;
  default_language: Locale;
  default_currency: string;
  allow_self_registration: boolean;
  placement_test_required: boolean;
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export type ReportPeriod = "daily" | "monthly" | "yearly";

export interface TimeSeriesPoint {
  label: string;
  value: number;
}

export interface RevenueReportData {
  series: TimeSeriesPoint[];
  total: number;
  this_month: number;
  net: number;
}

export interface EnrollmentReportData {
  series: TimeSeriesPoint[];
  total: number;
  this_month: number;
}

export interface CompletionRow {
  course_id: number;
  course_title: string;
  enrolled: number;
  completed: number;
  rate: number; // 0–100
}

export interface CompletionsReport {
  overall_rate: number; // 0–100
  rows: CompletionRow[];
}

export interface TopCourseRow {
  course_id: number;
  title: string;
  enrollments: number;
  revenue: number;
  completion_rate: number; // 0–100
}

// ---------------------------------------------------------------------------
// Instructor / course builder
// ---------------------------------------------------------------------------

export interface InstructorDashboard {
  courses_count: number;
  students_count: number;
  completions_count: number;
  recent_courses: AdminCourse[];
}

export interface BuilderContent {
  id: number;
  lesson_id: number;
  type: LessonContentType;
  url: string | null;
  html: string | null;
  order: number;
}

export interface BuilderLesson {
  id: number;
  section_id: number;
  title_en: string;
  title_ar: string;
  duration_minutes: number;
  order: number;
  is_published: boolean;
  content: BuilderContent[];
}

export interface BuilderQuestion {
  id: number;
  quiz_id: number;
  type: QuizQuestionType;
  prompt: string;
  options: string[];
  /** Index of the correct option (mc/true_false); null for fill_blank. */
  correct_index: number | null;
  explanation: string | null;
}

export interface BuilderQuiz {
  id: number;
  section_id: number;
  title: string;
  pass_score: number;
  questions: BuilderQuestion[];
}

export interface BuilderSection {
  id: number;
  course_id: number;
  title_en: string;
  title_ar: string;
  order: number;
  is_published: boolean;
  lessons: BuilderLesson[];
  quiz: BuilderQuiz | null;
}

export interface CourseStructure {
  course_id: number;
  course_title: string;
  sections: BuilderSection[];
}

export interface SectionInput {
  title_en: string;
  title_ar: string;
  is_published: boolean;
}

export interface LessonInput {
  title_en: string;
  title_ar: string;
  duration_minutes: number;
  is_published: boolean;
}

export interface ContentInput {
  type: LessonContentType;
  url: string | null;
  html: string | null;
}

export interface QuizInput {
  title: string;
  pass_score: number;
}

export interface QuestionInput {
  type: QuizQuestionType;
  prompt: string;
  options: string[];
  correct_index: number | null;
  explanation: string | null;
}
