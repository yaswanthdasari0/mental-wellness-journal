function CircleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

// TODO: replace with GET /api/meditation/sessions once backend is ready
const DUMMY_SESSIONS = [
  { duration: "10 min", when: "Today",     totalMins: 10 },
  { duration: "5 min",  when: "Yesterday", totalMins: 5  },
  { duration: "15 min", when: "Monday",    totalMins: 15 },
  { duration: "10 min", when: "Sunday",    totalMins: 10 },
  { duration: "20 min", when: "Saturday",  totalMins: 20 },
];

export default function SessionHistory() {
  const totalMins = DUMMY_SESSIONS.reduce((sum, s) => sum + s.totalMins, 0);

  return (
    <>
      <style>{`
        .session-history-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(15,23,42,0.03);
        }

        .session-history-top {
          padding: 1.1rem 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
        .session-history-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
        }
        .session-history-total {
          font-size: 0.78rem;
          color: #94a3b8;
        }
        .session-history-total span {
          color: #16a34a;
          font-weight: 600;
        }

        .session-history-list { padding: 0.4rem 0; }

        .session-row {
          display: flex;
          align-items: center;
          gap: 0.9rem;
          padding: 0.8rem 1.5rem;
          transition: background 0.15s;
        }
        .session-row:hover { background: #f7f8fa; }

        .session-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: rgba(22,163,74,0.08);
          color: #16a34a;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .session-body { flex: 1; }
        .session-duration {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }
        .session-when {
          font-size: 0.76rem;
          color: #94a3b8;
          margin-top: 0.1rem;
        }

        .session-divider {
          height: 1px;
          background: #f8fafc;
          margin: 0 1.5rem;
        }
      `}</style>

      <div className="session-history-card">
        <div className="session-history-top">
          <div className="session-history-title">Recent Sessions</div>
          <div className="session-history-total">
            <span>{totalMins} min</span> this week
          </div>
        </div>

        <div className="session-history-list">
          {DUMMY_SESSIONS.map((s, i) => (
            <div key={i}>
              <div className="session-row">
                <div className="session-icon"><CircleIcon /></div>
                <div className="session-body">
                  <div className="session-duration">{s.duration} session</div>
                  <div className="session-when">{s.when}</div>
                </div>
              </div>
              {i < DUMMY_SESSIONS.length - 1 && <div className="session-divider" />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}