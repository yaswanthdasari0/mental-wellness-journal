"use client";

import { useState } from "react";
import { MOOD_OPTIONS, MoodIcon, MoodId } from "./moodData";

export default function MoodSelector() {
  const [selected, setSelected] = useState<MoodId | null>(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!selected) return;
    // TODO: connect to backend — POST /api/mood
    console.log({ mood: selected, note });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <style>{`
        .mood-selector-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          padding: 1.8rem;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
        }

        .mood-selector-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin-bottom: 1.4rem;
        }

        .mood-options {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.4rem;
        }

        .mood-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 0.9rem 1.1rem;
          border-radius: 14px;
          border: 1.5px solid #e8eaed;
          background: #ffffff;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, transform 0.15s;
          min-width: 84px;
          flex: 1;
        }
        .mood-option:hover {
          border-color: #d8dde2;
          transform: translateY(-2px);
        }
        .mood-option.selected {
          border-color: var(--mood-color);
          background: color-mix(in srgb, var(--mood-color) 8%, white);
        }
        .mood-option-icon {
          color: #94a3b8;
          transition: color 0.15s;
        }
        .mood-option.selected .mood-option-icon {
          color: var(--mood-color);
        }
        .mood-option-label {
          font-size: 0.78rem;
          font-weight: 500;
          color: #64748b;
        }
        .mood-option.selected .mood-option-label {
          color: var(--mood-color);
          font-weight: 600;
        }

        .mood-note-label {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .mood-note-input {
          width: 100%;
          background: #f7f8fa;
          border: 1px solid #e8eaed;
          border-radius: 10px;
          padding: 0.8rem 1rem;
          font-size: 0.875rem;
          color: #334155;
          font-family: 'Inter', sans-serif;
          resize: vertical;
          min-height: 80px;
          transition: border-color 0.2s;
        }
        .mood-note-input::placeholder { color: #94a3b8; }
        .mood-note-input:focus {
          outline: none;
          border-color: #16a34a;
        }

        .mood-save-btn {
          width: 100%;
          margin-top: 1.2rem;
          background: #16a34a;
          color: #ffffff;
          border: none;
          padding: 0.85rem 1.8rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .mood-save-btn:hover { background: #15803d; }
        .mood-save-btn:disabled {
          background: #e8eaed;
          color: #94a3b8;
          cursor: not-allowed;
        }

        .mood-saved-toast {
          margin-top: 0.8rem;
          font-size: 0.8rem;
          color: #16a34a;
          font-weight: 500;
          text-align: center;
        }

        @media (max-width: 560px) {
          .mood-options { gap: 0.5rem; }
          .mood-option { min-width: 0; padding: 0.7rem 0.6rem; }
        }
      `}</style>

      <div className="mood-selector-card">
        <h2 className="mood-selector-title">How are you feeling today?</h2>

        <div className="mood-options">
          {MOOD_OPTIONS.map((m) => (
            <div
              key={m.id}
              className={`mood-option${selected === m.id ? " selected" : ""}`}
              style={{ "--mood-color": m.color } as React.CSSProperties}
              onClick={() => setSelected(m.id)}
            >
              <span className="mood-option-icon"><MoodIcon mood={m.id} size={28} /></span>
              <span className="mood-option-label">{m.label}</span>
            </div>
          ))}
        </div>

        <label className="mood-note-label" htmlFor="mood-note">Add a note (optional)</label>
        <textarea
          id="mood-note"
          className="mood-note-input"
          placeholder="What made you feel this way?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button className="mood-save-btn" onClick={handleSave} disabled={!selected}>
          Save Mood
        </button>

        {saved && <div className="mood-saved-toast">Mood saved for today.</div>}
      </div>
    </>
  );
}