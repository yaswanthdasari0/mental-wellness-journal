"use client";

export interface JournalCardProps {
  title: string;
  preview: string;
  date: string;
  wordCount?: number;
}

function BookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H12v18H5.5A1.5 1.5 0 0 1 4 19.5z" />
      <path d="M12 3h6.5A1.5 1.5 0 0 1 20 4.5v15a1.5 1.5 0 0 1-1.5 1.5H12" />
    </svg>
  );
}

export default function JournalCard({ title, preview, date, wordCount }: JournalCardProps) {
  return (
    <>
      <style>{`
        .journal-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 14px;
          padding: 1.2rem 1.4rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          cursor: pointer;
          transition: box-shadow 0.2s, border-color 0.2s, transform 0.18s;
          text-decoration: none;
        }
        .journal-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
          transform: translateY(-1px);
        }

        .journal-card-icon {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: #f0fdf4;
          color: #16a34a;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .journal-card-body { min-width: 0; flex: 1; }

        .journal-card-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.3rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .journal-card-preview {
          font-size: 0.84rem;
          color: #64748b;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .journal-card-meta {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-top: 0.7rem;
        }
        .journal-card-date {
          font-size: 0.74rem;
          color: #94a3b8;
          font-weight: 500;
        }
        .journal-card-words {
          font-size: 0.74rem;
          color: #cbd5e1;
        }
      `}</style>

      <div className="journal-card">
        <div className="journal-card-icon">
          <BookIcon />
        </div>
        <div className="journal-card-body">
          <div className="journal-card-title">{title}</div>
          <div className="journal-card-preview">{preview}</div>
          <div className="journal-card-meta">
            <span className="journal-card-date">{date}</span>
            {wordCount !== undefined && (
              <span className="journal-card-words">{wordCount} words</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}