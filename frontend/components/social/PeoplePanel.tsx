"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSuggestions, getPendingRequests, respondToRequest, SocialUser, FollowRequest } from "@/services/social";
import { followUser } from "@/services/social";

function CheckIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>; }
function XIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>; }
function LockIcon()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }

function UserAvatar({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div style={{
      width: 36, height: 36, borderRadius: "50%",
      background: "linear-gradient(135deg, #16a34a, #4ade80)",
      color: "#fff", fontSize: "0.78rem", fontWeight: 700,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>{initials}</div>
  );
}

export default function PeoplePanel() {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<SocialUser[]>([]);
  const [requests, setRequests]       = useState<FollowRequest[]>([]);
  const [loading, setLoading]         = useState(true);
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const [s, r] = await Promise.all([getSuggestions(), getPendingRequests()]);
        setSuggestions(s);
        setRequests(r);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
      setFollowedIds((prev) => new Set([...prev, userId]));
    } catch {}
  };

  const handleRespond = async (requestId: string, action: "accept" | "reject") => {
    try {
      await respondToRequest(requestId, action);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch {}
  };

  const goToProfile = (username: string | null) => {
    if (username) router.push(`/u/${username}`);
  };

  if (loading) return null;
  if (suggestions.length === 0 && requests.length === 0) return null;

  return (
    <>
      <style>{`
        .people-panel { display: flex; flex-direction: column; gap: 1rem; }

        .people-card { background: #ffffff; border: 1px solid #e8eaed; border-radius: 18px; overflow: hidden; box-shadow: 0 1px 2px rgba(15,23,42,0.03); }
        .people-card-header { padding: 1rem 1.2rem; border-bottom: 1px solid #f1f5f9; font-size: 0.88rem; font-weight: 600; color: #0f172a; }
        .people-card-sub { font-size: 0.72rem; color: #94a3b8; font-weight: 400; margin-left: 0.4rem; }

        .people-row { display: flex; align-items: center; gap: 0.75rem; padding: 0.8rem 1.2rem; border-bottom: 1px solid #f8fafc; }
        .people-row:last-child { border-bottom: none; }
        .people-row-info { flex: 1; min-width: 0; cursor: pointer; }
        .people-row-info:hover .people-row-name { color: #16a34a; }
        .people-row-name { font-size: 0.84rem; font-weight: 600; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.15s; }
        .people-row-handle { font-size: 0.74rem; color: #94a3b8; display: flex; align-items: center; gap: 0.3rem; }

        .people-follow-btn {
          font-size: 0.76rem; font-weight: 600; padding: 0.35rem 0.85rem; border-radius: 7px; border: none; cursor: pointer; white-space: nowrap; font-family: 'Inter', sans-serif; transition: all 0.15s;
        }
        .people-follow-btn.follow { background: #16a34a; color: #fff; }
        .people-follow-btn.follow:hover { background: #15803d; }
        .people-follow-btn.followed { background: #f1f5f9; color: #64748b; cursor: default; }

        /* Accept / Reject buttons */
        .req-actions { display: flex; gap: 0.4rem; }
        .req-btn { display: flex; align-items: center; gap: 0.25rem; font-size: 0.76rem; font-weight: 600; padding: 0.35rem 0.7rem; border-radius: 7px; border: none; cursor: pointer; font-family: 'Inter', sans-serif; transition: all 0.15s; }
        .req-btn.accept { background: #16a34a; color: #fff; }
        .req-btn.accept:hover { background: #15803d; }
        .req-btn.reject { background: #f7f8fa; color: #64748b; border: 1px solid #e8eaed; }
        .req-btn.reject:hover { border-color: #f43f5e; color: #f43f5e; }
      `}</style>

      <div className="people-panel">
        {/* Follow Requests */}
        {requests.length > 0 && (
          <div className="people-card">
            <div className="people-card-header">
              Follow Requests
              <span className="people-card-sub">{requests.length} pending</span>
            </div>
            {requests.map((req) => (
              <div className="people-row" key={req.id}>
                <UserAvatar name={req.sender.name} />
                <div className="people-row-info" onClick={() => goToProfile(req.sender.username)}>
                  <div className="people-row-name">{req.sender.name}</div>
                  <div className="people-row-handle">
                    {req.sender.username ? `@${req.sender.username}` : "No username"}
                  </div>
                </div>
                <div className="req-actions">
                  <button className="req-btn accept" onClick={() => handleRespond(req.id, "accept")}>
                    <CheckIcon /> Accept
                  </button>
                  <button className="req-btn reject" onClick={() => handleRespond(req.id, "reject")}>
                    <XIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* People You May Know */}
        {suggestions.length > 0 && (
          <div className="people-card">
            <div className="people-card-header">People You May Know</div>
            {suggestions.map((u) => (
              <div className="people-row" key={u.id}>
                <UserAvatar name={u.name} />
                <div className="people-row-info" onClick={() => goToProfile(u.username)}>
                  <div className="people-row-name">{u.name}</div>
                  <div className="people-row-handle">
                    {u.username ? `@${u.username}` : "No username"}
                    {!u.isPublic && <><LockIcon /> Private</>}
                  </div>
                </div>
                <button
                  className={`people-follow-btn ${followedIds.has(u.id) ? "followed" : "follow"}`}
                  onClick={() => !followedIds.has(u.id) && handleFollow(u.id)}
                >
                  {followedIds.has(u.id) ? "Sent ✓" : "Follow"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}