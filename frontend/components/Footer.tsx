export default function Footer() {
  return (
    <>
      <style>{`
        .footer {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding: 1.8rem 2.5rem;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 1rem;
        }
        .footer-brand {
          font-family: 'DM Serif Display', serif;
          font-size: 1rem; color: #e2e8f0;
          text-decoration: none;
        }
        /* Green on logo accent */
        .footer-brand span { color: #4ade80; }

        .footer-links {
          display: flex; gap: 1.8rem;
        }
        .footer-links a {
          font-size: 0.78rem; color: #1f2937;
          text-decoration: none; transition: color 0.2s;
        }
        .footer-links a:hover { color: #374151; }

        .footer-note { font-size: 0.72rem; color: #111827; }
      `}</style>

      <footer className="footer">
        <a href="/" className="footer-brand">Mind<span>Space</span></a>
        <div className="footer-links">
          <a href="#features">Features</a>
          <a href="#ai">AI</a>
          <a href="/signup">Sign up</a>
        </div>
        <div className="footer-note">Not therapy. Not a social network. Just yours.</div>
      </footer>
    </>
  );
}