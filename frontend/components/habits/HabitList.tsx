import HabitCard from "./HabitCard";

// TODO: replace with GET /api/habits once backend is ready
const DUMMY_HABITS = [
  { name: "Drink 3L of water",  streak: 7,  defaultDone: true  },
  { name: "Exercise 30 mins",   streak: 5,  defaultDone: true  },
  { name: "Read 20 pages",      streak: 3,  defaultDone: false },
  { name: "Meditate 10 mins",   streak: 7,  defaultDone: true  },
  { name: "Sleep before 11 PM", streak: 2,  defaultDone: false },
];

export default function HabitList() {
  return (
    <>
      <style>{`
        .habit-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }
      `}</style>

      <div className="habit-list">
        {DUMMY_HABITS.map((h) => (
          <HabitCard
            key={h.name}
            name={h.name}
            streak={h.streak}
            defaultDone={h.defaultDone}
          />
        ))}
      </div>
    </>
  );
}