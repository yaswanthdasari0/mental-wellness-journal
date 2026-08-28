"use client";

import { useState } from "react";
import { createGratitude, Gratitude } from "@/services/gratitude";

export default function GratitudeForm({
  onSave,
}: {
  onSave?: (entry: Gratitude) => void;
}) {
  const [items, setItems]   = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const [saved, setSaved]   = useState(false);

  const update = (index: number, value: string) => {
    setItems((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const canSave = items.some((v) => v.trim().length > 0);

  const handleSave = async () => {
    if (!canSave) return;
    setError("");
    setLoading(true);

    try {
      const cleaned = items.map((i) => i.trim()).filter((i) => i.length > 0);
      const entry = await createGratitude({ items: cleaned });
      setSaved(true);
      setItems(["", "", ""]);
      onSave?.(entry);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to save gratitude entry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .gratitude-form-card {
          background: #ffffff; border: 1px solid #e8eaed; border-radius: 18px;
          overflow: hidden; box-shadow: 0 1px 2px rgba(15,23,42,0.03);
        }
        .gratitude-form-header {
          background: #f7f8fa; border-bottom: 1px solid #e8eaed;
          padding: 0.75rem 1.6rem; display: flex; align-items: center; justify-content: space-between;
        }
        .gratitude-form-header-label { font-size: 0.78rem; color: #94a3b8; letter-spacing: 0.03em; }
        .gratitude-form-header-date  { font-size: 0.74rem; color: #cbd5e1; }
        .gratitude-form-body { padding: 1.6rem 1.8rem; display: flex; flex-direction: column; gap: 0.9rem; }
        .gratitude-input-row { display: flex; align-items: center; gap: 1rem; }
        .gratitude-input-num {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(22,163,74,0.08); color: #16a34a;
          font-size: 0.78rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .gratitude-input {
          flex: 1; border: none; border-bottom: 1px solid #e8eaed;
          background: transparent; padding: 0.55rem 0.2rem;
          font-size: 0.925rem; color: #334155;
          font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s;
        }
        .gratitude-input::placeholder { color: #d1d5db; }
        .gratitude-input:focus { border-bottom-color: #16a34a; }
        .gratitude-form-error {
          font-size: 0.8rem; color: #f87171;
          padding: 0.5rem 0.8rem; margin: 0 1.8rem;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2); border-radius: 7px;
        }
        .gratitude-form-footer {
          padding: 1rem 1.8rem 1.5rem; border-top: 1px solid #f1f3f5;
          display: flex; align-items: center; justify-content: flex-end; gap: 1rem;
        }
        .gratitude-saved-toast { font-size: 0.8rem; color: #16a34a; font-weight: 500; }
        .gratitude-save-btn {
          background: #16a34a; color: #ffffff; border: none;
          padding: 0.7rem 1.8rem; border-radius: 9px;
          font-size: 0.875rem; font-weight: 600; cursor: pointer;
          transition: background 0.2s; font-family: 'Inter', sans-serif;
        }
        .gratitude-save-btn:hover { background: #15803d; }
        .gratitude-save-btn:disabled { background: #e8eaed; color: #94a3b8; cursor: not-allowed; }
      `}</style>

      <div className="gratitude-form-card">
        <div className="gratitude-form-header">
          <span className="gratitude-form-header-label">Today I'm grateful for...</span>
          <span className="gratitude-form-header-date">
            {new Date().toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </span>
        </div>

        <div className="gratitude-form-body">
          {items.map((val, i) => (
            <div className="gratitude-input-row" key={i}>
              <div className="gratitude-input-num">{i + 1}</div>
              <input
                type="text"
                className="gratitude-input"
                placeholder={
                  [
                    "Something or someone you appreciate...",
                    "A moment from today...",
                    "Something easy to overlook...",
                  ][i]
                }
                value={val}
                onChange={(e) => update(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        {error && <div className="gratitude-form-error">{error}</div>}

        <div className="gratitude-form-footer">
          {saved && <span className="gratitude-saved-toast">Saved for today.</span>}
          <button
            className="gratitude-save-btn"
            onClick={handleSave}
            disabled={!canSave || loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}