"use client";

import { useState } from "react";
import { toggleHabit, updateHabit, deleteHabit, Habit } from "@/services/habit";

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7" />
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

interface HabitCardProps {
  habit: Habit;
  onUpdate: (updated: Habit) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, completedToday: boolean) => void;
}

export default function HabitCard({ habit, onUpdate, onDelete, onToggle }: HabitCardProps) {
  const [editing, setEditing]   = useState(false);
  const [name, setName]         = useState(habit.name);
  const [toggling, setToggling] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState("");

  const handleToggle = async () => {
    setToggling(true);
    try {
      const result = await toggleHabit(habit.id);
      onToggle(habit.id, result.completedToday);
    } catch (err: any) {
      setError(err.message || "Failed to toggle habit.");
    } finally {
      setToggling(false);
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateHabit(habit.id, { name: name.trim() });
      onUpdate(updated);
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update habit.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${habit.name}"? This can't be undone.`)) return;
    setDeleting(true);
    try {
      await deleteHabit(habit.id);
      onDelete(habit.id);
    } catch (err: any) {
      setError(err.message || "Failed to delete habit.");
      setDeleting(false);
    }
  };

  return (
    <>
      <style>{`
        .habit-card {
          background: #ffffff; border: 1px solid #e8eaed; border-radius: 13px;
          padding: 1rem 1.3rem; transition: box-shadow 0.18s, border-color 0.18s;
        }
        .habit-card:hover { border-color: #d1d5db; box-shadow: 0 3px 10px rgba(15,23,42,0.05); }
        .habit-card.done { background: #f0fdf4; border-color: #bbf7d0; }

        .habit-card-main { display: flex; align-items: center; gap: 1rem; }

        .habit-checkbox {
          width: 22px; height: 22px; border-radius: 7px; border: 1.8px solid #d1d5db;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          cursor: pointer; transition: background 0.18s, border-color 0.18s; background: #ffffff;
        }
        .habit-card.done .habit-checkbox { background: #16a34a; border-color: #16a34a; color: #ffffff; }
        .habit-checkbox:hover { border-color: #16a34a; }

        .habit-name { flex: 1; font-size: 0.9rem; font-weight: 500; color: #1e293b; }
        .habit-card.done .habit-name { color: #16a34a; }

        .habit-streak {
          display: flex; align-items: center; gap: 0.3rem;
          font-size: 0.76rem; color: #94a3b8; font-weight: 500; flex-shrink: 0;
        }
        .habit-streak-dot { width: 6px; height: 6px; border-radius: 50%; background: #f59e0b; }

        .habit-actions { display: flex; gap: 0.4rem; }
        .habit-action-btn {
          display: flex; align-items: center; gap: 0.3rem;
          font-size: 0.74rem; font-weight: 500; padding: 0.3rem 0.6rem;
          border-radius: 6px; border: 1px solid #e8eaed; background: transparent;
          cursor: pointer; transition: all 0.15s; font-family: 'Inter', sans-serif; color: #64748b;
        }
        .habit-action-btn:hover { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }
        .habit-action-btn.delete:hover { border-color: #f43f5e; color: #f43f5e; background: #fff1f2; }
        .habit-action-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* Edit form */
        .habit-edit-form { margin-top: 0.8rem; display: flex; gap: 0.6rem; }
        .habit-edit-input {
          flex: 1; background: #f7f8fa; border: 1px solid #e8eaed; border-radius: 8px;
          padding: 0.55rem 0.8rem; font-size: 0.875rem; color: #334155;
          font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s;
        }
        .habit-edit-input:focus { border-color: #16a34a; }
        .habit-edit-save {
          background: #16a34a; color: #fff; border: none;
          padding: 0.55rem 1rem; border-radius: 7px;
          font-size: 0.82rem; font-weight: 600; cursor: pointer;
          font-family: 'Inter', sans-serif; transition: background 0.2s;
        }
        .habit-edit-save:hover { background: #15803d; }
        .habit-edit-save:disabled { background: #e8eaed; color: #94a3b8; cursor: not-allowed; }
        .habit-edit-cancel {
          background: transparent; border: 1px solid #e8eaed; color: #64748b;
          padding: 0.55rem 0.9rem; border-radius: 7px;
          font-size: 0.82rem; cursor: pointer; font-family: 'Inter', sans-serif;
        }
        .habit-card-error { font-size: 0.76rem; color: #f87171; margin-top: 0.5rem; }
      `}</style>

      <div className={`habit-card${habit.completedToday ? " done" : ""}`}>
        <div className="habit-card-main">
          {/* Checkbox toggle */}
          <div
            className="habit-checkbox"
            onClick={!toggling ? handleToggle : undefined}
            style={{ cursor: toggling ? "wait" : "pointer" }}
          >
            {habit.completedToday && <CheckIcon />}
          </div>

          <div className="habit-name">{habit.name}</div>

          <div className="habit-streak">
            <span className="habit-streak-dot" />
            {habit.streak} day{habit.streak !== 1 ? "s" : ""}
          </div>

          <div className="habit-actions">
            <button className="habit-action-btn" onClick={() => setEditing((v) => !v)}>
              <EditIcon /> Edit
            </button>
            <button
              className="habit-action-btn delete"
              onClick={handleDelete}
              disabled={deleting}
            >
              <TrashIcon /> {deleting ? "..." : "Delete"}
            </button>
          </div>
        </div>

        {editing && (
          <div className="habit-edit-form">
            <input
              className="habit-edit-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Habit name"
            />
            <button
              className="habit-edit-cancel"
              onClick={() => { setEditing(false); setName(habit.name); }}
            >
              Cancel
            </button>
            <button
              className="habit-edit-save"
              onClick={handleUpdate}
              disabled={saving || !name.trim()}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}

        {error && <div className="habit-card-error">{error}</div>}
      </div>
    </>
  );
}