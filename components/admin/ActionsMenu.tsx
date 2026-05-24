"use client";

import type { ReactNode } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

export interface ActionItem {
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  variant?: "default" | "danger";
  disabled?: boolean;
}

/** Row actions dropdown used in admin tables. */
export function ActionsMenu({ items }: { items: ActionItem[] }) {
  const t = useTranslations("admin");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        aria-label={t("actions")}
        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 outline-none hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-gray-800"
      >
        <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className="z-50 min-w-44 rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-gray-950"
        >
          {items.map((item, i) => (
            <DropdownMenu.Item
              key={i}
              disabled={item.disabled}
              onSelect={item.onSelect}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                item.variant === "danger"
                  ? "text-red-600 data-[highlighted]:bg-red-50 dark:text-red-400 dark:data-[highlighted]:bg-red-950"
                  : "text-gray-700 data-[highlighted]:bg-gray-100 dark:text-gray-200 dark:data-[highlighted]:bg-gray-800",
              )}
            >
              {item.icon}
              {item.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
