"use client";
import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * Reusable, shadcn-styled line chart.
 *
 * Usage:
 * <LineChartTemp
 *   data={[
 *     { month: "Jan", revenue: 4000, expenses: 2400 },
 *     { month: "Feb", revenue: 3000, expenses: 1398 },
 *   ]}
 *   xKey="month"
 *   lines={[
 *     { key: "revenue", label: "Revenue", color: "#2563eb" },
 *     { key: "expenses", label: "Expenses", color: "#f97316" },
 *   ]}
 *   title="Revenue vs Expenses"
 *   description="Monthly performance"
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

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-md text-sm">
      <div className="mb-1 font-medium text-slate-900">{label}</div>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-500">{entry.name}</span>
            <span className="ml-auto font-mono font-medium text-slate-900">
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomLegend({ items, hidden, onToggle }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-3">
      {items.map((item) => {
        const isHidden = hidden.has(item.key);
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onToggle(item.key)}
            className="flex items-center gap-1.5 text-xs font-medium transition-opacity"
            style={{ opacity: isHidden ? 0.4 : 1 }}
          >
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-600">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default function LineChartTemp({
  data = [],
  xKey = "name",
  lines,
  title,
  description,
  height = 320,
  showLegend = true,
  showGrid = true,
  curved = true,
  className = "",
}) {
  // Infer line series from data if not explicitly provided
  const resolvedLines = useMemo(() => {
    if (lines && lines.length) {
      return lines.map((l, i) => ({
        color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        label: l.key,
        ...l,
      }));
    }
    if (!data.length) return [];
    const keys = Object.keys(data[0]).filter((k) => k !== xKey);
    return keys.map((key, i) => ({
      key,
      label: key,
      color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    }));
  }, [lines, data, xKey]);

  const [hidden, setHidden] = useState(new Set());

  const toggleLine = (key) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
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
        <div style={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
            >
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
              )}
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                axisLine={{ stroke: "#e2e8f0" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#cbd5e1" }}
              />
              {resolvedLines.map((line) =>
                hidden.has(line.key) ? null : (
                  <Line
                    key={line.key}
                    type={curved ? "monotone" : "linear"}
                    dataKey={line.key}
                    name={line.label}
                    stroke={line.color}
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 0, fill: line.color }}
                    activeDot={{ r: 5 }}
                  />
                ),
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {showLegend && !isEmpty && (
        <CustomLegend
          items={resolvedLines}
          hidden={hidden}
          onToggle={toggleLine}
        />
      )}
    </div>
  );
}
