"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addContent,
  addQuestion,
  archiveInstructorCourse,
  createInstructorCourse,
  createLesson,
  createQuiz,
  createSection,
  deleteContent,
  deleteLesson,
  deleteQuestion,
  deleteSection,
  getCourseStructure,
  getInstructorCourse,
  getInstructorCourses,
  getInstructorDashboard,
  publishInstructorCourse,
  updateContent,
  updateInstructorCourse,
  updateLesson,
  updateQuestion,
  updateQuiz,
  updateSection,
  type InstructorCourseFilters,
} from "@/lib/api/instructor";
import { useAuthStore } from "@/lib/store/authStore";
import type {
  AdminCourse,
  AdminCourseInput,
  ApiError,
  BuilderContent,
  BuilderLesson,
  BuilderQuestion,
  BuilderQuiz,
  BuilderSection,
  ContentInput,
  CourseStructure,
  InstructorDashboard,
  LessonInput,
  Paginated,
  QuestionInput,
  QuizInput,
  SectionInput,
} from "@/lib/types";

export const instructorKeys = {
  dashboard: ["instructor", "dashboard"] as const,
  courses: (filters: InstructorCourseFilters) =>
    ["instructor", "courses", filters] as const,
  course: (id: number) => ["instructor", "course", id] as const,
  structure: (courseId: number) =>
    ["instructor", "structure", courseId] as const,
};

function useInstructorEnabled() {
  return Boolean(useAuthStore((s) => s.token));
}

// --- Dashboard / courses ---------------------------------------------------

export function useInstructorDashboard() {
  return useQuery<InstructorDashboard, ApiError>({
    queryKey: instructorKeys.dashboard,
    queryFn: getInstructorDashboard,
    enabled: useInstructorEnabled(),
  });
}

export function useInstructorCourses(filters: InstructorCourseFilters = {}) {
  return useQuery<Paginated<AdminCourse>, ApiError>({
    queryKey: instructorKeys.courses(filters),
    queryFn: () => getInstructorCourses(filters),
    enabled: useInstructorEnabled(),
  });
}

export function useInstructorCourse(id: number) {
  return useQuery<AdminCourse, ApiError>({
    queryKey: instructorKeys.course(id),
    queryFn: () => getInstructorCourse(id),
    enabled: useInstructorEnabled() && Number.isFinite(id) && id > 0,
  });
}

export function useCreateInstructorCourse() {
  const qc = useQueryClient();
  return useMutation<AdminCourse, ApiError, AdminCourseInput>({
    mutationFn: createInstructorCourse,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["instructor", "courses"] }),
  });
}

export function useUpdateInstructorCourse() {
  const qc = useQueryClient();
  return useMutation<
    AdminCourse,
    ApiError,
    { id: number; payload: Partial<AdminCourseInput> }
  >({
    mutationFn: ({ id, payload }) => updateInstructorCourse(id, payload),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: instructorKeys.course(id) });
      qc.invalidateQueries({ queryKey: ["instructor", "courses"] });
    },
  });
}

export function usePublishInstructorCourse() {
  const qc = useQueryClient();
  return useMutation<AdminCourse, ApiError, number>({
    mutationFn: publishInstructorCourse,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["instructor", "courses"] }),
  });
}

export function useArchiveInstructorCourse() {
  const qc = useQueryClient();
  return useMutation<AdminCourse, ApiError, number>({
    mutationFn: archiveInstructorCourse,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["instructor", "courses"] }),
  });
}

// --- Course structure ------------------------------------------------------

export function useCourseStructure(courseId: number) {
  return useQuery<CourseStructure, ApiError>({
    queryKey: instructorKeys.structure(courseId),
    queryFn: () => getCourseStructure(courseId),
    enabled: useInstructorEnabled() && Number.isFinite(courseId) && courseId > 0,
  });
}

/** Invalidate every builder structure query after a mutation. */
function useInvalidateStructure() {
  const qc = useQueryClient();
  return () =>
    qc.invalidateQueries({ queryKey: ["instructor", "structure"] });
}

// Sections
export function useCreateSection() {
  const invalidate = useInvalidateStructure();
  return useMutation<
    BuilderSection,
    ApiError,
    { courseId: number; input: SectionInput }
  >({
    mutationFn: ({ courseId, input }) => createSection(courseId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateSection() {
  const invalidate = useInvalidateStructure();
  return useMutation<
    BuilderSection,
    ApiError,
    { id: number; input: Partial<SectionInput> }
  >({
    mutationFn: ({ id, input }) => updateSection(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteSection() {
  const invalidate = useInvalidateStructure();
  return useMutation<void, ApiError, number>({
    mutationFn: deleteSection,
    onSuccess: invalidate,
  });
}

// Lessons
export function useCreateLesson() {
  const invalidate = useInvalidateStructure();
  return useMutation<
    BuilderLesson,
    ApiError,
    { sectionId: number; input: LessonInput }
  >({
    mutationFn: ({ sectionId, input }) => createLesson(sectionId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateLesson() {
  const invalidate = useInvalidateStructure();
  return useMutation<
    BuilderLesson,
    ApiError,
    { id: number; input: Partial<LessonInput> }
  >({
    mutationFn: ({ id, input }) => updateLesson(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteLesson() {
  const invalidate = useInvalidateStructure();
  return useMutation<void, ApiError, number>({
    mutationFn: deleteLesson,
    onSuccess: invalidate,
  });
}

// Content
export function useAddContent() {
  const invalidate = useInvalidateStructure();
  return useMutation<
    BuilderContent,
    ApiError,
    { lessonId: number; input: ContentInput }
  >({
    mutationFn: ({ lessonId, input }) => addContent(lessonId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateContent() {
  const invalidate = useInvalidateStructure();
  return useMutation<
    BuilderContent,
    ApiError,
    { id: number; input: Partial<ContentInput> }
  >({
    mutationFn: ({ id, input }) => updateContent(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteContent() {
  const invalidate = useInvalidateStructure();
  return useMutation<void, ApiError, number>({
    mutationFn: deleteContent,
    onSuccess: invalidate,
  });
}

// Quiz
export function useCreateQuiz() {
  const invalidate = useInvalidateStructure();
  return useMutation<
    BuilderQuiz,
    ApiError,
    { sectionId: number; input: QuizInput }
  >({
    mutationFn: ({ sectionId, input }) => createQuiz(sectionId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateQuiz() {
  const invalidate = useInvalidateStructure();
  return useMutation<
    BuilderQuiz,
    ApiError,
    { id: number; input: Partial<QuizInput> }
  >({
    mutationFn: ({ id, input }) => updateQuiz(id, input),
    onSuccess: invalidate,
  });
}

// Questions
export function useAddQuestion() {
  const invalidate = useInvalidateStructure();
  return useMutation<
    BuilderQuestion,
    ApiError,
    { quizId: number; input: QuestionInput }
  >({
    mutationFn: ({ quizId, input }) => addQuestion(quizId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateQuestion() {
  const invalidate = useInvalidateStructure();
  return useMutation<
    BuilderQuestion,
    ApiError,
    { id: number; input: Partial<QuestionInput> }
  >({
    mutationFn: ({ id, input }) => updateQuestion(id, input),
    onSuccess: invalidate,
  });
}

export function useDeleteQuestion() {
  const invalidate = useInvalidateStructure();
  return useMutation<void, ApiError, number>({
    mutationFn: deleteQuestion,
    onSuccess: invalidate,
  });
}
