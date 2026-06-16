import JournalCard from "./JournalCard";

// TODO: replace with GET /api/journal once backend is ready
const DUMMY_JOURNALS = [
  {
    title: "Productive Day",
    preview: "Completed the dashboard layout and mood tracker UI. Both came together better than expected — the line chart in particular looks solid.",
    date: "June 16, 2026",
    wordCount: 142,
  },
  {
    title: "Feeling Better",
    preview: "Went to the gym in the morning and studied for two hours in the evening. Not a perfect day but a good one.",
    date: "June 15, 2026",
    wordCount: 98,
  },
  {
    title: "Starting the Project",
    preview: "Finally started building MindSpace. Set up the Next.js frontend, configured Tailwind, and got the folder structure in place.",
    date: "June 14, 2026",
    wordCount: 210,
  },
  {
    title: "A Quiet Saturday",
    preview: "Spent most of the day reading. Didn't write any code. Didn't feel guilty about it. That's progress.",
    date: "June 13, 2026",
    wordCount: 67,
  },
  {
    title: "Rough Morning",
    preview: "Woke up late and felt behind all day. Tried to catch up but couldn't shake the feeling. Tomorrow is a fresh start.",
    date: "June 12, 2026",
    wordCount: 88,
  },
];

export default function RecentJournals() {
  return (
    <>
      <style>{`
        .recent-journals-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
      `}</style>

      <div className="recent-journals-list">
        {DUMMY_JOURNALS.map((entry) => (
          <JournalCard
            key={entry.title}
            title={entry.title}
            preview={entry.preview}
            date={entry.date}
            wordCount={entry.wordCount}
          />
        ))}
      </div>
    </>
  );
}