"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getPendingRequests, respondToRequest, FollowRequest } from "@/services/social";

function BellIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 3 1 4.5 1.5 5.5H4.5C5 13.5 6 12 6 9z"/><path d="M9.5 17a2.5 2.5 0 0 0 5 0"/></svg>; }
function CheckIcon() { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>; }
function XIcon()     { return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>; }

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60)   return "just now";
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

export default function NotificationBell() {
  const router = useRouter();
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [open, setOpen]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const load = async () => {
    try { setRequests(await getPendingRequests()); } catch {}
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const respond = async (id: string, action: "accept" | "reject") => {
    setLoading(true);
    try {
      await respondToRequest(id, action);
      setRequests(p => p.filter(r => r.id !== id));
    } catch {} finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        .nb-wrap { position: relative; }
        .nb-btn {
          display: flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 9px;
          background: #f4f6f8; border: 1px solid #e8eaed;
          cursor: pointer; color: #64748b; position: relative; transition: background 0.15s;
        }
        .nb-btn:hover { background: #eef1f4; color: #0f172a; }
        .nb-badge {
          position: absolute; top: -5px; right: -5px;
          background: #f43f5e; color: #fff; font-size: 0.6rem; font-weight: 700;
          min-width: 17px; height: 17px; border-radius: 100px;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px; border: 2px solid #fff;
        }
        .nb-panel {
          position: absolute; top: calc(100% + 10px); right: 0; width: 340px;
          background: #fff; border: 1px solid #e8eaed; border-radius: 14px;
          box-shadow: 0 8px 32px rgba(15,23,42,0.12); overflow: hidden; z-index: 100;
        }
        .nb-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.2rem; border-bottom: 1px solid #f1f5f9;
        }
        .nb-title { font-size: 0.9rem; font-weight: 600; color: #0f172a; }
        .nb-subtitle { font-size: 0.74rem; color: #94a3b8; }
        .nb-item {
          display: flex; align-items: flex-start; gap: 0.75rem;
          padding: 0.9rem 1.2rem; border-bottom: 1px solid #f8fafc;
        }
        .nb-item:last-child { border-bottom: none; }
        .nb-avatar {
          width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg,#16a34a,#4ade80);
          color: #fff; font-size: 0.75rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .nb-body { flex: 1; }
        .nb-name { font-size: 0.84rem; font-weight: 600; color: #0f172a; cursor: pointer; }
        .nb-name:hover { color: #16a34a; }
        .nb-msg  { font-size: 0.76rem; color: #64748b; margin: 0.1rem 0 0.4rem; }
        .nb-time { font-size: 0.7rem; color: #94a3b8; }
        .nb-actions { display: flex; gap: 0.4rem; margin-top: 0.5rem; }
        .nb-accept {
          display: flex; align-items: center; gap: 0.3rem;
          background: #16a34a; color: #fff; border: none;
          padding: 0.35rem 0.8rem; border-radius: 7px;
          font-size: 0.76rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif;
        }
        .nb-accept:hover { background: #15803d; }
        .nb-accept:disabled { background: #e8eaed; color: #94a3b8; cursor: not-allowed; }
        .nb-reject {
          display: flex; align-items: center; gap: 0.3rem;
          background: #f7f8fa; color: #64748b; border: 1px solid #e8eaed;
          padding: 0.35rem 0.65rem; border-radius: 7px;
          font-size: 0.76rem; cursor: pointer; font-family: 'Inter', sans-serif;
        }
        .nb-reject:hover { border-color: #f43f5e; color: #f43f5e; background: #fff1f2; }
        .nb-empty { padding: 2rem 1.2rem; text-align: center; font-size: 0.84rem; color: #94a3b8; }
      `}</style>

      <div className="nb-wrap" ref={ref}>
        <button className="nb-btn" onClick={() => setOpen(v => !v)}>
          <BellIcon />
          {requests.length > 0 && (
            <span className="nb-badge">{requests.length > 9 ? "9+" : requests.length}</span>
          )}
        </button>

        {open && (
          <div className="nb-panel">
            <div className="nb-header">
              <div className="nb-title">Notifications</div>
              {requests.length > 0 && (
                <div className="nb-subtitle">{requests.length} follow request{requests.length > 1 ? "s" : ""}</div>
              )}
            </div>

            {requests.length === 0
              ? <div className="nb-empty">🔔 You're all caught up!</div>
              : requests.map(r => (
                <div className="nb-item" key={r.id}>
                  <div className="nb-avatar">
                    {r.sender.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                  </div>
                  <div className="nb-body">
                    <div
                      className="nb-name"
                      onClick={() => { if (r.sender.username) { router.push(`/u/${r.sender.username}`); setOpen(false); } }}
                    >
                      {r.sender.name}
                    </div>
                    <div className="nb-msg">wants to follow you</div>
                    <div className="nb-time">{timeAgo(r.createdAt)}</div>
                    <div className="nb-actions">
                      <button className="nb-accept" onClick={() => respond(r.id, "accept")} disabled={loading}>
                        <CheckIcon /> Accept
                      </button>
                      <button className="nb-reject" onClick={() => respond(r.id, "reject")} disabled={loading}>
                        <XIcon /> Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </>
  );
}