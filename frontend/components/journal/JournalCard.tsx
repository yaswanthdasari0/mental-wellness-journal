"use client";

import { useState } from "react";
import { updateJournal, deleteJournal, Journal } from "@/services/journal";

function BookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v18H5.5A1.5 1.5 0 0 1 4 19.5z" />
      <path d="M12 3h6.5A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5H12" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  );
}

interface JournalCardProps {
  journal: Journal;
  onUpdate: (updated: Journal) => void;
  onDelete: (id: string) => void;
}

export default function JournalCard({ journal, onUpdate, onDelete }: JournalCardProps) {
  const [editing, setEditing]   = useState(false);
  const [title, setTitle]       = useState(journal.title);
  const [content, setContent]   = useState(journal.content);
  const [loading, setLoading]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState("");

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError("");

    try {
      const updated = await updateJournal(journal.id, { title, content });
      onUpdate(updated);
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this journal entry? This can't be undone.")) return;
    setDeleting(true);

    try {
      await deleteJournal(journal.id);
      onDelete(journal.id);
    } catch (err: any) {
      setError(err.message || "Failed to delete entry.");
      setDeleting(false);
    }
  };

  const formattedDate = new Date(journal.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <>
      <style>{`
        .journal-card {
          background: #ffffff; border: 1px solid #e8eaed; border-radius: 14px;
          padding: 1.2rem 1.4rem; transition: box-shadow 0.2s, border-color 0.2s;
        }
        .journal-card:hover { border-color: #d1d5db; box-shadow: 0 4px 14px rgba(15,23,42,0.06); }

        .journal-card-top {
          display: flex; align-items: flex-start; gap: 1rem;
        }
        .journal-card-icon {
          width: 38px; height: 38px; border-radius: 10px; background: #f0fdf4;
          color: #16a34a; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; margin-top: 0.1rem;
        }
        .journal-card-body { flex: 1; min-width: 0; }
        .journal-card-title {
          font-size: 0.95rem; font-weight: 600; color: #0f172a;
          margin-bottom: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .journal-card-preview {
          font-size: 0.84rem; color: #64748b; line-height: 1.6;
          display: -webkit-box; -webkit-line-clamp: 2;
          -webkit-box-orient: vertical; overflow: hidden;
        }
        .journal-card-meta {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 0.8rem;
        }
        .journal-card-date { font-size: 0.74rem; color: #94a3b8; font-weight: 500; }
        .journal-card-actions { display: flex; gap: 0.5rem; }
        .journal-action-btn {
          display: flex; align-items: center; gap: 0.3rem;
          font-size: 0.76rem; font-weight: 500; padding: 0.35rem 0.7rem;
          border-radius: 7px; border: 1px solid #e8eaed; background: transparent;
          cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif;
          color: #64748b;
        }
        .journal-action-btn:hover { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }
        .journal-action-btn.delete:hover { border-color: #f43f5e; color: #f43f5e; background: #fff1f2; }
        .journal-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Edit form */
        .journal-edit-form { margin-top: 0.8rem; display: flex; flex-direction: column; gap: 0.7rem; }
        .journal-edit-input {
          width: 100%; background: #f7f8fa; border: 1px solid #e8eaed;
          border-radius: 8px; padding: 0.65rem 0.9rem;
          font-size: 0.875rem; color: #334155; font-family: 'Inter', sans-serif; outline: none;
          transition: border-color 0.2s;
        }
        .journal-edit-input:focus { border-color: #16a34a; }
        .journal-edit-textarea {
          width: 100%; background: #f7f8fa; border: 1px solid #e8eaed;
          border-radius: 8px; padding: 0.65rem 0.9rem;
          font-size: 0.875rem; color: #334155; line-height: 1.65;
          font-family: 'Inter', sans-serif; outline: none; resize: vertical;
          min-height: 100px; transition: border-color 0.2s;
        }
        .journal-edit-textarea:focus { border-color: #16a34a; }
        .journal-edit-actions { display: flex; gap: 0.6rem; justify-content: flex-end; }
        .journal-edit-save {
          background: #16a34a; color: #fff; border: none;
          padding: 0.55rem 1.2rem; border-radius: 7px;
          font-size: 0.82rem; font-weight: 600; cursor: pointer;
          font-family: 'Inter', sans-serif; transition: background 0.2s;
        }
        .journal-edit-save:hover { background: #15803d; }
        .journal-edit-save:disabled { background: #e8eaed; color: #94a3b8; cursor: not-allowed; }
        .journal-edit-cancel {
          background: transparent; border: 1px solid #e8eaed; color: #64748b;
          padding: 0.55rem 1.1rem; border-radius: 7px;
          font-size: 0.82rem; cursor: pointer; font-family: 'Inter', sans-serif;
        }
        .journal-card-error {
          font-size: 0.78rem; color: #f87171; margin-top: 0.5rem;
        }
      `}</style>

      <div className="journal-card">
        <div className="journal-card-top">
          <div className="journal-card-icon"><BookIcon /></div>
          <div className="journal-card-body">
            <div className="journal-card-title">{journal.title}</div>
            {!editing && (
              <div className="journal-card-preview">{journal.content}</div>
            )}
          </div>
        </div>

        {editing ? (
          <div className="journal-edit-form">
            <input
              className="journal-edit-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
            />
            <textarea
              className="journal-edit-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
            />
            {error && <div className="journal-card-error">{error}</div>}
            <div className="journal-edit-actions">
              <button className="journal-edit-cancel" onClick={() => { setEditing(false); setTitle(journal.title); setContent(journal.content); }}>
                Cancel
              </button>
              <button
                className="journal-edit-save"
                onClick={handleUpdate}
                disabled={loading || !title.trim() || !content.trim()}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <div className="journal-card-meta">
            <div className="journal-card-date">{formattedDate}</div>
            <div className="journal-card-actions">
              <button className="journal-action-btn" onClick={() => setEditing(true)}>
                <EditIcon /> Edit
              </button>
              <button
                className="journal-action-btn delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                <TrashIcon /> {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}

        {!editing && error && <div className="journal-card-error">{error}</div>}
      </div>
    </>
  );
}