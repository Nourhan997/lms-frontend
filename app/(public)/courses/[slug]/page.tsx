import type { Metadata } from "next";
import { getCourse } from "@/lib/api/courses";
import { CourseDetailClient } from "@/components/courses/CourseDetailClient";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const course = await getCourse(params.slug).catch(() => null);
  if (!course) return { title: "Course" };
  return { title: course.title, description: course.description };
}

export default function CourseDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <CourseDetailClient slug={params.slug} />;
}
