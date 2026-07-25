"use client";
import React, { useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

/**
 * Reusable, shadcn-styled pie / donut chart.
 *
 * Usage:
 * <PieChartTemp
 *   data={[
 *     { name: "Chrome", value: 4200 },
 *     { name: "Safari", value: 1800 },
 *     { name: "Firefox", value: 900 },
 *   ]}
 *   title="Browser Share"
 *   description="Last 30 days"
 * />
 */

const DEFAULT_COLORS = [
  "#2563eb", // blue-600
  "#f97316", // orange-500
  "#16a34a", // green-600
  "#dc2626", // red-600
  "#9333ea", // purple-600
  "#0891b2", // cyan-600
];

function CustomTooltip({ active, payload, total }) {
  if (!active || !payload || !payload.length) return null;
  const entry = payload[0];
  const pct = total ? ((entry.value / total) * 100).toFixed(1) : null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md text-sm">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-2 w-2 rounded-full"
          style={{ backgroundColor: entry.payload.fill }}
        />
        <span className="text-slate-500">{entry.name}</span>
        <span className="ml-auto font-mono font-medium text-slate-900">
          {entry.value.toLocaleString()}
        </span>
      </div>
      {pct && (
        <div className="mt-0.5 text-right text-xs text-slate-400">{pct}%</div>
      )}
    </div>
  );
}

function CustomLegend({ items, hidden, onToggle, total }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
      {items.map((item) => {
        const isHidden = hidden.has(item.name);
        const pct = total ? ((item.value / total) * 100).toFixed(0) : null;
        return (
          <button
            key={item.name}
            type="button"
            onClick={() => onToggle(item.name)}
            className="flex items-center gap-1.5 text-xs font-medium transition-opacity"
            style={{ opacity: isHidden ? 0.4 : 1 }}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-600">{item.name}</span>
            {pct && <span className="text-slate-400">{pct}%</span>}
          </button>
        );
      })}
    </div>
  );
}

export default function PieChartTemp({
  data = [],
  nameKey = "name",
  valueKey = "value",
  colors,
  title,
  description,
  height = 320,
  showLegend = true,
  donut = true,
  showCenterTotal = true,
  centerLabel = "Total",
  className = "",
}) {
  const [hidden, setHidden] = useState(new Set());

  const palette = colors && colors.length ? colors : DEFAULT_COLORS;

  const resolvedData = useMemo(
    () =>
      data.map((d, i) => ({
        name: d[nameKey],
        value: d[valueKey],
        color: palette[i % palette.length],
      })),
    [data, nameKey, valueKey, palette],
  );

  const visibleData = resolvedData.filter((d) => !hidden.has(d.name));
  const total = visibleData.reduce((sum, d) => sum + d.value, 0);
  const grandTotal = resolvedData.reduce((sum, d) => sum + d.value, 0);

  const toggleSlice = (name) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const isEmpty = !data || data.length === 0;

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-sm uppercase font-semibold text-gray-600">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
      )}

      {isEmpty ? (
        <div
          className="flex items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-400"
          style={{ height }}
        >
          No data to display
        </div>
      ) : (
        <div style={{ width: "100%", height, position: "relative" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={visibleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={donut ? "60%" : 0}
                outerRadius="85%"
                paddingAngle={visibleData.length > 1 ? 2 : 0}
                stroke="#ffffff"
                strokeWidth={2}
              >
                {visibleData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>

          {donut && showCenterTotal && (
            <div
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
              style={{ paddingBottom: showLegend ? 0 : undefined }}
            >
              <span className="text-2xl font-semibold text-slate-900">
                {total.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">{centerLabel}</span>
            </div>
          )}
        </div>
      )}

      {showLegend && !isEmpty && (
        <CustomLegend
          items={resolvedData}
          hidden={hidden}
          onToggle={toggleSlice}
          total={grandTotal}
        />
      )}
    </div>
  );
}

// --- Demo wrapper so this file previews standalone ---
export function PieChartTempDemo() {
  const sampleData = [
    { name: "Chrome", value: 4200 },
    { name: "Safari", value: 1800 },
    { name: "Firefox", value: 900 },
    { name: "Edge", value: 600 },
    { name: "Other", value: 300 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <PieChartTemp
          data={sampleData}
          title="Browser Share"
          description="Last 30 days"
        />
      </div>
    </div>
  );
}
