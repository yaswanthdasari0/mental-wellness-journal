"use client";

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const ACTIONS = [
  { label: "New Journal Entry" },
  { label: "Log Mood" },
  { label: "Add Gratitude" },
];

export default function QuickActions() {
  return (
    <>
      <style>{`
        .quick-actions-section {
          margin-top: 2rem;
        }
        .section-heading {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.9rem;
        }
        .quick-actions-row {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }
        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 10px;
          padding: 0.7rem 1.2rem;
          font-size: 0.85rem;
          font-weight: 500;
          color: #334155;
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s, color 0.15s;
        }
        .quick-action-btn:hover {
          border-color: #16a34a;
          background: rgba(22, 163, 74, 0.05);
          color: #16a34a;
        }
        .quick-action-btn svg { transition: color 0.15s; }
      `}</style>

      <div className="quick-actions-section">
        <div className="section-heading">Quick Actions</div>
        <div className="quick-actions-row">
          {ACTIONS.map((a) => (
            <button key={a.label} className="quick-action-btn" type="button">
              <PlusIcon />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}