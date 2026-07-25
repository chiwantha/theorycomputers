"use client";
import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

/**
 * Reusable, shadcn-styled bar chart.
 *
 * Usage:
 * <BarChartTemp
 *   data={[
 *     { month: "Jan", revenue: 4000, expenses: 2400 },
 *     { month: "Feb", revenue: 3000, expenses: 1398 },
 *   ]}
 *   xKey="month"
 *   bars={[
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

export default function BarChartTemp({
  data = [],
  xKey = "name",
  bars,
  title,
  description,
  height = 320,
  showLegend = true,
  showGrid = true,
  stacked = false,
  horizontal = false,
  radius = 4,
  className = "",
}) {
  // Infer bar series from data if not explicitly provided
  const resolvedBars = useMemo(() => {
    if (bars && bars.length) {
      return bars.map((b, i) => ({
        color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        label: b.key,
        ...b,
      }));
    }
    if (!data.length) return [];
    const keys = Object.keys(data[0]).filter((k) => k !== xKey);
    return keys.map((key, i) => ({
      key,
      label: key,
      color: DEFAULT_COLORS[i % DEFAULT_COLORS.length],
    }));
  }, [bars, data, xKey]);

  const [hidden, setHidden] = useState(new Set());

  const toggleBar = (key) => {
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
  const visibleBars = resolvedBars.filter((b) => !hidden.has(b.key));
  const isSingleSeries = resolvedBars.length === 1;

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
            <BarChart
              data={data}
              layout={horizontal ? "vertical" : "horizontal"}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              barGap={4}
            >
              {showGrid && (
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  horizontal={!horizontal}
                  vertical={horizontal}
                />
              )}
              {horizontal ? (
                <>
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    type="category"
                    dataKey={xKey}
                    tick={{ fontSize: 12, fill: "#64748b" }}
                    tickLine={false}
                    axisLine={false}
                    width={70}
                  />
                </>
              ) : (
                <>
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
                </>
              )}
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f1f5f9" }}
              />
              {visibleBars.map((bar, i) => (
                <Bar
                  key={bar.key}
                  dataKey={bar.key}
                  name={bar.label}
                  fill={bar.color}
                  stackId={stacked ? "stack" : undefined}
                  radius={
                    stacked
                      ? i === visibleBars.length - 1
                        ? horizontal
                          ? [0, radius, radius, 0]
                          : [radius, radius, 0, 0]
                        : 0
                      : horizontal
                        ? [0, radius, radius, 0]
                        : [radius, radius, 0, 0]
                  }
                  maxBarSize={48}
                >
                  {isSingleSeries &&
                    data.map((entry, idx) => (
                      <Cell key={idx} fill={bar.color} fillOpacity={1} />
                    ))}
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {showLegend && !isEmpty && resolvedBars.length > 1 && (
        <CustomLegend
          items={resolvedBars}
          hidden={hidden}
          onToggle={toggleBar}
        />
      )}
    </div>
  );
}

// --- Demo wrapper so this file previews standalone ---
export function BarChartTempDemo() {
  const sampleData = [
    { month: "Jan", revenue: 4000, expenses: 2400 },
    { month: "Feb", revenue: 3000, expenses: 1398 },
    { month: "Mar", revenue: 5000, expenses: 3800 },
    { month: "Apr", revenue: 4780, expenses: 3908 },
    { month: "May", revenue: 5890, expenses: 4800 },
    { month: "Jun", revenue: 6390, expenses: 3800 },
    { month: "Jul", revenue: 7490, expenses: 4300 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <BarChartTemp
          data={sampleData}
          xKey="month"
          bars={[
            { key: "revenue", label: "Revenue", color: "#2563eb" },
            { key: "expenses", label: "Expenses", color: "#f97316" },
          ]}
          title="Revenue vs Expenses"
          description="Last 7 months"
        />
      </div>
    </div>
  );
}
