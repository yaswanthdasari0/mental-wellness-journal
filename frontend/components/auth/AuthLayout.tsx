import { ReactNode } from "react";

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <>
      <style>{`
        .auth-page {
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          padding: 2rem;
          background: #0d1117;
          font-family: 'Inter', sans-serif;
        }

        .auth-orb {
          position: absolute;
          width: 480px; height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #16a34a 0%, #052e16 50%, transparent 75%);
          filter: blur(90px);
          opacity: 0.3;
          top: -120px; right: -140px;
          z-index: 0;
          pointer-events: none;
        }

        .auth-panel {
          position: relative; z-index: 1;
          width: 100%; max-width: 420px;
          background: rgba(255,255,255,0.015);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 2.5rem;
        }

        .auth-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem; color: #e2e8f0;
          letter-spacing: -0.02em;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 2.5rem;
        }
        .auth-logo span { color: #4ade80; }

        .auth-title {
          font-family: 'DM Serif Display', serif;
          font-size: 1.9rem; color: #f1f5f9;
          letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }
        .auth-subtitle {
          font-size: 0.88rem; color: #4b5563;
          margin-bottom: 2.2rem;
          line-height: 1.6;
        }
      `}</style>

      <div className="auth-page">
        <div className="auth-orb" />
        <div className="auth-panel">
          <a href="/" className="auth-logo">Mind<span>Space</span></a>
          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
        </div>
      </div>
    </>
  );
}