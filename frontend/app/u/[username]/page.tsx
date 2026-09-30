"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import {
  getPublicProfile, followUser, unfollowUser,
  blockUser, getFollowers, getFollowing,
  PublicProfile, SocialUser,
} from "@/services/social";

const MOOD_EMOJI: Record<string, string> = {
  great: "😄", happy: "😊", neutral: "😐", sad: "😢", stressed: "😰",
};

function timeAgo(d: string) {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60)    return "just now";
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

function LockIcon()      { return <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function ClockIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>; }
function UserPlusIcon()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/></svg>; }
function UserCheckIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M16 11l2 2 4-4"/></svg>; }
function DotsIcon()      { return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>; }
function XIcon()         { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>; }

type Tab = "journals" | "moods" | "habits";

// Unfollow confirmation dialog
function UnfollowDialog({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:340, padding:"1.8rem", textAlign:"center", boxShadow:"0 20px 60px rgba(15,23,42,0.2)" }}>
        <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:"1.1rem", color:"#0f172a", marginBottom:"0.5rem" }}>
          Unfollow @{name}?
        </div>
        <div style={{ fontSize:"0.83rem", color:"#64748b", marginBottom:"1.4rem", lineHeight:1.5 }}>
          You can follow them again anytime. If their account is private, you'll need to send a new request.
        </div>
        <div style={{ display:"flex", gap:"0.7rem", justifyContent:"center" }}>
          <button onClick={onCancel} style={{ padding:"0.6rem 1.3rem", borderRadius:8, border:"1px solid #e8eaed", background:"transparent", color:"#64748b", fontFamily:"'Inter',sans-serif", cursor:"pointer", fontSize:"0.85rem" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ padding:"0.6rem 1.3rem", borderRadius:8, border:"none", background:"#f43f5e", color:"#fff", fontFamily:"'Inter',sans-serif", cursor:"pointer", fontWeight:600, fontSize:"0.85rem" }}>
            Unfollow
          </button>
        </div>
      </div>
    </div>
  );
}

// Block confirmation dialog
function BlockDialog({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:360, padding:"1.8rem", textAlign:"center", boxShadow:"0 20px 60px rgba(15,23,42,0.2)" }}>
        <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:"1.1rem", color:"#0f172a", marginBottom:"0.5rem" }}>
          Block {name}?
        </div>
        <div style={{ fontSize:"0.83rem", color:"#64748b", marginBottom:"1.4rem", lineHeight:1.55 }}>
          They won't be able to find your profile, and you won't see theirs. You can unblock them later in Settings.
        </div>
        <div style={{ display:"flex", gap:"0.7rem", justifyContent:"center" }}>
          <button onClick={onCancel} style={{ padding:"0.6rem 1.3rem", borderRadius:8, border:"1px solid #e8eaed", background:"transparent", color:"#64748b", fontFamily:"'Inter',sans-serif", cursor:"pointer", fontSize:"0.85rem" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ padding:"0.6rem 1.3rem", borderRadius:8, border:"none", background:"#0f172a", color:"#fff", fontFamily:"'Inter',sans-serif", cursor:"pointer", fontWeight:600, fontSize:"0.85rem" }}>
            Block
          </button>
        </div>
      </div>
    </div>
  );
}

// Follower/Following modal
function UserListModal({ title, users, onClose, onNavigate }: {
  title: string; users: SocialUser[]; onClose: () => void;
  onNavigate: (username: string | null) => void;
}) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:18, width:"100%", maxWidth:400, maxHeight:"80vh", display:"flex", flexDirection:"column", overflow:"hidden", boxShadow:"0 20px 60px rgba(15,23,42,0.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"1.2rem 1.5rem", borderBottom:"1px solid #f1f5f9" }}>
          <div style={{ fontWeight:600, fontSize:"1rem", color:"#0f172a" }}>{title}</div>
          <button style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8" }} onClick={onClose}><XIcon /></button>
        </div>
        <div style={{ overflowY:"auto", flex:1 }}>
          {users.length === 0
            ? <div style={{ padding:"2rem", textAlign:"center", fontSize:"0.85rem", color:"#94a3b8" }}>No users yet.</div>
            : users.map(u => (
              <div key={u.id} onClick={() => onNavigate(u.username)}
                style={{ display:"flex", alignItems:"center", gap:"0.85rem", padding:"0.85rem 1.5rem", cursor:"pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f7f8fa")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#16a34a,#4ade80)", color:"#fff", fontSize:"0.85rem", fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  {u.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:"0.875rem", color:"#0f172a" }}>{u.name}</div>
                  <div style={{ fontSize:"0.76rem", color:"#94a3b8" }}>
                    {u.username ? `@${u.username}` : "No username"}
                    {!u.isPublic && " · 🔒 Private"}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default function PublicProfilePage() {
  const params   = useParams();
  const router   = useRouter();
  const username = params?.username as string;

  const [profile, setProfile]         = useState<PublicProfile | null>(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [following, setFollowing]     = useState(false);
  const [requested, setRequested]     = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [tab, setTab]                 = useState<Tab>("journals");
  const [menuOpen, setMenuOpen]       = useState(false);
  const [showUnfollow, setShowUnfollow] = useState(false);
  const [showBlock, setShowBlock]     = useState(false);
  const [blocked, setBlocked]         = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);

  const [modalOpen, setModalOpen]     = useState<"followers" | "following" | null>(null);
  const [modalUsers, setModalUsers]   = useState<SocialUser[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
    const load = async () => {
      try {
        const data = await getPublicProfile(username);
        setProfile(data);
        setFollowing(data.isFollowing ?? false);
        setRequested(data.hasPendingRequest ?? false);
        setFollowerCount(data.followerCount ?? 0);
        setBlocked(data.isBlockedByMe ?? false);
      } catch (e: any) {
        setError(e.message || "User not found.");
      } finally { setLoading(false); }
    };
    load();
  }, [username]);

  const handleFollowClick = () => {
    if (following) { setShowUnfollow(true); return; }
    doFollow();
  };

  const doFollow = async () => {
    if (!profile) return;
    setFollowLoading(true);
    try {
      const res = await followUser(profile.id);
      setFollowing(res.following);
      setRequested(res.requested ?? false);
      setFollowerCount(res.followerCount);
    } catch {} finally { setFollowLoading(false); }
  };

  const doUnfollow = async () => {
    if (!profile) return;
    setShowUnfollow(false);
    setFollowLoading(true);
    try {
      const res = await unfollowUser(profile.id);
      setFollowing(res.following);
      setRequested(res.requested ?? false);
      setFollowerCount(res.followerCount);
    } catch {} finally { setFollowLoading(false); }
  };

  const cancelRequest = async () => {
    if (!profile) return;
    setFollowLoading(true);
    try {
      const res = await unfollowUser(profile.id);
      setRequested(false);
      setFollowing(false);
      setFollowerCount(res.followerCount);
    } catch {} finally { setFollowLoading(false); }
  };

  const doBlock = async () => {
    if (!profile) return;
    setShowBlock(false); setBlockLoading(true);
    try {
      await blockUser(profile.id);
      setBlocked(true);
      setFollowing(false);
      setRequested(false);
      router.back();
    } catch {} finally { setBlockLoading(false); }
  };

  const openModal = async (type: "followers" | "following") => {
    if (!profile) return;
    setModalOpen(type); setModalLoading(true);
    try {
      const users = type === "followers"
        ? await getFollowers(profile.id)
        : await getFollowing(profile.id);
      setModalUsers(users);
    } catch { setModalUsers([]); } finally { setModalLoading(false); }
  };

  const initials   = profile?.name
    ? profile.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";
  const memberSince = profile?.memberSince
    ? new Date(profile.memberSince).toLocaleDateString("en-US", { month:"long", year:"numeric" })
    : "";

  const activity = (profile as any)?.activity;
  const tabs: { key: Tab; label: string }[] = [
    { key:"journals", label:"📓 Journals" },
    { key:"moods",    label:"😊 Moods"    },
    { key:"habits",   label:"🔥 Habits"   },
  ];

  // Button label / class
  const btnLabel = followLoading ? "..." : requested ? "Requested" : following ? "Following" : "Follow";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .pub-layout  { display: flex; min-height: 100vh; background: #f7f8fa; font-family: 'Inter', sans-serif; }
        .pub-main    { flex: 1; min-width: 0; }
        .pub-content { padding: 2rem; max-width: 740px; }
        .pub-back { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.83rem; color: #64748b; cursor: pointer; margin-bottom: 1.2rem; background: none; border: none; font-family: 'Inter', sans-serif; }
        .pub-back:hover { color: #0f172a; }

        .pub-card { background: #fff; border: 1px solid #e8eaed; border-radius: 18px; padding: 1.8rem; box-shadow: 0 1px 2px rgba(15,23,42,0.03); }
        .pub-top  { display: flex; align-items: flex-start; gap: 1.2rem; }
        .pub-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg,#16a34a,#4ade80); color: #fff; font-family: 'DM Serif Display',serif; font-size: 1.6rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .pub-info   { flex: 1; min-width: 0; }
        .pub-name   { font-family: 'DM Serif Display',serif; font-size: 1.25rem; color: #0f172a; letter-spacing: -0.02em; }
        .pub-handle { font-size: 0.84rem; color: #94a3b8; margin-top: 0.1rem; }
        .pub-bio    { font-size: 0.84rem; color: #64748b; margin-top: 0.4rem; line-height: 1.55; }
        .pub-joined { font-size: 0.72rem; color: #cbd5e1; margin-top: 0.3rem; }
        .pub-own    { display: inline-block; background: rgba(22,163,74,0.08); color: #16a34a; font-size: 0.72rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 100px; margin-top: 0.3rem; }

        /* Top-right actions */
        .pub-actions-wrap { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }
        .pub-follow-btn {
          display: flex; align-items: center; gap: 0.4rem;
          padding: 0.55rem 1.2rem; border-radius: 9px; font-size: 0.84rem; font-weight: 600;
          cursor: pointer; border: none; font-family: 'Inter',sans-serif; transition: all 0.15s; white-space: nowrap;
        }
        .pub-follow-btn.fol { background: #16a34a; color: #fff; }
        .pub-follow-btn.fol:hover { background: #15803d; }
        .pub-follow-btn.req { background: #f7f8fa; color: #64748b; border: 1.5px solid #e8eaed; }
        .pub-follow-btn.req:hover { border-color: #f43f5e; color: #f43f5e; background: #fff1f2; }
        .pub-follow-btn.unf { background: #fff; color: #64748b; border: 1.5px solid #e8eaed; }
        .pub-follow-btn.unf:hover { border-color: #f43f5e; color: #f43f5e; background: #fff1f2; }
        .pub-follow-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Three-dot menu */
        .pub-menu-wrap { position: relative; }
        .pub-dots-btn {
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 8px; border: 1px solid #e8eaed;
          background: #f7f8fa; color: #64748b; cursor: pointer; transition: all 0.15s;
        }
        .pub-dots-btn:hover { border-color: #0f172a; color: #0f172a; }
        .pub-menu-dropdown {
          position: absolute; top: calc(100% + 6px); right: 0; width: 160px;
          background: #fff; border: 1px solid #e8eaed; border-radius: 10px;
          box-shadow: 0 8px 20px rgba(15,23,42,0.1); overflow: hidden; z-index: 50;
        }
        .pub-menu-item {
          padding: 0.7rem 1rem; font-size: 0.84rem; color: #334155; cursor: pointer;
          transition: background 0.12s; font-family: 'Inter',sans-serif;
        }
        .pub-menu-item:hover { background: #f7f8fa; }
        .pub-menu-item.danger { color: #f43f5e; }
        .pub-menu-item.danger:hover { background: #fff1f2; }

        .pub-divider { height: 1px; background: #f1f5f9; margin: 1.2rem 0; }
        .pub-meta  { display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
        .pub-count { display: flex; flex-direction: column; align-items: center; cursor: pointer; padding: 0.4rem 0.8rem; border-radius: 10px; transition: background 0.15s; }
        .pub-count:hover { background: #f7f8fa; }
        .pub-count:hover .pcn { color: #16a34a; }
        .pcn { font-family: 'DM Serif Display',serif; font-size: 1.2rem; color: #0f172a; }
        .pcl { font-size: 0.72rem; color: #94a3b8; }

        .pub-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: #f1f5f9; border-radius: 12px; overflow: hidden; margin-top: 1.2rem; }
        .pub-stat  { background: #fff; padding: 1rem; text-align: center; }
        .psv { font-family: 'DM Serif Display',serif; font-size: 1.3rem; color: #0f172a; }
        .psl { font-size: 0.72rem; color: #94a3b8; margin-top: 0.15rem; }

        .pub-private { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 2rem 1rem; color: #94a3b8; text-align: center; }
        .pub-private-title { font-size: 1rem; font-weight: 600; color: #334155; }
        .pub-private-sub   { font-size: 0.83rem; }

        /* Activity */
        .pub-activity { background: #fff; border: 1px solid #e8eaed; border-radius: 18px; overflow: hidden; margin-top: 1.2rem; box-shadow: 0 1px 2px rgba(15,23,42,0.03); }
        .pub-tabs { display: flex; gap: 0.3rem; padding: 0.75rem 1.1rem; border-bottom: 1px solid #f1f5f9; background: #fafbfc; }
        .pub-tab { padding: 0.45rem 1rem; border-radius: 8px; border: none; font-size: 0.82rem; font-weight: 500; cursor: pointer; font-family: 'Inter',sans-serif; background: transparent; color: #64748b; transition: all 0.15s; }
        .pub-tab.active { background: #16a34a; color: #fff; font-weight: 600; }
        .pub-tab:not(.active):hover { background: #f1f5f9; }
        .pub-act-list { padding: 0.25rem 0; max-height: 400px; overflow-y: auto; }
        .pub-act-item { padding: 0.9rem 1.4rem; border-bottom: 1px solid #f8fafc; }
        .pub-act-item:last-child { border-bottom: none; }
        .pub-act-time { font-size: 0.72rem; color: #94a3b8; margin-top: 0.3rem; }
        .pub-act-empty { padding: 2rem; text-align: center; font-size: 0.84rem; color: #94a3b8; }

        .pub-loading { font-size: 0.85rem; color: #94a3b8; padding: 2rem; }
        .pub-error   { font-size: 0.85rem; color: #f87171; padding: 2rem; }

        @media (max-width: 600px) {
          .pub-content { padding: 1.5rem 1.2rem 2.5rem; }
          .pub-top { flex-direction: column; align-items: center; text-align: center; }
          .pub-actions-wrap { justify-content: center; }
        }
      `}</style>

      <div className="pub-layout">
        <Sidebar />
        <div className="pub-main">
          <Header />
          <div className="pub-content">
            <button className="pub-back" onClick={() => router.back()}>← Back</button>

            {loading && <div className="pub-loading">Loading profile...</div>}
            {error   && <div className="pub-error">{error}</div>}

            {!loading && !error && profile && (
              <>
                <div className="pub-card">
                  <div className="pub-top">
                    <div className="pub-avatar">{initials}</div>

                    <div className="pub-info">
                      <div className="pub-name">{profile.name}</div>
                      <div className="pub-handle">
                        {profile.username ? `@${profile.username}` : "No username set"}
                      </div>
                      {profile.isOwnProfile && <div className="pub-own">Your public profile</div>}
                      {!profile.private && profile.bio    && <div className="pub-bio">{profile.bio}</div>}
                      {!profile.private && memberSince    && <div className="pub-joined">Member since {memberSince}</div>}
                    </div>

                    {/* Action buttons — hide on own profile */}
                    {!profile.isOwnProfile && (
                      <div className="pub-actions-wrap">
                        {/* Follow / Unfollow / Request button */}
                        {requested ? (
                          <button
                            className="pub-follow-btn req"
                            onClick={cancelRequest}
                            disabled={followLoading}
                          >
                            <ClockIcon /> Requested
                          </button>
                        ) : (
                          <button
                            className={`pub-follow-btn ${following ? "unf" : "fol"}`}
                            onClick={handleFollowClick}
                            disabled={followLoading}
                          >
                            {following ? <UserCheckIcon /> : <UserPlusIcon />}
                            {followLoading ? "..." : following ? "Following" : "Follow"}
                          </button>
                        )}

                        {/* Three-dot menu */}
                        <div className="pub-menu-wrap">
                          <button
                            className="pub-dots-btn"
                            onClick={() => setMenuOpen(v => !v)}
                          >
                            <DotsIcon />
                          </button>
                          {menuOpen && (
                            <div className="pub-menu-dropdown">
                              {following && (
                                <div className="pub-menu-item" onClick={() => { setMenuOpen(false); setShowUnfollow(true); }}>
                                  Unfollow
                                </div>
                              )}
                              <div
                                className="pub-menu-item danger"
                                onClick={() => { setMenuOpen(false); setShowBlock(true); }}
                              >
                                Block
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pub-divider" />

                  {/* Follower / Following counts */}
                  <div className="pub-meta">
                    <div className="pub-count" onClick={() => openModal("followers")}>
                      <div className="pcn">{followerCount}</div>
                      <div className="pcl">Followers</div>
                    </div>
                    <div className="pub-count" onClick={() => openModal("following")}>
                      <div className="pcn">{profile.followingCount ?? 0}</div>
                      <div className="pcl">Following</div>
                    </div>
                  </div>

                  {/* Locked state */}
                  {profile.private && (
                    <div className="pub-private">
                      <LockIcon />
                      <div className="pub-private-title">This account is private</div>
                      <div className="pub-private-sub">
                        {requested
                          ? "Your follow request is pending. Once accepted, you'll see their profile."
                          : "Send a follow request to see their profile."}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  {!profile.private && profile.stats && (
                    <div className="pub-stats">
                      <div className="pub-stat"><div className="psv">{profile.stats.journals}</div><div className="psl">Journals</div></div>
                      <div className="pub-stat"><div className="psv">{profile.stats.habits}</div><div className="psl">Habits</div></div>
                      <div className="pub-stat"><div className="psv">{profile.stats.meditations}</div><div className="psl">Meditations</div></div>
                    </div>
                  )}
                </div>

                {/* Activity — only if accessible */}
                {!profile.private && activity && (
                  <div className="pub-activity">
                    <div className="pub-tabs">
                      {tabs.map(t => (
                        <button
                          key={t.key}
                          className={`pub-tab${tab === t.key ? " active" : ""}`}
                          onClick={() => setTab(t.key)}
                        >
                          {t.label}
                          {t.key === "journals" && ` (${activity.journals?.length ?? 0})`}
                          {t.key === "moods"    && ` (${activity.moods?.length ?? 0})`}
                          {t.key === "habits"   && ` (${activity.habits?.length ?? 0})`}
                        </button>
                      ))}
                    </div>
                    <div className="pub-act-list">
                      {tab === "journals" && (!activity.journals?.length
                        ? <div className="pub-act-empty">No journals yet.</div>
                        : activity.journals.map((j: any) => (
                          <div className="pub-act-item" key={j.id}>
                            <div style={{ fontWeight:600, fontSize:"0.875rem", color:"#0f172a" }}>{j.title}</div>
                            <div style={{ fontSize:"0.78rem", color:"#64748b", marginTop:"0.2rem", lineHeight:1.5 }}>{j.preview}</div>
                            <div className="pub-act-time">{timeAgo(j.createdAt)}</div>
                          </div>
                        ))
                      )}
                      {tab === "moods" && (!activity.moods?.length
                        ? <div className="pub-act-empty">No moods logged yet.</div>
                        : activity.moods.map((m: any) => (
                          <div className="pub-act-item" key={m.id}>
                            <div style={{ display:"flex", alignItems:"center", gap:"0.7rem" }}>
                              <span style={{ fontSize:"1.3rem" }}>{MOOD_EMOJI[m.mood] ?? "😐"}</span>
                              <div>
                                <div style={{ fontWeight:600, fontSize:"0.875rem", color:"#0f172a" }}>{m.mood.charAt(0).toUpperCase() + m.mood.slice(1)}</div>
                                {m.note && <div style={{ fontSize:"0.78rem", color:"#64748b" }}>{m.note}</div>}
                              </div>
                            </div>
                            <div className="pub-act-time">{timeAgo(m.createdAt)}</div>
                          </div>
                        ))
                      )}
                      {tab === "habits" && (!activity.habits?.length
                        ? <div className="pub-act-empty">No habits yet.</div>
                        : activity.habits.map((h: any) => (
                          <div className="pub-act-item" key={h.id}>
                            <div style={{ display:"flex", alignItems:"center", gap:"0.7rem" }}>
                              <div style={{ width:8, height:8, borderRadius:"50%", background:"#16a34a", flexShrink:0 }} />
                              <span style={{ fontWeight:500, fontSize:"0.875rem", color:"#1e293b" }}>{h.name}</span>
                              {h.completionCount > 0 && (
                                <span style={{ fontSize:"0.76rem", color:"#f59e0b", fontWeight:600, marginLeft:"auto" }}>
                                  ✅ {h.completionCount}×
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Unfollow confirmation */}
      {showUnfollow && (
        <UnfollowDialog
          name={profile?.username ?? profile?.name ?? ""}
          onConfirm={doUnfollow}
          onCancel={() => setShowUnfollow(false)}
        />
      )}

      {/* Block confirmation */}
      {showBlock && (
        <BlockDialog
          name={profile?.name ?? ""}
          onConfirm={doBlock}
          onCancel={() => setShowBlock(false)}
        />
      )}

      {/* Follower / Following modal */}
      {modalOpen && (
        <UserListModal
          title={modalOpen === "followers" ? "Followers" : "Following"}
          users={modalLoading ? [] : modalUsers}
          onClose={() => setModalOpen(null)}
          onNavigate={u => { setModalOpen(null); if (u) router.push(`/u/${u}`); }}
        />
      )}
    </>
  );
}