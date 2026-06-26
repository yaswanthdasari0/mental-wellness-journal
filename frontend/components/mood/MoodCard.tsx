"use client";

import { MoodIcon, getMoodColor, getMoodLabel } from "./moodData";

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  );
}

export interface MoodCardProps {
  mood: string;
  note?: string;
  date?: string;
  compact?: boolean;
  onDelete?: () => void;
}

export default function MoodCard({ mood, note, date, compact = false, onDelete }: MoodCardProps) {
  const color = getMoodColor(mood);
  const label = getMoodLabel(mood);

  return (
    <>
      <style>{`
        .mood-card {
          background: #ffffff; border: 1px solid #e8eaed; border-radius: 16px;
          padding: 1.3rem 1.5rem; box-shadow: 0 1px 2px rgba(15,23,42,0.03);
          display: flex; gap: 1rem;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .mood-card:hover { border-color: #d8dde2; box-shadow: 0 4px 14px rgba(15,23,42,0.05); }

        .mood-card-icon {
          width: 46px; height: 46px; border-radius: 12px;
          background: color-mix(in srgb, var(--mood-color) 12%, white);
          color: var(--mood-color);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .mood-card-body { display: flex; flex-direction: column; gap: 0.3rem; min-width: 0; flex: 1; }
        .mood-card-date { font-size: 0.74rem; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em; }
        .mood-card-label { font-size: 1rem; font-weight: 600; color: #0f172a; }
        .mood-card-note { font-size: 0.85rem; color: #64748b; line-height: 1.6; margin-top: 0.2rem; }

        .mood-card-delete {
          display: flex; align-items: flex-start;
          background: transparent; border: none; cursor: pointer;
          color: #cbd5e1; padding: 0.2rem; transition: color 0.15s;
          flex-shrink: 0;
        }
        .mood-card-delete:hover { color: #f43f5e; }

        .mood-card.compact { padding: 1.1rem 1.3rem; }
        .mood-card.compact .mood-card-icon { width: 40px; height: 40px; }
      `}</style>

      <div
        className={`mood-card${compact ? " compact" : ""}`}
        style={{ "--mood-color": color } as React.CSSProperties}
      >
        <div className="mood-card-icon">
          <MoodIcon mood={mood} size={22} />
        </div>
        <div className="mood-card-body">
          {date && <div className="mood-card-date">{date}</div>}
          <div className="mood-card-label">{label}</div>
          {note && <div className="mood-card-note">{note}</div>}
        </div>
        {onDelete && (
          <button className="mood-card-delete" onClick={onDelete} title="Delete">
            <TrashIcon />
          </button>
        )}
      </div>
    </>
  );
}