import { apiClient } from "@/lib/api/client";
import type {
  AdminCourse,
  AdminCourseInput,
  BuilderContent,
  BuilderLesson,
  BuilderQuestion,
  BuilderQuiz,
  BuilderSection,
  ContentInput,
  CourseStatus,
  CourseStructure,
  InstructorDashboard,
  LessonInput,
  Paginated,
  QuestionInput,
  QuizInput,
  SectionInput,
} from "@/lib/types";

// --- Dashboard / courses ---------------------------------------------------

export async function getInstructorDashboard(): Promise<InstructorDashboard> {
  const { data } = await apiClient.get<InstructorDashboard>(
    "/instructor/overview",
  );
  return data;
}

export interface InstructorCourseFilters {
  page?: number;
  status?: CourseStatus | "";
}

export async function getInstructorCourses(
  filters: InstructorCourseFilters = {},
): Promise<Paginated<AdminCourse>> {
  const { data } = await apiClient.get<Paginated<AdminCourse>>(
    "/instructor/courses",
    { params: filters },
  );
  return data;
}

export async function getInstructorCourse(id: number): Promise<AdminCourse> {
  const { data } = await apiClient.get<AdminCourse>(`/instructor/courses/${id}`);
  return data;
}

export async function createInstructorCourse(
  payload: AdminCourseInput,
): Promise<AdminCourse> {
  const { data } = await apiClient.post<AdminCourse>(
    "/instructor/courses",
    payload,
  );
  return data;
}

export async function updateInstructorCourse(
  id: number,
  payload: Partial<AdminCourseInput>,
): Promise<AdminCourse> {
  const { data } = await apiClient.patch<AdminCourse>(
    `/instructor/courses/${id}`,
    payload,
  );
  return data;
}

export async function publishInstructorCourse(id: number): Promise<AdminCourse> {
  const { data } = await apiClient.post<AdminCourse>(
    `/instructor/courses/${id}/publish`,
  );
  return data;
}

export async function archiveInstructorCourse(id: number): Promise<AdminCourse> {
  const { data } = await apiClient.post<AdminCourse>(
    `/instructor/courses/${id}/archive`,
  );
  return data;
}

// --- Students --------------------------------------------------------------

export interface InstructorStudentRow {
  enrollment_id: number;
  student_name: string;
  course_title: string;
  progress: number;
  enrolled_at: string;
}

export async function getInstructorStudents(
  page = 1,
): Promise<Paginated<InstructorStudentRow>> {
  const { data } = await apiClient.get<Paginated<InstructorStudentRow>>(
    "/instructor/students",
    { params: { page } },
  );
  return data;
}

// --- Course structure ------------------------------------------------------

export async function getCourseStructure(
  courseId: number,
): Promise<CourseStructure> {
  const { data } = await apiClient.get<CourseStructure>(
    `/instructor/courses/${courseId}/structure`,
  );
  return data;
}

// Sections
export async function createSection(
  courseId: number,
  payload: SectionInput,
): Promise<BuilderSection> {
  const { data } = await apiClient.post<BuilderSection>(
    `/instructor/courses/${courseId}/sections`,
    payload,
  );
  return data;
}

export async function updateSection(
  sectionId: number,
  payload: Partial<SectionInput>,
): Promise<BuilderSection> {
  const { data } = await apiClient.patch<BuilderSection>(
    `/instructor/sections/${sectionId}`,
    payload,
  );
  return data;
}

export async function deleteSection(sectionId: number): Promise<void> {
  await apiClient.delete(`/instructor/sections/${sectionId}`);
}

// Lessons
export async function createLesson(
  sectionId: number,
  payload: LessonInput,
): Promise<BuilderLesson> {
  const { data } = await apiClient.post<BuilderLesson>(
    `/instructor/sections/${sectionId}/lessons`,
    payload,
  );
  return data;
}

export async function updateLesson(
  lessonId: number,
  payload: Partial<LessonInput>,
): Promise<BuilderLesson> {
  const { data } = await apiClient.patch<BuilderLesson>(
    `/instructor/lessons/${lessonId}`,
    payload,
  );
  return data;
}

export async function deleteLesson(lessonId: number): Promise<void> {
  await apiClient.delete(`/instructor/lessons/${lessonId}`);
}

// Content
export async function addContent(
  lessonId: number,
  payload: ContentInput,
): Promise<BuilderContent> {
  const { data } = await apiClient.post<BuilderContent>(
    `/instructor/lessons/${lessonId}/content`,
    payload,
  );
  return data;
}

export async function updateContent(
  contentId: number,
  payload: Partial<ContentInput>,
): Promise<BuilderContent> {
  const { data } = await apiClient.patch<BuilderContent>(
    `/instructor/content/${contentId}`,
    payload,
  );
  return data;
}

export async function deleteContent(contentId: number): Promise<void> {
  await apiClient.delete(`/instructor/content/${contentId}`);
}

// Quiz
export async function createQuiz(
  sectionId: number,
  payload: QuizInput,
): Promise<BuilderQuiz> {
  const { data } = await apiClient.post<BuilderQuiz>(
    `/instructor/sections/${sectionId}/quiz`,
    payload,
  );
  return data;
}

export async function updateQuiz(
  quizId: number,
  payload: Partial<QuizInput>,
): Promise<BuilderQuiz> {
  const { data } = await apiClient.patch<BuilderQuiz>(
    `/instructor/quizzes/${quizId}`,
    payload,
  );
  return data;
}

// Questions
export async function addQuestion(
  quizId: number,
  payload: QuestionInput,
): Promise<BuilderQuestion> {
  const { data } = await apiClient.post<BuilderQuestion>(
    `/instructor/quizzes/${quizId}/questions`,
    payload,
  );
  return data;
}

export async function updateQuestion(
  questionId: number,
  payload: Partial<QuestionInput>,
): Promise<BuilderQuestion> {
  const { data } = await apiClient.patch<BuilderQuestion>(
    `/instructor/questions/${questionId}`,
    payload,
  );
  return data;
}

export async function deleteQuestion(questionId: number): Promise<void> {
  await apiClient.delete(`/instructor/questions/${questionId}`);
}

// Uploads (audio/pdf for lesson content)
export async function uploadFile(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await apiClient.post<{ url: string }>(
    "/instructor/uploads",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}
