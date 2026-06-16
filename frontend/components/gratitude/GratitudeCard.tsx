function HeartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 20.5 4.6 13a4.6 4.6 0 0 1 6.5-6.5l.9.9.9-.9a4.6 4.6 0 0 1 6.5 6.5z" />
    </svg>
  );
}

export interface GratitudeCardProps {
  items: string[];
  date: string;
}

export default function GratitudeCard({ items, date }: GratitudeCardProps) {
  return (
    <>
      <style>{`
        .gratitude-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 14px;
          padding: 1.2rem 1.4rem;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .gratitude-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
        }

        .gratitude-card-date {
          font-size: 0.74rem;
          color: #94a3b8;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.9rem;
        }

        .gratitude-card-items {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .gratitude-card-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.88rem;
          color: #334155;
        }

        .gratitude-heart {
          color: #f43f5e;
          flex-shrink: 0;
          display: flex;
          align-items: center;
        }
      `}</style>

      <div className="gratitude-card">
        <div className="gratitude-card-date">{date}</div>
        <div className="gratitude-card-items">
          {items.map((item, i) => (
            <div className="gratitude-card-item" key={i}>
              <span className="gratitude-heart"><HeartIcon /></span>
              {item}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}