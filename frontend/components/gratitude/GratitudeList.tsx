import GratitudeCard from "./GratitudeCard";

// TODO: replace with GET /api/gratitude once backend is ready
const DUMMY_ENTRIES = [
  {
    date: "June 16, 2026",
    items: ["Family", "Good health", "Learning something new today"],
  },
  {
    date: "June 15, 2026",
    items: ["Friends who check in", "Coffee", "A solid gym session"],
  },
  {
    date: "June 14, 2026",
    items: ["Quiet mornings", "Getting the dashboard done", "A good night's sleep"],
  },
  {
    date: "June 13, 2026",
    items: ["Books", "Sunshine", "Having goals to work toward"],
  },
  {
    date: "June 12, 2026",
    items: ["Hot food", "Music that matches the mood", "People who are patient with me"],
  },
];

export default function GratitudeList() {
  return (
    <>
      <style>{`
        .gratitude-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
      `}</style>

      <div className="gratitude-list">
        {DUMMY_ENTRIES.map((entry) => (
          <GratitudeCard key={entry.date} date={entry.date} items={entry.items} />
        ))}
      </div>
    </>
  );
}