"use client";

import MoodCard from "./MoodCard";
import { MoodId } from "./moodData";

const DUMMY_HISTORY: { date: string; mood: MoodId; note: string }[] = [
  { date: "June 15", mood: "happy", note: "Finished project work and felt productive." },
  { date: "June 14", mood: "stressed", note: "Lots of assignments piling up." },
  { date: "June 13", mood: "great", note: "Started a new project — excited about it." },
  { date: "June 12", mood: "neutral", note: "Pretty average day, nothing notable." },
  { date: "June 11", mood: "happy", note: "Went for a walk after a stressful morning." },
  { date: "June 10", mood: "sad", note: "Felt a bit low, didn't get much done." },
  { date: "June 9", mood: "great", note: "Caught up with old friends." },
];

export default function MoodHistory() {
  return (
    <>
      <style>{`
        .mood-history-list {
          display: flex;
          flex-direction: column;
          gap: 0.9rem;
        }
      `}</style>

      <div className="mood-history-list">
        {DUMMY_HISTORY.map((entry) => (
          <MoodCard
            key={entry.date}
            date={entry.date}
            mood={entry.mood}
            note={entry.note}
          />
        ))}
      </div>
    </>
  );
}