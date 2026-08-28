"use client";

import { useEffect, useState } from "react";
import { getMoods, Mood } from "@/services/mood";

// Mood scale for chart height
const MOOD_SCORE: Record<string, number> = {
  great:    5,
  happy:    4,
  neutral:  3,
  sad:      2,
  stressed: 1,
};

const WIDTH     = 600;
const HEIGHT    = 160;
const PADDING_X = 24;
const MAX_VAL   = 5;
const MIN_VAL   = 1;

function getY(value: number) {
  const ratio = (value - MIN_VAL) / (MAX_VAL - MIN_VAL);
  return HEIGHT - ratio * (HEIGHT - 24) - 12;
}

function getX(index: number, total: number) {
  const step = (WIDTH - PADDING_X * 2) / Math.max(total - 1, 1);
  return PADDING_X + step * index;
}

// Get the last 7 days as labels + date strings for matching
function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i)); // oldest → newest
    return {
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      dateStr: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
    };
  });
}

export default function MoodChart() {
  const [points, setPoints] = useState<
    { x: number; y: number; value: number; label: string; day: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const moods: Mood[] = await getMoods();

        const last7 = getLast7Days();

        // Build a map: dateStr → latest mood score that day
        const scoreByDay: Record<string, number> = {};
        moods.forEach((m) => {
          const d = new Date(m.createdAt);
          const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
          // Only set if not already set (API returns newest first)
          if (scoreByDay[key] === undefined) {
            scoreByDay[key] = MOOD_SCORE[m.mood] ?? 3;
          }
        });

        // Build points — days with no entry default to neutral (3)
        const built = last7.map((day, i) => {
          const value = scoreByDay[day.dateStr] ?? 3;
          return {
            x:     getX(i, last7.length),
            y:     getY(value),
            value,
            label: Object.keys(MOOD_SCORE).find((k) => MOOD_SCORE[k] === value) ?? "neutral",
            day:   day.label,
          };
        });

        setPoints(built);
      } catch (err: any) {
        setError(err.message || "Failed to load mood data.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const peak = points.length
    ? points.reduce((max, p) => (p.value > max.value ? p : max), points[0])
    : null;

  const linePath = points
    .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
    .join(" ");

  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${HEIGHT} L ${points[0].x} ${HEIGHT} Z`
    : "";

  return (
    <>
      <style>{`
        .mood-chart-card {
          background: #ffffff; border: 1px solid #e8eaed; border-radius: 18px;
          padding: 1.6rem 1.7rem 1.2rem; margin-top: 1.2rem;
          box-shadow: 0 1px 2px rgba(15,23,42,0.03);
        }
        .mood-chart-header {
          display: flex; align-items: baseline; justify-content: space-between;
          margin-bottom: 0.4rem;
        }
        .mood-chart-title { font-size: 0.95rem; font-weight: 600; color: #0f172a; }
        .mood-chart-sub   { font-size: 0.78rem; color: #94a3b8; }
        .mood-chart-svg-wrap { width: 100%; position: relative; margin-top: 0.6rem; }
        .mood-callout      { fill: #16a34a; }
        .mood-callout-text { fill: #ffffff; font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600; }
        .mood-day-label    { fill: #94a3b8; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; }
        .mood-chart-loading { font-size: 0.85rem; color: #94a3b8; padding: 1rem 0; }
        .mood-chart-error   { font-size: 0.82rem; color: #f87171; padding: 0.5rem 0; }
      `}</style>

      <div className="mood-chart-card">
        <div className="mood-chart-header">
          <div className="mood-chart-title">Weekly Mood Overview</div>
          <div className="mood-chart-sub">
            {peak ? `${peak.day} was your best day` : "Last 7 days"}
          </div>
        </div>

        {loading && <div className="mood-chart-loading">Loading chart...</div>}
        {error   && <div className="mood-chart-error">{error}</div>}

        {!loading && !error && points.length > 0 && (
          <div className="mood-chart-svg-wrap">
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT + 28}`}
              width="100%"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#16a34a" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0"    />
                </linearGradient>
              </defs>

              {/* Gradient area */}
              <path d={areaPath} fill="url(#moodFill)" />

              {/* Line */}
              <path
                d={linePath}
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Dots */}
              {points.map((p, i) => (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={peak && p === peak ? 5 : 3.5}
                  fill={peak && p === peak ? "#16a34a" : "#ffffff"}
                  stroke="#16a34a"
                  strokeWidth="2"
                />
              ))}

              {/* Callout on peak */}
              {peak && (
                <g transform={`translate(${peak.x}, ${peak.y - 34})`}>
                  <rect className="mood-callout" x="-22" y="-12" width="44" height="22" rx="6" />
                  <polygon className="mood-callout" points="-5,10 5,10 0,18" />
                  <text className="mood-callout-text" x="0" y="3" textAnchor="middle">
                    {peak.label.charAt(0).toUpperCase() + peak.label.slice(1)}
                  </text>
                </g>
              )}

              {/* Day labels */}
              {points.map((p, i) => (
                <text
                  key={i}
                  className="mood-day-label"
                  x={p.x}
                  y={HEIGHT + 20}
                  textAnchor="middle"
                >
                  {p.day}
                </text>
              ))}
            </svg>
          </div>
        )}
      </div>
    </>
  );
}