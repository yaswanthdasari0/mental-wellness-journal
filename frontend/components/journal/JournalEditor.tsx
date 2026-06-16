"use client";

import { useState } from "react";

export default function JournalEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    // TODO: POST /api/journal
    console.log({ title, content, date: new Date().toISOString() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const charCount = content.length;

  return (
    <>
      <style>{`
        .journal-editor-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
        }

        /* Top bar — mimics a real text editor toolbar */
        .journal-editor-toolbar {
          background: #f7f8fa;
          border-bottom: 1px solid #e8eaed;
          padding: 0.7rem 1.4rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .toolbar-dot {
          width: 9px; height: 9px;
          border-radius: 50%;
        }
        .toolbar-dot.red   { background: #ef4444; opacity: 0.5; }
        .toolbar-dot.amber { background: #f59e0b; opacity: 0.5; }
        .toolbar-dot.green { background: #22c55e; opacity: 0.5; }
        .toolbar-date {
          margin-left: auto;
          font-size: 0.72rem;
          color: #94a3b8;
          letter-spacing: 0.03em;
        }

        .journal-editor-body {
          padding: 1.6rem 1.8rem;
        }

        /* Title field — large, no box, feels like a real editor */
        .journal-title-input {
          width: 100%;
          border: none;
          outline: none;
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          color: #0f172a;
          letter-spacing: -0.02em;
          background: transparent;
          margin-bottom: 0.3rem;
          padding: 0;
        }
        .journal-title-input::placeholder { color: #d1d5db; }

        .journal-editor-divider {
          height: 1px;
          background: #f1f3f5;
          margin: 0.8rem 0;
        }

        /* Content area */
        .journal-content-input {
          width: 100%;
          border: none;
          outline: none;
          font-family: 'Inter', sans-serif;
          font-size: 0.925rem;
          color: #334155;
          line-height: 1.85;
          background: transparent;
          resize: none;
          min-height: 220px;
          padding: 0;
        }
        .journal-content-input::placeholder { color: #d1d5db; }

        .journal-editor-footer {
          padding: 1rem 1.8rem 1.5rem;
          border-top: 1px solid #f1f3f5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .journal-char-count {
          font-size: 0.76rem;
          color: #94a3b8;
        }

        .journal-save-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .journal-save-btn {
          background: #16a34a;
          color: #ffffff;
          border: none;
          padding: 0.7rem 1.6rem;
          border-radius: 9px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          letter-spacing: 0.01em;
        }
        .journal-save-btn:hover { background: #15803d; }
        .journal-save-btn:disabled {
          background: #e8eaed;
          color: #94a3b8;
          cursor: not-allowed;
        }

        .journal-saved-toast {
          font-size: 0.8rem;
          color: #16a34a;
          font-weight: 500;
        }

        @media (max-width: 560px) {
          .journal-editor-body { padding: 1.2rem 1.2rem; }
          .journal-editor-footer { padding: 0.9rem 1.2rem 1.2rem; flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="journal-editor-card">
        <div className="journal-editor-toolbar">
          <div className="toolbar-dot red" />
          <div className="toolbar-dot amber" />
          <div className="toolbar-dot green" />
          <div className="toolbar-date">
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
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
            placeholder={"Write what's on your mind. There's no right way to do this."}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="journal-editor-footer">
          <div className="journal-char-count">{charCount} characters</div>
          <div className="journal-save-row">
            {saved && <div className="journal-saved-toast">Entry saved.</div>}
            <button
              className="journal-save-btn"
              onClick={handleSave}
              disabled={!title.trim() || !content.trim()}
            >
              Save Entry
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
