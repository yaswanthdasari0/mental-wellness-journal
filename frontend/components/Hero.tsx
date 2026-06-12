"use client";

export default function Hero() {
  return (
    <>
      <style>{`
        .hero {
          min-height: 100vh;
          display: flex; align-items: center;
          position: relative; overflow: hidden;
          padding: 9rem 2rem 5rem;
        }

        /* Green orb top-right — organic, not techy */
        .orb {
          position: absolute;
          width: 580px; height: 580px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #16a34a 0%, #052e16 50%, transparent 75%);
          filter: blur(90px);
          opacity: 0.35;
          top: -100px; right: -140px;
          animation: drift 10s ease-in-out infinite;
          z-index: 0;
          pointer-events: none;
        }
        /* Amber hint bottom-left — warm, grounding */
        .orb-2 {
          position: absolute;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: radial-gradient(circle, #fbbf24 0%, transparent 70%);
          filter: blur(80px);
          opacity: 0.08;
          bottom: 60px; left: -60px;
          z-index: 0;
          pointer-events: none;
        }
        @keyframes drift {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(28px) scale(1.05); }
        }

        .hero-inner {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto; width: 100%;
        }

        .hero-tag {
          font-size: 0.72rem; color: #374151;
          letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 2.2rem;
          display: flex; align-items: center; gap: 0.7rem;
        }
        .hero-tag::before {
          content: '';
          display: inline-block; width: 28px; height: 1px;
          background: #374151;
        }

        .hero-title {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(3rem, 7.5vw, 5.8rem);
          line-height: 1.04; letter-spacing: -0.03em;
          color: #f1f5f9;
          max-width: 700px;
          margin-bottom: 2rem;
        }
        .hero-title .indent {
          display: block;
          padding-left: clamp(1.5rem, 4vw, 3.5rem);
          /* Green for the italic accent line */
          color: #4ade80;
          font-style: italic;
        }

        .hero-sub {
          font-size: 1rem; color: #4b5563; line-height: 1.75;
          max-width: 420px;
          margin-bottom: 3rem; font-weight: 400;
          /* Green tint on the left border */
          border-left: 1px solid rgba(74, 222, 128, 0.2);
          padding-left: 1.2rem;
        }

        .hero-actions { display: flex; gap: 0.8rem; flex-wrap: wrap; }

        .btn-primary {
          background: #4ade80;
          color: #0d1117; padding: 0.8rem 1.8rem;
          border-radius: 6px; font-size: 0.9rem; font-weight: 600;
          text-decoration: none; border: none; cursor: pointer;
          transition: background 0.2s;
          letter-spacing: 0.01em;
        }
        .btn-primary:hover { background: #86efac; }

        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: #6b7280; padding: 0.8rem 1.8rem;
          border-radius: 6px; font-size: 0.9rem; font-weight: 400;
          text-decoration: none; cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.25); color: #d1d5db; }

        .mood-strip {
          display: flex; gap: 0.5rem;
          margin-top: 5rem; flex-wrap: wrap;
        }
        .mood-pill {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.06);
          padding: 0.35rem 0.85rem; border-radius: 4px;
          font-size: 0.78rem; color: #374151;
          display: flex; align-items: center; gap: 0.35rem;
          transition: border-color 0.2s, color 0.2s;
        }
        .mood-pill:hover { color: #6b7280; border-color: rgba(255,255,255,0.14); }

        @media(max-width: 600px) {
          .orb { width: 320px; height: 320px; right: -80px; }
        }
      `}</style>

      <section className="hero">
        <div className="orb" />
        <div className="orb-2" />
        <div className="hero-inner">
          <div className="hero-tag">Mental wellness journal</div>

          <h1 className="hero-title">
            A place to think<br />
            <span className="indent">without being watched.</span>
          </h1>

          <p className="hero-sub">
            Write what's on your mind. Track how you're feeling.
            See patterns you didn't notice. No feed, no likes, no audience.
          </p>

          <div className="hero-actions">
            <a href="#start" className="btn-primary">Start for free</a>
            <a href="#features" className="btn-ghost">See what's inside</a>
          </div>

          <div className="mood-strip">
            {[["😁","Great"],["😊","Happy"],["😐","Neutral"],["😔","Sad"],["😣","Stressed"],["😴","Tired"]].map(([emoji, label]) => (
              <div className="mood-pill" key={label}>{emoji} {label}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}