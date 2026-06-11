"use client";

import { useState, useEffect } from "react";

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main style={{ fontFamily: "'Inter', sans-serif", background: "#0f0e17", color: "#f0eeff", overflowX: "hidden" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; justify-content: space-between; align-items: center;
          padding: 1.2rem 2.5rem;
          transition: background 0.4s ease, backdrop-filter 0.4s ease;
        }
        .nav.scrolled {
          background: rgba(15, 14, 23, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(167, 139, 250, 0.1);
        }
        .nav-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.4rem;
          color: #f0eeff;
          letter-spacing: -0.02em;
        }
        .nav-logo span { color: #a78bfa; }
        .nav-links { display: flex; gap: 2rem; align-items: center; }
        .nav-links a {
          color: #94a3b8; font-size: 0.875rem; text-decoration: none;
          transition: color 0.2s;
        }
        .nav-links a:hover { color: #f0eeff; }
        .nav-cta {
          background: #a78bfa; color: #0f0e17;
          padding: 0.5rem 1.2rem; border-radius: 100px;
          font-size: 0.875rem; font-weight: 600;
          text-decoration: none; transition: opacity 0.2s;
        }
        .nav-cta:hover { opacity: 0.85; color: #0f0e17; }

        /* HERO */
        .hero {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          padding: 7rem 2rem 4rem;
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0;
          background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(167,139,250,0.12) 0%, transparent 70%),
                      radial-gradient(ellipse 50% 40% at 80% 60%, rgba(249,168,212,0.08) 0%, transparent 60%);
        }
        .orb {
          position: absolute;
          width: 420px; height: 420px;
          border-radius: 50%;
          background: radial-gradient(circle at 40% 40%, #a78bfa 0%, #7c3aed 40%, #1e1b4b 80%, transparent 100%);
          filter: blur(60px);
          opacity: 0.35;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: breathe 6s ease-in-out infinite;
          z-index: 0;
        }
        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.35; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.5; }
        }
        .hero-content {
          position: relative; z-index: 1;
          text-align: center; max-width: 760px;
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 0.5rem;
          background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.25);
          padding: 0.35rem 0.9rem; border-radius: 100px;
          font-size: 0.78rem; color: #a78bfa; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 1.8rem;
        }
        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2.8rem, 7vw, 5.2rem);
          line-height: 1.08; letter-spacing: -0.03em;
          color: #f0eeff;
          margin-bottom: 1.5rem;
        }
        .hero-title em { font-style: italic; color: #a78bfa; }
        .hero-sub {
          font-size: 1.05rem; color: #94a3b8; line-height: 1.7;
          max-width: 540px; margin: 0 auto 2.5rem;
          font-weight: 300;
        }
        .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .btn-primary {
          background: linear-gradient(135deg, #a78bfa, #7c3aed);
          color: #fff; padding: 0.85rem 2rem;
          border-radius: 100px; font-size: 0.95rem; font-weight: 600;
          text-decoration: none; border: none; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 0 30px rgba(167,139,250,0.3);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 40px rgba(167,139,250,0.45); }
        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(167,139,250,0.3);
          color: #a78bfa; padding: 0.85rem 2rem;
          border-radius: 100px; font-size: 0.95rem; font-weight: 500;
          text-decoration: none; cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .btn-ghost:hover { border-color: #a78bfa; background: rgba(167,139,250,0.06); }

        /* MOOD STRIP */
        .mood-strip {
          display: flex; justify-content: center; gap: 0.6rem;
          margin-top: 4rem; flex-wrap: wrap;
        }
        .mood-pill {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          padding: 0.45rem 1rem; border-radius: 100px;
          font-size: 0.85rem; color: #64748b;
          display: flex; align-items: center; gap: 0.4rem;
          transition: all 0.2s;
        }
        .mood-pill:hover { color: #f0eeff; border-color: rgba(167,139,250,0.35); background: rgba(167,139,250,0.07); }

        /* FEATURES */
        .section { padding: 5rem 2rem; max-width: 1100px; margin: 0 auto; }
        .section-label {
          font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em;
          color: #a78bfa; font-weight: 600; margin-bottom: 0.8rem;
        }
        .section-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 4vw, 3rem);
          line-height: 1.15; letter-spacing: -0.025em;
          color: #f0eeff; max-width: 520px;
        }
        .section-title em { font-style: italic; color: #f9a8d4; }
        .section-sub {
          color: #64748b; font-size: 0.95rem; line-height: 1.7;
          max-width: 440px; margin-top: 0.8rem; font-weight: 300;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.2rem; margin-top: 3rem;
        }
        .feature-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; padding: 1.6rem;
          transition: border-color 0.25s, background 0.25s;
        }
        .feature-card:hover {
          border-color: rgba(167,139,250,0.3);
          background: rgba(167,139,250,0.04);
        }
        .feature-icon {
          font-size: 1.7rem; margin-bottom: 0.9rem;
        }
        .feature-name {
          font-size: 1rem; font-weight: 600; color: #e2e8f0;
          margin-bottom: 0.4rem;
        }
        .feature-desc {
          font-size: 0.875rem; color: #64748b; line-height: 1.65;
        }

        /* AI SECTION */
        .ai-section {
          background: linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(249,168,212,0.04) 100%);
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 5rem 2rem;
        }
        .ai-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        @media(max-width: 700px) { .ai-inner { grid-template-columns: 1fr; gap: 2.5rem; } }

        .journal-card {
          background: rgba(15,14,23,0.7);
          border: 1px solid rgba(167,139,250,0.15);
          border-radius: 20px; padding: 1.8rem;
          backdrop-filter: blur(10px);
        }
        .journal-card-header {
          display: flex; align-items: center; gap: 0.7rem;
          margin-bottom: 1.2rem;
          font-size: 0.8rem; color: #64748b;
        }
        .journal-dot { width: 8px; height: 8px; border-radius: 50%; background: #a78bfa; }
        .journal-entry-text {
          font-size: 0.9rem; color: #94a3b8; line-height: 1.75;
          border-left: 2px solid rgba(167,139,250,0.3);
          padding-left: 1rem; margin-bottom: 1.5rem;
          font-style: italic;
        }
        .ai-response {
          background: rgba(167,139,250,0.08);
          border: 1px solid rgba(167,139,250,0.2);
          border-radius: 12px; padding: 1.1rem;
        }
        .ai-response-label {
          font-size: 0.7rem; color: #a78bfa; text-transform: uppercase;
          letter-spacing: 0.1em; font-weight: 600; margin-bottom: 0.5rem;
        }
        .ai-response-text {
          font-size: 0.88rem; color: #c4b5fd; line-height: 1.7;
        }

        /* STATS */
        .stats-row {
          display: flex; gap: 2.5rem; flex-wrap: wrap;
          margin-top: 3rem;
        }
        .stat { }
        .stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 2.2rem; color: #a78bfa;
        }
        .stat-label { font-size: 0.8rem; color: #64748b; margin-top: 0.2rem; }

        /* CTA */
        .cta-section {
          text-align: center; padding: 6rem 2rem;
          position: relative; overflow: hidden;
        }
        .cta-orb {
          position: absolute; width: 500px; height: 300px;
          background: radial-gradient(ellipse, rgba(167,139,250,0.15) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .cta-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          line-height: 1.1; color: #f0eeff; margin-bottom: 1.2rem;
        }
        .cta-title em { font-style: italic; color: #f9a8d4; }
        .cta-sub {
          color: #64748b; font-size: 0.95rem; margin-bottom: 2.5rem;
          font-weight: 300;
        }

        /* FOOTER */
        footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 2rem 2.5rem;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 1rem;
          max-width: 100%;
        }
        .footer-brand {
          font-family: 'DM Serif Display', serif;
          font-size: 1.1rem; color: #f0eeff;
        }
        .footer-brand span { color: #a78bfa; }
        .footer-note { font-size: 0.78rem; color: #334155; }

        @media(max-width: 600px) {
          .nav-links { display: none; }
          .stats-row { gap: 1.5rem; }
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-logo">Mind<span>Space</span></div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#ai">AI Insights</a>
          <a href="#start" className="nav-cta">Get Started</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="orb" />
        <div className="hero-content">
          <div className="hero-eyebrow">✦ AI-Powered Mental Wellness</div>
          <h1 className="hero-title">
            Your mind deserves<br />
            <em>a quiet place</em>
          </h1>
          <p className="hero-sub">
            Journal freely. Track your mood. Build habits that last.
            MindSpace turns daily reflection into meaningful insight—privately, and at your own pace.
          </p>
          <div className="hero-actions">
            <a href="#start" className="btn-primary">Start Journaling Free</a>
            <a href="#features" className="btn-ghost">See How It Works</a>
          </div>

          <div className="mood-strip">
            {[["😁","Great"],["😊","Happy"],["😐","Neutral"],["😔","Sad"],["😣","Stressed"],["😴","Tired"]].map(([e, l]) => (
              <div className="mood-pill" key={l}>{e} {l}</div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="section-label">What's inside</div>
        <h2 className="section-title">Everything you need to <em>check in</em> with yourself</h2>
        <p className="section-sub">Six tools that work together — because mental wellness isn't just one thing.</p>

        <div className="features-grid">
          {[
            { icon: "😊", name: "Daily Mood Tracker", desc: "Log how you feel each day with one tap. Add a short note to capture the why behind the mood." },
            { icon: "📝", name: "Private Journal", desc: "Write freely. Search your history. Revisit moments whenever you need to. Everything stays yours." },
            { icon: "❤️", name: "Gratitude Log", desc: "Three things a day. It sounds simple because it is — and it genuinely shifts how you see the world." },
            { icon: "🔥", name: "Habit Tracker", desc: "Build routines that stick. Track streaks, completion rates, and progress over time." },
            { icon: "🧘", name: "Meditation Timer", desc: "5, 10, 15, or 20 minutes of intentional stillness. No subscription. No noise. Just you." },
            { icon: "📊", name: "Analytics Dashboard", desc: "See your mood trends, habit streaks, and journal frequency — all in one calm, visual overview." },
          ].map(f => (
            <div className="feature-card" key={f.name}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-name">{f.name}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* AI SECTION */}
      <div className="ai-section" id="ai">
        <div className="ai-inner">
          <div>
            <div className="section-label">AI Insights</div>
            <h2 className="section-title">Your journal,<br /><em>understood</em></h2>
            <p className="section-sub">
              MindSpace reads between the lines. After you write, our AI surfaces patterns, reflects your feelings back, and offers a gentle weekly summary of your emotional landscape.
            </p>
            <div className="stats-row">
              <div className="stat">
                <div className="stat-num">3</div>
                <div className="stat-label">AI insight types</div>
              </div>
              <div className="stat">
                <div className="stat-num">0</div>
                <div className="stat-label">Medical claims. Ever.</div>
              </div>
              <div className="stat">
                <div className="stat-num">100%</div>
                <div className="stat-label">Private to you</div>
              </div>
            </div>
          </div>

          <div className="journal-card">
            <div className="journal-card-header">
              <div className="journal-dot" />
              Wednesday, June 11 · Journal Entry
            </div>
            <div className="journal-entry-text">
              "I was stressed because of deadlines all morning. But I went for a walk after lunch and somehow everything felt lighter. Finished the day feeling okay."
            </div>
            <div className="ai-response">
              <div className="ai-response-label">✦ MindSpace Reflection</div>
              <div className="ai-response-text">
                You moved through a stressful morning and found relief in something simple — a walk. That shift from tension to calm is worth noticing. Small resets matter more than you think.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="cta-section" id="start">
        <div className="cta-orb" />
        <h2 className="cta-title" style={{ position: "relative" }}>
          Start where you are.<br /><em>That's enough.</em>
        </h2>
        <p className="cta-sub" style={{ position: "relative" }}>No pressure. No streaks to break on day one. Just a space to be honest with yourself.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", position: "relative" }}>
          <a href="/signup" className="btn-primary">Create Your Space</a>
          <a href="/login" className="btn-ghost">I Already Have an Account</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-brand">Mind<span>Space</span></div>
        <div className="footer-note">Built for self-reflection. Not therapy. Not social media.</div>
      </footer>
    </main>
  );
}
