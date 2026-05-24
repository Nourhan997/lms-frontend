"use client";

import { useLocale } from "next-intl";
import type { Locale, RevenuePoint } from "@/lib/types";

const WIDTH = 720;
const HEIGHT = 220;
const PADDING = { top: 16, right: 8, bottom: 28, left: 8 };

/**
 * Bar chart drawn with plain SVG — no chart library, no inline `style`
 * (bar geometry uses SVG presentation attributes, not the React style prop).
 * Mirrors horizontally for RTL so the most recent month sits at the start.
 */
export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  const locale = useLocale() as Locale;
  const isRtl = locale === "ar";

  if (data.length === 0) return null;

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const slot = plotWidth / data.length;
  const barWidth = Math.max(4, slot * 0.6);

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-56 w-full"
      role="img"
      preserveAspectRatio="none"
    >
      <g transform={isRtl ? `translate(${WIDTH}, 0) scale(-1, 1)` : undefined}>
        {data.map((point, i) => {
          const barHeight = (point.revenue / max) * plotHeight;
          const x = PADDING.left + i * slot + (slot - barWidth) / 2;
          const y = PADDING.top + (plotHeight - barHeight);
          return (
            <g key={point.month}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={3}
                className="fill-blue-600"
              />
              {/* Counter-flip the label so text stays readable in RTL. */}
              <text
                x={x + barWidth / 2}
                y={HEIGHT - 8}
                textAnchor="middle"
                transform={
                  isRtl ? `translate(${2 * (x + barWidth / 2)}, 0) scale(-1, 1)` : undefined
                }
                className="fill-gray-400 text-[10px]"
              >
                {point.month.slice(5)}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
