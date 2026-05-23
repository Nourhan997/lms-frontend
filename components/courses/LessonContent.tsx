"use client";

import DOMPurify from "isomorphic-dompurify";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { CoursePlayer } from "@/components/courses/CoursePlayer";
import { Button } from "@/components/ui/Button";
import type { LessonContentItem, LessonWithProgress } from "@/lib/types";

/**
 * Render a single text content block. The HTML is instructor-authored, but we
 * still sanitize it with DOMPurify before injecting it (defense against stored
 * XSS). This is the one sanctioned use of dangerouslySetInnerHTML in the app —
 * only ever on DOMPurify output, never on raw/user input.
 */
function TextContent({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html);
  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert"
      // eslint-disable-next-line react/no-danger -- sanitized instructor HTML only
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

function ContentItem({ item }: { item: LessonContentItem }) {
  const t = useTranslations("learn");

  switch (item.type) {
    case "video":
      return item.url ? <CoursePlayer src={item.url} /> : null;

    case "audio":
      return item.url ? (
        <audio
          controls
          src={item.url}
          className="w-full rounded-md bg-gray-100 dark:bg-gray-800"
        >
          <track kind="captions" />
        </audio>
      ) : null;

    case "text":
      return item.html ? <TextContent html={item.html} /> : null;

    case "pdf":
      return item.url ? (
        <div className="flex flex-col gap-3">
          <iframe
            src={item.url}
            title="PDF"
            className="h-[600px] w-full rounded-md border border-gray-200 dark:border-gray-800"
          />
          <a href={item.url} download target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" aria-hidden="true" />
              {t("downloadPdf")}
            </Button>
          </a>
        </div>
      ) : null;

    default:
      return null;
  }
}

export interface LessonContentProps {
  lesson: LessonWithProgress;
}

/** Renders all content items for a lesson, in order. */
export function LessonContent({ lesson }: LessonContentProps) {
  const t = useTranslations("learn");
  const items = [...lesson.content].sort((a, b) => a.order - b.order);

  if (items.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
        {t("noContent")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
        {lesson.title}
      </h2>
      {items.map((item) => (
        <ContentItem key={item.id} item={item} />
      ))}
    </div>
  );
}
