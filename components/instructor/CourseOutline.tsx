"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ClipboardList,
  GripVertical,
  PlayCircle,
  Plus,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import type { CourseStructure } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

export type BuilderSelection =
  | { kind: "section"; id: number }
  | { kind: "lesson"; id: number }
  | { kind: "quiz"; id: number }
  | null;

export interface CourseOutlineProps {
  structure: CourseStructure;
  selection: BuilderSelection;
  onSelect: (selection: BuilderSelection) => void;
  onAddSection: () => void;
  onAddLesson: (sectionId: number) => void;
  isMutating?: boolean;
}

export function CourseOutline({
  structure,
  selection,
  onSelect,
  onAddSection,
  onAddLesson,
  isMutating = false,
}: CourseOutlineProps) {
  const t = useTranslations("instructor");
  const sections = [...structure.sections].sort((a, b) => a.order - b.order);
  const [expanded, setExpanded] = useState<Set<number>>(
    () => new Set(sections.map((s) => s.id)),
  );

  function toggle(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const isSelected = (kind: NonNullable<BuilderSelection>["kind"], id: number) =>
    selection?.kind === kind && selection.id === id;

  return (
    <div className="flex flex-col">
      {sections.map((section) => {
        const open = expanded.has(section.id);
        const lessons = [...section.lessons].sort((a, b) => a.order - b.order);
        return (
          <div key={section.id} className="border-b border-gray-100 dark:border-gray-800">
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-2",
                isSelected("section", section.id) && "bg-blue-50 dark:bg-blue-950",
              )}
            >
              <span className="cursor-grab text-gray-300" aria-hidden="true">
                <GripVertical className="h-4 w-4" />
              </span>
              <button
                type="button"
                onClick={() => toggle(section.id)}
                aria-label={open ? "collapse" : "expand"}
                className="rounded p-0.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {open ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                )}
              </button>
              <button
                type="button"
                onClick={() => onSelect({ kind: "section", id: section.id })}
                className="flex-1 truncate text-start text-sm font-medium text-gray-900 dark:text-gray-50"
              >
                {section.title_en || t("newSection")}
              </button>
            </div>

            {open && (
              <div className="ps-8">
                {lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => onSelect({ kind: "lesson", id: lesson.id })}
                    className={cn(
                      "flex w-full items-center gap-2 px-2 py-1.5 text-start text-sm",
                      isSelected("lesson", lesson.id)
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900",
                    )}
                  >
                    <PlayCircle className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                    <span className="truncate">{lesson.title_en || t("newLesson")}</span>
                  </button>
                ))}

                {section.quiz && (
                  <button
                    type="button"
                    onClick={() => onSelect({ kind: "quiz", id: section.quiz!.id })}
                    className={cn(
                      "flex w-full items-center gap-2 px-2 py-1.5 text-start text-sm",
                      isSelected("quiz", section.quiz.id)
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-900",
                    )}
                  >
                    <ClipboardList className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                    <span className="truncate">{t("quiz")}</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={isMutating}
                  onClick={() => onAddLesson(section.id)}
                  className="flex w-full items-center gap-2 px-2 py-1.5 text-start text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("addLesson")}
                </button>
              </div>
            )}
          </div>
        );
      })}

      <div className="p-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          fullWidth
          isLoading={isMutating}
          onClick={onAddSection}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t("addSection")}
        </Button>
      </div>
    </div>
  );
}
