"use client";

import { useState } from "react";
import { createJournal } from "@/services/journal";
import { Journal } from "@/services/journal";

export default function JournalEditor({ onSave }: { onSave?: (journal: Journal) => void }) {
  const [title, setTitle]     = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [saved, setSaved]     = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setError("");
    setLoading(true);

    try {
      const journal = await createJournal({ title, content });
      setSaved(true);
      setTitle("");
      setContent("");
      onSave?.(journal); // notify parent to refresh list
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to save entry.");
    } finally {
      setLoading(false);
    }
  };

  const charCount = content.length;

  return (
    <>
      <style>{`
        .journal-editor-card {
          background: #ffffff; border: 1px solid #e8eaed;
          border-radius: 18px; overflow: hidden;
          box-shadow: 0 1px 2px rgba(15,23,42,0.03);
        }
        .journal-editor-toolbar {
          background: #f7f8fa; border-bottom: 1px solid #e8eaed;
          padding: 0.7rem 1.4rem; display: flex; align-items: center; gap: 0.4rem;
        }
        .toolbar-dot { width: 9px; height: 9px; border-radius: 50%; }
        .toolbar-dot.red   { background: #ef4444; opacity: 0.5; }
        .toolbar-dot.amber { background: #f59e0b; opacity: 0.5; }
        .toolbar-dot.green { background: #22c55e; opacity: 0.5; }
        .toolbar-date { margin-left: auto; font-size: 0.72rem; color: #94a3b8; }
        .journal-editor-body { padding: 1.6rem 1.8rem; }
        .journal-title-input {
          width: 100%; border: none; outline: none;
          font-family: 'DM Serif Display', serif; font-size: 1.5rem;
          color: #0f172a; letter-spacing: -0.02em; background: transparent;
          margin-bottom: 0.3rem; padding: 0;
        }
        .journal-title-input::placeholder { color: #d1d5db; }
        .journal-editor-divider { height: 1px; background: #f1f3f5; margin: 0.8rem 0; }
        .journal-content-input {
          width: 100%; border: none; outline: none;
          font-family: 'Inter', sans-serif; font-size: 0.925rem;
          color: #334155; line-height: 1.85; background: transparent;
          resize: none; min-height: 220px; padding: 0;
        }
        .journal-content-input::placeholder { color: #d1d5db; }
        .journal-editor-error {
          font-size: 0.8rem; color: #f87171; margin: 0 1.8rem;
          padding: 0.5rem 0.8rem;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.2); border-radius: 7px;
        }
        .journal-editor-footer {
          padding: 1rem 1.8rem 1.5rem; border-top: 1px solid #f1f3f5;
          display: flex; align-items: center; justify-content: space-between; gap: 1rem;
        }
        .journal-char-count { font-size: 0.76rem; color: #94a3b8; }
        .journal-save-row { display: flex; align-items: center; gap: 1rem; }
        .journal-saved-toast { font-size: 0.8rem; color: #16a34a; font-weight: 500; }
        .journal-save-btn {
          background: #16a34a; color: #ffffff; border: none;
          padding: 0.7rem 1.6rem; border-radius: 9px;
          font-size: 0.875rem; font-weight: 600; cursor: pointer;
          transition: background 0.2s; font-family: 'Inter', sans-serif;
        }
        .journal-save-btn:hover { background: #15803d; }
        .journal-save-btn:disabled {
          background: #e8eaed; color: #94a3b8; cursor: not-allowed;
        }
      `}</style>

      <div className="journal-editor-card">
        <div className="journal-editor-toolbar">
          <div className="toolbar-dot red" />
          <div className="toolbar-dot amber" />
          <div className="toolbar-dot green" />
          <div className="toolbar-date">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </div>
        </div>

        <div className="journal-editor-body">
          <input
            type="text"
            className="journal-title-input"
            placeholder="Entry title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="journal-editor-divider" />
          <textarea
            className="journal-content-input"
            placeholder="Write what's on your mind. There's no right way to do this."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {error && <div className="journal-editor-error">{error}</div>}

        <div className="journal-editor-footer">
          <div className="journal-char-count">{charCount} characters</div>
          <div className="journal-save-row">
            {saved && <div className="journal-saved-toast">Entry saved.</div>}
            <button
              className="journal-save-btn"
              onClick={handleSave}
              disabled={!title.trim() || !content.trim() || loading}
            >
              {loading ? "Saving..." : "Save Entry"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}