"use client";

import { useLocale } from "next-intl";
import type { Locale, TimeSeriesPoint } from "@/lib/types";

const WIDTH = 720;
const HEIGHT = 220;
const PADDING = { top: 16, right: 8, bottom: 28, left: 8 };

/** Generic SVG bar chart (no library, no inline styles). RTL-mirrored. */
export function BarChart({ data }: { data: TimeSeriesPoint[] }) {
  const isRtl = (useLocale() as Locale) === "ar";
  if (data.length === 0) return null;

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const max = Math.max(...data.map((d) => d.value), 1);
  const slot = plotWidth / data.length;
  const barWidth = Math.max(3, slot * 0.6);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-56 w-full" role="img" preserveAspectRatio="none">
      <g transform={isRtl ? `translate(${WIDTH}, 0) scale(-1, 1)` : undefined}>
        {data.map((point, i) => {
          const barHeight = (point.value / max) * plotHeight;
          const x = PADDING.left + i * slot + (slot - barWidth) / 2;
          const y = PADDING.top + (plotHeight - barHeight);
          const cx = x + barWidth / 2;
          return (
            <g key={`${point.label}-${i}`}>
              <rect x={x} y={y} width={barWidth} height={barHeight} rx={3} className="fill-blue-600" />
              <text
                x={cx}
                y={HEIGHT - 8}
                textAnchor="middle"
                transform={isRtl ? `translate(${2 * cx}, 0) scale(-1, 1)` : undefined}
                className="fill-gray-400 text-[10px]"
              >
                {point.label}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
