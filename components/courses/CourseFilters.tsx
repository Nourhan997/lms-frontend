"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import type { Course } from "@/lib/types";

export type LevelFilter = Course["level"] | "";
export type LanguageFilter = Course["language"] | "";

export interface CourseFiltersValue {
  search: string;
  level: LevelFilter;
  language: LanguageFilter;
}

export interface CourseFiltersProps {
  value: CourseFiltersValue;
  onChange: (next: CourseFiltersValue) => void;
}

const selectClass =
  "h-10 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-50";

export function CourseFilters({ value, onChange }: CourseFiltersProps) {
  const t = useTranslations("courses");

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <Input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          endAdornment={
            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
          }
        />
      </div>

      <select
        aria-label={t("filterLevel")}
        className={selectClass}
        value={value.level}
        onChange={(e) =>
          onChange({ ...value, level: e.target.value as LevelFilter })
        }
      >
        <option value="">{t("allLevels")}</option>
        <option value="beginner">{t("levelBeginner")}</option>
        <option value="intermediate">{t("levelIntermediate")}</option>
        <option value="advanced">{t("levelAdvanced")}</option>
      </select>

      <select
        aria-label={t("filterLanguage")}
        className={selectClass}
        value={value.language}
        onChange={(e) =>
          onChange({ ...value, language: e.target.value as LanguageFilter })
        }
      >
        <option value="">{t("allLanguages")}</option>
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}
