"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { getPublicProfile, PublicProfile } from "@/services/social";

function LockIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

export default function PublicProfilePage() {
  const params   = useParams();
  const router   = useRouter();
  const username = params?.username as string;

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    if (!username) return;
    const load = async () => {
      try {
        const data = await getPublicProfile(username);
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "User not found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  const initials = profile?.name
    ? profile.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const memberSince = profile?.memberSince
    ? new Date(profile.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .pub-layout { display: flex; min-height: 100vh; background: #f7f8fa; font-family: 'Inter', sans-serif; }
        .pub-main { flex: 1; min-width: 0; }
        .pub-content { padding: 2rem; max-width: 700px; }

        .pub-card {
          background: #ffffff; border: 1px solid #e8eaed; border-radius: 18px;
          padding: 2.5rem; box-shadow: 0 1px 2px rgba(15,23,42,0.03);
          text-align: center;
        }
        .pub-avatar {
          width: 88px; height: 88px; border-radius: 50%;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          color: #ffffff; font-family: 'DM Serif Display', serif;
          font-size: 2rem; margin: 0 auto 1.2rem;
          display: flex; align-items: center; justify-content: center;
        }
        .pub-name {
          font-family: 'DM Serif Display', serif; font-size: 1.5rem;
          color: #0f172a; letter-spacing: -0.02em; margin-bottom: 0.2rem;
        }
        .pub-handle { font-size: 0.88rem; color: #94a3b8; margin-bottom: 0.6rem; }
        .pub-bio { font-size: 0.875rem; color: #64748b; margin-bottom: 1rem; line-height: 1.6; }
        .pub-joined { font-size: 0.74rem; color: #cbd5e1; }

        .pub-stats {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 1px; background: #e8eaed; border-radius: 12px;
          overflow: hidden; margin-top: 1.8rem;
        }
        .pub-stat {
          background: #ffffff; padding: 1.2rem 1rem; text-align: center;
        }
        .pub-stat-value {
          font-family: 'DM Serif Display', serif; font-size: 1.6rem;
          color: #0f172a; letter-spacing: -0.02em;
        }
        .pub-stat-label { font-size: 0.76rem; color: #94a3b8; margin-top: 0.25rem; }

        /* Private state */
        .pub-private {
          display: flex; flex-direction: column; align-items: center;
          gap: 0.75rem; padding: 2rem 1rem; color: #94a3b8;
        }
        .pub-private-title { font-size: 1rem; font-weight: 600; color: #334155; }
        .pub-private-sub { font-size: 0.83rem; color: #94a3b8; }

        .pub-back {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.83rem; color: #64748b; cursor: pointer;
          margin-bottom: 1.2rem; background: none; border: none;
          font-family: 'Inter', sans-serif;
        }
        .pub-back:hover { color: #0f172a; }

        .pub-loading { font-size: 0.85rem; color: #94a3b8; padding: 2rem; }
        .pub-error   { font-size: 0.85rem; color: #f87171; padding: 2rem; }
      `}</style>

      <div className="pub-layout">
        <Sidebar />
        <div className="pub-main">
          <Header />
          <div className="pub-content">
            <button className="pub-back" onClick={() => router.back()}>
              ← Back
            </button>

            {loading && <div className="pub-loading">Loading profile...</div>}
            {error   && <div className="pub-error">{error}</div>}

            {!loading && !error && profile && (
              <div className="pub-card">
                <div className="pub-avatar">{initials}</div>
                <div className="pub-name">{profile.name}</div>
                <div className="pub-handle">
                  {profile.username ? `@${profile.username}` : "No username set"}
                </div>

                {profile.private ? (
                  <div className="pub-private">
                    <LockIcon />
                    <div className="pub-private-title">This account is private</div>
                    <div className="pub-private-sub">
                      Only approved followers can see their stats.
                    </div>
                  </div>
                ) : (
                  <>
                    {profile.bio && <div className="pub-bio">{profile.bio}</div>}
                    {memberSince && <div className="pub-joined">Member since {memberSince}</div>}

                    {profile.stats && (
                      <div className="pub-stats">
                        <div className="pub-stat">
                          <div className="pub-stat-value">{profile.stats.journals}</div>
                          <div className="pub-stat-label">Journals</div>
                        </div>
                        <div className="pub-stat">
                          <div className="pub-stat-value">{profile.stats.habits}</div>
                          <div className="pub-stat-label">Habits</div>
                        </div>
                        <div className="pub-stat">
                          <div className="pub-stat-value">{profile.stats.meditations}</div>
                          <div className="pub-stat-label">Meditations</div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}