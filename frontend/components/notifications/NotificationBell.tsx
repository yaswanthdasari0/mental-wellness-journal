"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  getNotifications, markNotificationsRead,
  respondToRequest, AppNotification, FollowRequest,
  getPendingRequests,
} from "@/services/social";

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9a6 6 0 0 1 12 0c0 3 1 4.5 1.5 5.5H4.5C5 13.5 6 12 6 9z"/>
      <path d="M9.5 17a2.5 2.5 0 0 0 5 0"/>
    </svg>
  );
}
function CheckIcon() { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>; }
function XIcon()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>; }

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60)    return "just now";
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function notifIcon(type: string) {
  if (type === "FOLLOW_REQUEST") return "👤";
  if (type === "FOLLOW_ACCEPTED") return "✅";
  if (type === "NEW_FOLLOWER") return "🎉";
  return "🔔";
}

export default function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [requests, setRequests]           = useState<FollowRequest[]>([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [open, setOpen]                   = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const load = async () => {
    try {
      const [notifData, reqData] = await Promise.all([
        getNotifications(),
        getPendingRequests(),
      ]);
      setNotifications(notifData.notifications);
      setUnreadCount(notifData.unreadCount + reqData.length);
      setRequests(reqData);
    } catch {}
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  // Close on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleOpen = async () => {
    setOpen(v => !v);
    // Mark read when opening
    if (!open && unreadCount > 0) {
      try {
        await markNotificationsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(requests.length); // only count pending requests
      } catch {}
    }
  };

  const handleRespond = async (id: string, action: "accept" | "reject") => {
    setActionLoading(id);
    try {
      await respondToRequest(id, action);
      setRequests(prev => prev.filter(r => r.id !== id));
      setUnreadCount(prev => Math.max(0, prev - 1));
      // Add a local notification for accepted
      if (action === "accept") {
        await load(); // refresh to get the FOLLOW_ACCEPTED notif the other side sends
      }
    } catch {} finally { setActionLoading(null); }
  };

  const goTo = (username: string | null | undefined) => {
    if (username) { router.push(`/u/${username}`); setOpen(false); }
  };

  const totalBadge = unreadCount > 0 ? unreadCount : null;

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
          position: absolute; top: calc(100% + 10px); right: 0; width: 360px;
          background: #fff; border: 1px solid #e8eaed; border-radius: 14px;
          box-shadow: 0 8px 32px rgba(15,23,42,0.12); overflow: hidden; z-index: 100;
          max-height: 480px; display: flex; flex-direction: column;
        }
        .nb-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 1.2rem; border-bottom: 1px solid #f1f5f9; flex-shrink: 0;
        }
        .nb-title    { font-size: 0.9rem; font-weight: 600; color: #0f172a; }
        .nb-subtitle { font-size: 0.74rem; color: #94a3b8; }
        .nb-scroll { overflow-y: auto; flex: 1; }
        .nb-section-label {
          padding: 0.5rem 1.2rem 0.25rem; font-size: 0.7rem; font-weight: 600;
          color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;
          background: #fafbfc; border-bottom: 1px solid #f8fafc;
        }

        /* Follow request item */
        .nb-req-item {
          display: flex; align-items: flex-start; gap: 0.75rem;
          padding: 0.85rem 1.2rem; border-bottom: 1px solid #f8fafc;
          background: rgba(22,163,74,0.02);
        }
        .nb-avatar {
          width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          color: #fff; font-size: 0.74rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
        }
        .nb-req-body { flex: 1; min-width: 0; }
        .nb-req-name {
          font-size: 0.83rem; font-weight: 600; color: #0f172a;
          cursor: pointer; display: inline;
        }
        .nb-req-name:hover { color: #16a34a; }
        .nb-req-msg  { font-size: 0.76rem; color: #64748b; margin: 0.1rem 0 0.4rem; }
        .nb-req-time { font-size: 0.7rem; color: #94a3b8; }
        .nb-req-actions { display: flex; gap: 0.4rem; margin-top: 0.5rem; }
        .nb-accept {
          display: flex; align-items: center; gap: 0.3rem;
          background: #16a34a; color: #fff; border: none;
          padding: 0.32rem 0.75rem; border-radius: 6px;
          font-size: 0.75rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif;
        }
        .nb-accept:hover { background: #15803d; }
        .nb-accept:disabled { background: #e8eaed; color: #94a3b8; cursor: not-allowed; }
        .nb-reject {
          display: flex; align-items: center; gap: 0.3rem;
          background: #f7f8fa; color: #64748b; border: 1px solid #e8eaed;
          padding: 0.32rem 0.65rem; border-radius: 6px;
          font-size: 0.75rem; cursor: pointer; font-family: 'Inter', sans-serif;
        }
        .nb-reject:hover { border-color: #f43f5e; color: #f43f5e; background: #fff1f2; }

        /* Regular notification item */
        .nb-notif-item {
          display: flex; align-items: flex-start; gap: 0.75rem;
          padding: 0.8rem 1.2rem; border-bottom: 1px solid #f8fafc;
          cursor: pointer; transition: background 0.12s;
        }
        .nb-notif-item:hover { background: #f7f8fa; }
        .nb-notif-item.unread { background: rgba(22,163,74,0.03); }
        .nb-notif-icon { font-size: 1.2rem; flex-shrink: 0; margin-top: 0.1rem; }
        .nb-notif-body { flex: 1; min-width: 0; }
        .nb-notif-msg  { font-size: 0.82rem; color: #334155; line-height: 1.4; }
        .nb-notif-time { font-size: 0.7rem; color: #94a3b8; margin-top: 0.2rem; }
        .nb-unread-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #16a34a; flex-shrink: 0; margin-top: 0.35rem;
        }

        .nb-empty { padding: 2rem 1.2rem; text-align: center; font-size: 0.84rem; color: #94a3b8; }

        @media (max-width: 480px) { .nb-panel { width: 310px; right: -60px; } }
      `}</style>

      <div className="nb-wrap" ref={ref}>
        <button className="nb-btn" onClick={handleOpen} aria-label="Notifications">
          <BellIcon />
          {totalBadge && <span className="nb-badge">{totalBadge > 9 ? "9+" : totalBadge}</span>}
        </button>

        {open && (
          <div className="nb-panel">
            <div className="nb-header">
              <div className="nb-title">Notifications</div>
              {totalBadge && <div className="nb-subtitle">{totalBadge} new</div>}
            </div>

            <div className="nb-scroll">
              {/* Follow requests at the top */}
              {requests.length > 0 && (
                <>
                  <div className="nb-section-label">Follow Requests</div>
                  {requests.map(r => (
                    <div className="nb-req-item" key={r.id}>
                      <div className="nb-avatar">
                        {r.sender.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div className="nb-req-body">
                        <span className="nb-req-name" onClick={() => goTo(r.sender.username)}>
                          {r.sender.name}
                        </span>
                        <div className="nb-req-msg">wants to follow you</div>
                        <div className="nb-req-time">{timeAgo(r.createdAt)}</div>
                        <div className="nb-req-actions">
                          <button
                            className="nb-accept"
                            onClick={() => handleRespond(r.id, "accept")}
                            disabled={actionLoading === r.id}
                          >
                            <CheckIcon /> Accept
                          </button>
                          <button
                            className="nb-reject"
                            onClick={() => handleRespond(r.id, "reject")}
                            disabled={actionLoading === r.id}
                          >
                            <XIcon /> Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Other notifications */}
              {notifications.length > 0 && (
                <>
                  <div className="nb-section-label">Recent</div>
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`nb-notif-item${!n.read ? " unread" : ""}`}
                      onClick={() => goTo(n.senderUsername)}
                    >
                      <div className="nb-notif-icon">{notifIcon(n.type)}</div>
                      <div className="nb-notif-body">
                        <div className="nb-notif-msg">{n.message}</div>
                        <div className="nb-notif-time">{timeAgo(n.createdAt)}</div>
                      </div>
                      {!n.read && <div className="nb-unread-dot" />}
                    </div>
                  ))}
                </>
              )}

              {requests.length === 0 && notifications.length === 0 && (
                <div className="nb-empty">🔔 You're all caught up!</div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}