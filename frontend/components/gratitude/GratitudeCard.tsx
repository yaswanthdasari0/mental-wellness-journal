"use client";

import { useState } from "react";
import { updateGratitude, deleteGratitude, Gratitude } from "@/services/gratitude";

function HeartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 20.5 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9a4.6 4.6 0 0 1 6.5 6.5z" />
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

interface GratitudeCardProps {
  entry: Gratitude;
  onUpdate: (updated: Gratitude) => void;
  onDelete: (id: string) => void;
}

export default function GratitudeCard({ entry, onUpdate, onDelete }: GratitudeCardProps) {
  const [editing, setEditing]   = useState(false);
  const [items, setItems]       = useState<string[]>(entry.items);
  const [loading, setLoading]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState("");

  const updateItem = (index: number, value: string) => {
    setItems((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const handleUpdate = async () => {
    const cleaned = items.map((i) => i.trim()).filter((i) => i.length > 0);
    if (cleaned.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const updated = await updateGratitude(entry.id, { items: cleaned });
      onUpdate(updated);
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update entry.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this gratitude entry?")) return;
    setDeleting(true);

    try {
      await deleteGratitude(entry.id);
      onDelete(entry.id);
    } catch (err: any) {
      setError(err.message || "Failed to delete entry.");
      setDeleting(false);
    }
  };

  const formattedDate = new Date(entry.createdAt).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  return (
    <>
      <style>{`
        .gratitude-card {
          background: #ffffff; border: 1px solid #e8eaed; border-radius: 14px;
          padding: 1.2rem 1.4rem; box-shadow: 0 1px 2px rgba(15,23,42,0.03);
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .gratitude-card:hover { border-color: #d1d5db; box-shadow: 0 4px 14px rgba(15,23,42,0.05); }

        .gratitude-card-date {
          font-size: 0.74rem; color: #94a3b8; font-weight: 500;
          text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.9rem;
        }
        .gratitude-card-items { display: flex; flex-direction: column; gap: 0.55rem; }
        .gratitude-card-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.88rem; color: #334155; }
        .gratitude-heart { color: #f43f5e; flex-shrink: 0; display: flex; align-items: center; }

        .gratitude-card-footer {
          display: flex; align-items: center; justify-content: flex-end;
          gap: 0.5rem; margin-top: 0.9rem;
        }
        .gratitude-action-btn {
          display: flex; align-items: center; gap: 0.3rem;
          font-size: 0.76rem; font-weight: 500; padding: 0.35rem 0.7rem;
          border-radius: 7px; border: 1px solid #e8eaed; background: transparent;
          cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif; color: #64748b;
        }
        .gratitude-action-btn:hover { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }
        .gratitude-action-btn.delete:hover { border-color: #f43f5e; color: #f43f5e; background: #fff1f2; }
        .gratitude-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Inline edit */
        .gratitude-edit-form { margin-top: 0.8rem; display: flex; flex-direction: column; gap: 0.6rem; }
        .gratitude-edit-input {
          width: 100%; background: #f7f8fa; border: 1px solid #e8eaed;
          border-radius: 8px; padding: 0.6rem 0.8rem;
          font-size: 0.875rem; color: #334155; font-family: 'Inter', sans-serif;
          outline: none; transition: border-color 0.2s;
        }
        .gratitude-edit-input:focus { border-color: #16a34a; }
        .gratitude-edit-actions { display: flex; gap: 0.6rem; justify-content: flex-end; }
        .gratitude-edit-save {
          background: #16a34a; color: #fff; border: none;
          padding: 0.5rem 1.2rem; border-radius: 7px;
          font-size: 0.82rem; font-weight: 600; cursor: pointer;
          font-family: 'Inter', sans-serif; transition: background 0.2s;
        }
        .gratitude-edit-save:hover { background: #15803d; }
        .gratitude-edit-save:disabled { background: #e8eaed; color: #94a3b8; cursor: not-allowed; }
        .gratitude-edit-cancel {
          background: transparent; border: 1px solid #e8eaed; color: #64748b;
          padding: 0.5rem 1.1rem; border-radius: 7px;
          font-size: 0.82rem; cursor: pointer; font-family: 'Inter', sans-serif;
        }
        .gratitude-card-error { font-size: 0.78rem; color: #f87171; margin-top: 0.5rem; }
      `}</style>

      <div className="gratitude-card">
        <div className="gratitude-card-date">{formattedDate}</div>

        {editing ? (
          <div className="gratitude-edit-form">
            {items.map((val, i) => (
              <input
                key={i}
                className="gratitude-edit-input"
                value={val}
                onChange={(e) => updateItem(i, e.target.value)}
                placeholder={`Item ${i + 1}`}
              />
            ))}
            {error && <div className="gratitude-card-error">{error}</div>}
            <div className="gratitude-edit-actions">
              <button
                className="gratitude-edit-cancel"
                onClick={() => { setEditing(false); setItems(entry.items); }}
              >
                Cancel
              </button>
              <button
                className="gratitude-edit-save"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="gratitude-card-items">
              {entry.items.map((item, i) => (
                <div className="gratitude-card-item" key={i}>
                  <span className="gratitude-heart"><HeartIcon /></span>
                  {item}
                </div>
              ))}
            </div>
            {error && <div className="gratitude-card-error">{error}</div>}
            <div className="gratitude-card-footer">
              <button className="gratitude-action-btn" onClick={() => setEditing(true)}>
                <EditIcon /> Edit
              </button>
              <button
                className="gratitude-action-btn delete"
                onClick={handleDelete}
                disabled={deleting}
              >
                <TrashIcon /> {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}