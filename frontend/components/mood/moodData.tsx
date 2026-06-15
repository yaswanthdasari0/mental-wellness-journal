// Shared mood definitions and SVG icons — used by MoodSelector, MoodCard, MoodHistory, MoodCalendar

export const MOOD_OPTIONS = [
  { id: "great", label: "Great", color: "#16a34a" },
  { id: "happy", label: "Happy", color: "#22c55e" },
  { id: "neutral", label: "Neutral", color: "#94a3b8" },
  { id: "sad", label: "Sad", color: "#60a5fa" },
  { id: "stressed", label: "Stressed", color: "#f59e0b" },
] as const;

export type MoodId = typeof MOOD_OPTIONS[number]["id"];

export function getMoodColor(id: string) {
  return MOOD_OPTIONS.find((m) => m.id === id)?.color ?? "#94a3b8";
}

export function getMoodLabel(id: string) {
  return MOOD_OPTIONS.find((m) => m.id === id)?.label ?? id;
}

const common = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function MoodIcon({ mood, size = 22 }: { mood: string; size?: number }) {
  const props = { ...common, width: size, height: size };

  switch (mood) {
    case "great":
      // Wide smile, raised brows
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M7.5 13.5c1.2 1.8 3 2.8 4.5 2.8s3.3-1 4.5-2.8" />
          <path d="M8 9c.5-.6 1.2-1 2-1M14 9c.5-.6 1.2-1 2-1" />
        </svg>
      );
    case "happy":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14c1 1.3 2.4 2 4 2s3-.7 4-2" />
          <path d="M9 9h.01M15 9h.01" />
        </svg>
      );
    case "neutral":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 14.5h8" />
          <path d="M9 9h.01M15 9h.01" />
        </svg>
      );
    case "sad":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 15.5c1-1.3 2.4-2 4-2s3 .7 4 2" />
          <path d="M9 9h.01M15 9h.01" />
        </svg>
      );
    case "stressed":
      // Wavy mouth, furrowed brows
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 15c.7-.6 1.3-.6 2 0s1.3.6 2 0 1.3-.6 2 0 1.3.6 2 0" />
          <path d="M8 8.5 9.8 9.5M16 8.5 14.2 9.5" />
        </svg>
      );
    default:
      return null;
  }
}