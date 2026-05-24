"use client";

import { useLocale } from "next-intl";
import type { Locale, TimeSeriesPoint } from "@/lib/types";

const WIDTH = 720;
const HEIGHT = 220;
const PADDING = { top: 16, right: 12, bottom: 28, left: 12 };

/** Generic SVG line chart (no library, no inline styles). RTL-mirrored. */
export function LineChart({ data }: { data: TimeSeriesPoint[] }) {
  const isRtl = (useLocale() as Locale) === "ar";
  if (data.length === 0) return null;

  const plotWidth = WIDTH - PADDING.left - PADDING.right;
  const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
  const max = Math.max(...data.map((d) => d.value), 1);
  const stepX = data.length > 1 ? plotWidth / (data.length - 1) : 0;

  const points = data.map((point, i) => {
    const x = PADDING.left + i * stepX;
    const y = PADDING.top + (plotHeight - (point.value / max) * plotHeight);
    return { x, y, label: point.label };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
  const areaPath =
    `M ${points[0].x} ${PADDING.top + plotHeight} ` +
    points.map((p) => `L ${p.x} ${p.y}`).join(" ") +
    ` L ${points[points.length - 1].x} ${PADDING.top + plotHeight} Z`;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-56 w-full" role="img" preserveAspectRatio="none">
      <g transform={isRtl ? `translate(${WIDTH}, 0) scale(-1, 1)` : undefined}>
        <path d={areaPath} className="fill-blue-600/10" />
        <path d={linePath} fill="none" strokeWidth={2} className="stroke-blue-600" />
        {points.map((p, i) => (
          <g key={`${p.label}-${i}`}>
            <circle cx={p.x} cy={p.y} r={3} className="fill-blue-600" />
            <text
              x={p.x}
              y={HEIGHT - 8}
              textAnchor="middle"
              transform={isRtl ? `translate(${2 * p.x}, 0) scale(-1, 1)` : undefined}
              className="fill-gray-400 text-[10px]"
            >
              {p.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
