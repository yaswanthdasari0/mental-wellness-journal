"use client";

const WEEK_DATA = [
  { day: "Mon", value: 4, label: "Happy" },
  { day: "Tue", value: 4, label: "Happy" },
  { day: "Wed", value: 3, label: "Neutral" },
  { day: "Thu", value: 2, label: "Low" },
  { day: "Fri", value: 4, label: "Happy" },
  { day: "Sat", value: 5, label: "Great" },
  { day: "Sun", value: 3, label: "Neutral" },
];

const WIDTH = 600;
const HEIGHT = 160;
const PADDING_X = 24;
const MAX_VALUE = 5;
const MIN_VALUE = 1;

function getY(value: number) {
  const ratio = (value - MIN_VALUE) / (MAX_VALUE - MIN_VALUE);
  return HEIGHT - ratio * (HEIGHT - 24) - 12;
}

function getX(index: number) {
  const step = (WIDTH - PADDING_X * 2) / (WEEK_DATA.length - 1);
  return PADDING_X + step * index;
}

export default function MoodChart() {
  const points = WEEK_DATA.map((d, i) => ({ x: getX(i), y: getY(d.value), ...d }));
  const linePath = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${HEIGHT} L ${points[0].x} ${HEIGHT} Z`;

  const peak = points.reduce((max, p) => (p.value > max.value ? p : max), points[0]);

  return (
    <>
      <style>{`
        .mood-chart-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          padding: 1.6rem 1.7rem 1.2rem;
          margin-top: 1.2rem;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
        }

        .mood-chart-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 0.4rem;
        }
        .mood-chart-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
        }
        .mood-chart-sub {
          font-size: 0.78rem;
          color: #94a3b8;
        }

        .mood-chart-svg-wrap {
          width: 100%;
          position: relative;
          margin-top: 0.6rem;
        }

        .mood-callout {
          fill: #16a34a;
        }
        .mood-callout-text {
          fill: #ffffff;
          font-family: 'Inter', sans-serif;
          font-size: 10px;
          font-weight: 600;
        }

        .mood-day-label {
          fill: #94a3b8;
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          font-weight: 500;
        }
      `}</style>

      <div className="mood-chart-card">
        <div className="mood-chart-header">
          <div className="mood-chart-title">Weekly Mood Overview</div>
          <div className="mood-chart-sub">Sat was your best day</div>
        </div>

        <div className="mood-chart-svg-wrap">
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT + 28}`} width="100%" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="moodFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path d={areaPath} fill="url(#moodFill)" />

            <path d={linePath} fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={p === peak ? 5 : 3.5}
                fill={p === peak ? "#16a34a" : "#ffffff"}
                stroke="#16a34a"
                strokeWidth="2"
              />
            ))}

            <g transform={`translate(${peak.x}, ${peak.y - 34})`}>
              <rect className="mood-callout" x="-22" y="-12" width="44" height="22" rx="6" />
              <polygon className="mood-callout" points="-5,10 5,10 0,18" />
              <text className="mood-callout-text" x="0" y="3" textAnchor="middle">{peak.label}</text>
            </g>

            {points.map((p, i) => (
              <text key={i} className="mood-day-label" x={p.x} y={HEIGHT + 20} textAnchor="middle">
                {p.day}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </>
  );
}