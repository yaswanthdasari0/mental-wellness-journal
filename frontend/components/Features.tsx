"use client";

const FEATURES = [
  { num: "01", name: "Mood Tracker",      desc: "One check-in a day. Pick how you feel, add a line if you want. That's it." },
  { num: "02", name: "Journal",           desc: "A private editor. Write as little or as much as you need. Searchable, editable, deletable." },
  { num: "03", name: "Gratitude Log",     desc: "Three things, every day. Not because it's trendy — because it quietly works." },
  { num: "04", name: "Habit Tracker",     desc: "Create the habits you keep meaning to start. See your streaks, catch the gaps." },
  { num: "05", name: "Meditation Timer",  desc: "Pick your duration. Sit. Done. No subscriptions, no guided voice if you don't want one." },
  { num: "06", name: "Weekly Insights",   desc: "Your AI reads across your entries and tells you what it noticed. No diagnoses. Just patterns." },
];

export default function Features() {
  return (
    <>
      <style>{`
        .section {
          padding: 5rem 2rem;
          max-width: 1100px; margin: 0 auto;
        }
        .section-eyebrow {
          font-size: 0.72rem; color: #374151;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 2rem;
          display: flex; align-items: center; gap: 0.7rem;
        }
        .section-eyebrow::before {
          content: '';
          display: inline-block; width: 28px; height: 1px;
          background: #374151;
        }
        .section-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          line-height: 1.18; letter-spacing: -0.025em;
          color: #f1f5f9; max-width: 480px;
          margin-bottom: 3.5rem;
        }
        /* Green on the italic accent */
        .section-title em { font-style: italic; color: #4ade80; }

        /* ── Feature list ── */
        .features-list { display: flex; flex-direction: column; }

        .feature-row {
          display: grid;
          grid-template-columns: 3rem 1fr 2fr;
          gap: 1.5rem 2.5rem;
          align-items: baseline;
          padding: 1.6rem 0;
          border-top: 1px solid rgba(255,255,255,0.05);
          transition: background 0.2s;
        }
        .feature-row:last-child { border-bottom: 1px solid rgba(255,255,255,0.05); }
        /* Green highlight on name hover */
        .feature-row:hover .feature-row-name { color: #4ade80; }

        .feature-num {
          font-size: 0.72rem; color: #1f2937;
          font-weight: 500; letter-spacing: 0.05em;
          padding-top: 0.15rem;
        }
        .feature-row-name {
          font-size: 0.95rem; font-weight: 600;
          color: #9ca3af; transition: color 0.2s;
          white-space: nowrap;
        }
        .feature-row-desc {
          font-size: 0.875rem; color: #374151;
          line-height: 1.65;
        }

        @media(max-width: 620px) {
          .feature-row { grid-template-columns: 2rem 1fr; }
          .feature-row-desc { grid-column: 2; }
        }

        /* ── AI section ── */
        .ai-section {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 5rem 2rem;
        }
        .ai-inner {
          max-width: 1100px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 5rem; align-items: start;
        }
        @media(max-width: 700px) { .ai-inner { grid-template-columns: 1fr; gap: 3rem; } }

        /* App window mock */
        .journal-card {
          background: #0d1117;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px; overflow: hidden;
        }
        .journal-card-toolbar {
          background: #161b22;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding: 0.7rem 1rem;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .toolbar-dot { width: 9px; height: 9px; border-radius: 50%; }
        .toolbar-dot.red   { background: #ef4444; opacity: 0.5; }
        .toolbar-dot.amber { background: #f59e0b; opacity: 0.5; }
        .toolbar-dot.green { background: #22c55e; opacity: 0.5; }
        .toolbar-label {
          margin-left: auto;
          font-size: 0.7rem; color: #1f2937; letter-spacing: 0.05em;
        }
        .journal-card-body { padding: 1.4rem 1.4rem 0; }
        .journal-date { font-size: 0.72rem; color: #1f2937; margin-bottom: 0.8rem; }
        .journal-text {
          font-size: 0.88rem; color: #4b5563; line-height: 1.8;
          margin-bottom: 1.4rem;
        }
        .journal-divider {
          height: 1px; background: rgba(255,255,255,0.04);
          margin: 0 -1.4rem; margin-bottom: 1.2rem;
        }
        /* Green dot on the AI badge */
        .ai-badge {
          display: inline-flex; align-items: center; gap: 0.4rem;
          font-size: 0.68rem; color: #16a34a; letter-spacing: 0.08em;
          text-transform: uppercase; font-weight: 600;
          margin-bottom: 0.6rem;
        }
        .ai-badge::before {
          content: ''; display: block;
          width: 6px; height: 6px; border-radius: 50%;
          background: #4ade80;
        }
        .ai-reflection-text {
          font-size: 0.875rem; color: #4b5563; line-height: 1.75;
          padding-bottom: 1.4rem;
        }

        /* Plain text stats — no big coloured numbers */
        .ai-stats {
          display: flex; flex-direction: column; gap: 1rem;
          margin-top: 2.5rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 2rem;
        }
        .ai-stat-row {
          display: flex; justify-content: space-between;
          font-size: 0.82rem;
        }
        .ai-stat-label { color: #374151; }
        .ai-stat-val { color: #6b7280; font-weight: 500; }

        /* ── CTA ── */
        .cta-section {
          padding: 6rem 2rem;
          border-top: 1px solid rgba(255,255,255,0.05);
          max-width: 1100px; margin: 0 auto;
        }
        .cta-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 5vw, 3.2rem);
          line-height: 1.12; color: #f1f5f9;
          max-width: 520px; margin-bottom: 1rem;
          letter-spacing: -0.025em;
        }
        /* Amber on the CTA italic — used only here, one warm moment */
        .cta-title em { font-style: italic; color: #fbbf24; }
        .cta-sub {
          color: #374151; font-size: 0.9rem; margin-bottom: 2.2rem;
          max-width: 380px; line-height: 1.65;
        }
        .cta-actions { display: flex; gap: 0.8rem; flex-wrap: wrap; }

        .btn-primary {
          background: #4ade80; color: #0d1117;
          padding: 0.8rem 1.8rem; border-radius: 6px;
          font-size: 0.9rem; font-weight: 600;
          text-decoration: none; transition: background 0.2s;
        }
        .btn-primary:hover { background: #86efac; }

        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: #6b7280; padding: 0.8rem 1.8rem;
          border-radius: 6px; font-size: 0.9rem;
          text-decoration: none; transition: border-color 0.2s, color 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: #d1d5db; }
      `}</style>

      {/* ── Feature list ── */}
      <section className="section" id="features">
        <div className="section-eyebrow">What's inside</div>
        <h2 className="section-title">
          Six tools. One habit.<br /><em>Knowing yourself better.</em>
        </h2>
        <div className="features-list">
          {FEATURES.map((f) => (
            <div className="feature-row" key={f.num}>
              <div className="feature-num">{f.num}</div>
              <div className="feature-row-name">{f.name}</div>
              <div className="feature-row-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI section ── */}
      <div className="ai-section" id="ai">
        <div className="ai-inner">
          <div>
            <div className="section-eyebrow">AI insights</div>
            <h2 className="section-title">
              It reads what<br />you write.<br />
              <em>Then tells you what it sees.</em>
            </h2>
            <p style={{ color: "#374151", fontSize: "0.9rem", lineHeight: "1.75", maxWidth: "360px" }}>
              After each journal entry, MindSpace generates a short reflection.
              At the end of the week, it looks across everything — mood, habits,
              entries — and surfaces what you might have missed.
            </p>
            <div className="ai-stats">
              <div className="ai-stat-row">
                <span className="ai-stat-label">Insight types</span>
                <span className="ai-stat-val">Entry summary · Reflection · Weekly report</span>
              </div>
              <div className="ai-stat-row">
                <span className="ai-stat-label">Medical claims</span>
                <span className="ai-stat-val">None. Ever.</span>
              </div>
              <div className="ai-stat-row">
                <span className="ai-stat-label">Your data</span>
                <span className="ai-stat-val">Private, isolated per user</span>
              </div>
            </div>
          </div>

          <div className="journal-card">
            <div className="journal-card-toolbar">
              <div className="toolbar-dot red" />
              <div className="toolbar-dot amber" />
              <div className="toolbar-dot green" />
              <span className="toolbar-label">June 11 · Journal</span>
            </div>
            <div className="journal-card-body">
              <div className="journal-date">Wednesday, 11:42 pm</div>
              <div className="journal-text">
                I was stressed because of deadlines all morning. But I went for a walk
                after lunch and somehow everything felt lighter. Finished the day feeling okay.
              </div>
              <div className="journal-divider" />
              <div className="ai-badge">MindSpace reflection</div>
              <div className="ai-reflection-text">
                You moved through a stressful morning and found relief in something simple.
                That shift is worth holding onto — you already know what helps.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <section className="cta-section" id="start">
        <h2 className="cta-title">
          Start where you are.<br /><em>That's enough.</em>
        </h2>
        <p className="cta-sub">
          No pressure. No streaks to break on day one.
          Just a space to be honest with yourself.
        </p>
        <div className="cta-actions">
          <a href="/signup" className="btn-primary">Create your space</a>
          <a href="/login" className="btn-ghost">I already have an account</a>
        </div>
      </section>
    </>
  );
}