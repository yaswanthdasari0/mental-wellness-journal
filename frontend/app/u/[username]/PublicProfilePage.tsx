"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import {
  getPublicProfile, followUser, unfollowUser,
  getFollowers, getFollowing, PublicProfile, SocialUser,
} from "@/services/social";

function LockIcon() { return <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function ClockIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>; }
function UserPlusIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/></svg>; }
function UserCheckIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M16 11l2 2 4-4"/></svg>; }
function XIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>; }

// Follower / Following modal
function UserListModal({
  title, users, onClose, onNavigate,
}: {
  title: string; users: SocialUser[];
  onClose: () => void;
  onNavigate: (username: string | null) => void;
}) {
  return (
    <>
      <style>{`
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 200; display: flex; align-items: center; justify-content: center; }
        .modal-box { background: #ffffff; border-radius: 18px; width: 100%; max-width: 400px; max-height: 80vh; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 60px rgba(15,23,42,0.2); }
        .modal-header { display: flex; align-items: center; justify-content: space-between; padding: 1.2rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
        .modal-title { font-size: 1rem; font-weight: 600; color: #0f172a; }
        .modal-close { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0.2rem; }
        .modal-close:hover { color: #0f172a; }
        .modal-list { overflow-y: auto; flex: 1; }
        .modal-user-row { display: flex; align-items: center; gap: 0.85rem; padding: 0.85rem 1.5rem; cursor: pointer; transition: background 0.12s; }
        .modal-user-row:hover { background: #f7f8fa; }
        .modal-user-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #16a34a, #4ade80); color: #fff; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .modal-user-name { font-size: 0.875rem; font-weight: 600; color: #0f172a; }
        .modal-user-handle { font-size: 0.76rem; color: #94a3b8; }
        .modal-empty { padding: 2rem; text-align: center; font-size: 0.85rem; color: #94a3b8; }
      `}</style>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-title">{title}</div>
            <button className="modal-close" onClick={onClose}><XIcon /></button>
          </div>
          <div className="modal-list">
            {users.length === 0 ? (
              <div className="modal-empty">No users yet.</div>
            ) : users.map((u) => (
              <div key={u.id} className="modal-user-row" onClick={() => onNavigate(u.username)}>
                <div className="modal-user-avatar">
                  {u.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <div className="modal-user-name">{u.name}</div>
                  <div className="modal-user-handle">{u.username ? `@${u.username}` : "No username"}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function PublicProfilePage() {
  const params   = useParams();
  const router   = useRouter();
  const username = params?.username as string;

  const [profile, setProfile]       = useState<PublicProfile | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [following, setFollowing]   = useState(false);
  const [requested, setRequested]   = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState("");

  // Modal
  const [modalOpen, setModalOpen]   = useState<"followers" | "following" | null>(null);
  const [modalUsers, setModalUsers] = useState<SocialUser[]>([]);
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
      } catch (err: any) {
        setError(err.message || "User not found.");
      } finally { setLoading(false); }
    };
    load();
  }, [username]);

  const handleFollow = async () => {
    if (!profile) return;
    setFollowLoading(true); setFollowError("");
    try {
      let result;
      if (following || requested) {
        result = await unfollowUser(profile.id);
        setFollowing(false); setRequested(false);
      } else {
        result = await followUser(profile.id);
        setFollowing(result.following);
        setRequested(result.requested);
      }
      setFollowerCount(result.followerCount);
    } catch (err: any) {
      setFollowError(err.message);
    } finally { setFollowLoading(false); }
  };

  const openModal = async (type: "followers" | "following") => {
    if (!profile) return;
    setModalOpen(type); setModalLoading(true);
    try {
      const users = type === "followers"
        ? await getFollowers(profile.id)
        : await getFollowing(profile.id);
      setModalUsers(users);
    } catch { setModalUsers([]); }
    finally { setModalLoading(false); }
  };

  const navigateToUser = (uname: string | null) => {
    setModalOpen(null);
    if (uname) router.push(`/u/${uname}`);
  };

  const initials = profile?.name
    ? profile.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const memberSince = profile?.memberSince
    ? new Date(profile.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  // Follow button label / style
  const followBtnLabel = followLoading ? "..."
    : requested  ? "Requested"
    : following  ? "Following"
    : "Follow";
  const followBtnClass = requested ? "requested"
    : following  ? "unfollow"
    : "follow";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .pub-layout { display: flex; min-height: 100vh; background: #f7f8fa; font-family: 'Inter', sans-serif; }
        .pub-main { flex: 1; min-width: 0; }
        .pub-content { padding: 2rem; max-width: 680px; }
        .pub-back { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.83rem; color: #64748b; cursor: pointer; margin-bottom: 1.2rem; background: none; border: none; font-family: 'Inter', sans-serif; }
        .pub-back:hover { color: #0f172a; }

        .pub-card { background: #ffffff; border: 1px solid #e8eaed; border-radius: 18px; padding: 2rem 2rem 2.5rem; box-shadow: 0 1px 2px rgba(15,23,42,0.03); }
        .pub-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #16a34a, #4ade80); color: #fff; font-family: 'DM Serif Display', serif; font-size: 1.8rem; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; }
        .pub-header-row { text-align: center; }
        .pub-own-badge { display: inline-block; background: rgba(22,163,74,0.08); color: #16a34a; font-size: 0.74rem; font-weight: 600; padding: 0.25rem 0.7rem; border-radius: 100px; margin-bottom: 0.6rem; }
        .pub-name { font-family: 'DM Serif Display', serif; font-size: 1.4rem; color: #0f172a; letter-spacing: -0.02em; }
        .pub-handle { font-size: 0.85rem; color: #94a3b8; margin: 0.2rem 0 0.6rem; }
        .pub-bio { font-size: 0.875rem; color: #64748b; line-height: 1.6; margin-bottom: 0.6rem; }
        .pub-joined { font-size: 0.74rem; color: #cbd5e1; }

        /* Follow counts */
        .pub-follow-counts { display: flex; justify-content: center; gap: 2.5rem; margin: 1.4rem 0 1rem; }
        .pub-follow-count { display: flex; flex-direction: column; align-items: center; cursor: pointer; padding: 0.4rem 0.8rem; border-radius: 10px; transition: background 0.15s; }
        .pub-follow-count:hover { background: #f7f8fa; }
        .pub-follow-num { font-family: 'DM Serif Display', serif; font-size: 1.4rem; color: #0f172a; }
        .pub-follow-label { font-size: 0.74rem; color: #94a3b8; }

        /* Follow button */
        .pub-follow-btn-wrap { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; margin-bottom: 1.5rem; }
        .pub-follow-btn {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.65rem 2.2rem; border-radius: 10px; font-size: 0.875rem;
          font-weight: 600; cursor: pointer; transition: all 0.15s;
          font-family: 'Inter', sans-serif; border: none;
        }
        .pub-follow-btn.follow { background: #16a34a; color: #fff; }
        .pub-follow-btn.follow:hover { background: #15803d; }
        .pub-follow-btn.requested { background: #f7f8fa; color: #64748b; border: 1.5px solid #e8eaed; }
        .pub-follow-btn.requested:hover { border-color: #f43f5e; color: #f43f5e; background: #fff1f2; }
        .pub-follow-btn.unfollow { background: #fff; color: #64748b; border: 1.5px solid #e8eaed; }
        .pub-follow-btn.unfollow:hover { border-color: #f43f5e; color: #f43f5e; background: #fff1f2; }
        .pub-follow-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .pub-follow-error { font-size: 0.76rem; color: #f87171; }

        /* Stats */
        .pub-divider { height: 1px; background: #f1f5f9; margin: 1.2rem 0; }
        .pub-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #f1f5f9; border-radius: 12px; overflow: hidden; }
        .pub-stat { background: #fff; padding: 1.2rem 1rem; text-align: center; }
        .pub-stat-value { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: #0f172a; letter-spacing: -0.02em; }
        .pub-stat-label { font-size: 0.76rem; color: #94a3b8; margin-top: 0.25rem; }

        /* Private */
        .pub-private { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 1.5rem 1rem; color: #94a3b8; text-align: center; }
        .pub-private-title { font-size: 1rem; font-weight: 600; color: #334155; }
        .pub-private-sub { font-size: 0.83rem; color: #94a3b8; }

        .pub-loading { font-size: 0.85rem; color: #94a3b8; padding: 2rem; }
        .pub-error   { font-size: 0.85rem; color: #f87171; padding: 2rem; }
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
              <div className="pub-card">
                <div className="pub-avatar">{initials}</div>

                <div className="pub-header-row">
                  {profile.isOwnProfile && <div className="pub-own-badge">Your public profile</div>}
                  <div className="pub-name">{profile.name}</div>
                  <div className="pub-handle">
                    {profile.username ? `@${profile.username}` : "No username set"}
                  </div>
                  {!profile.private && profile.bio   && <div className="pub-bio">{profile.bio}</div>}
                  {!profile.private && memberSince   && <div className="pub-joined">Member since {memberSince}</div>}
                </div>

                {/* Clickable follower/following counts */}
                <div className="pub-follow-counts">
                  <div className="pub-follow-count" onClick={() => openModal("followers")}>
                    <div className="pub-follow-num">{followerCount}</div>
                    <div className="pub-follow-label">Followers</div>
                  </div>
                  <div className="pub-follow-count" onClick={() => openModal("following")}>
                    <div className="pub-follow-num">{profile.followingCount ?? 0}</div>
                    <div className="pub-follow-label">Following</div>
                  </div>
                </div>

                {/* Follow button */}
                {!profile.isOwnProfile && (
                  <div className="pub-follow-btn-wrap">
                    <button
                      className={`pub-follow-btn ${followBtnClass}`}
                      onClick={handleFollow}
                      disabled={followLoading}
                    >
                      {requested ? <ClockIcon /> : following ? <UserCheckIcon /> : <UserPlusIcon />}
                      {followBtnLabel}
                    </button>
                    {followError && <div className="pub-follow-error">{followError}</div>}
                    {requested && (
                      <div style={{ fontSize: "0.74rem", color: "#94a3b8" }}>
                        Request sent — click again to cancel
                      </div>
                    )}
                  </div>
                )}

                {profile.private ? (
                  <div className="pub-private">
                    <LockIcon />
                    <div className="pub-private-title">This account is private</div>
                    <div className="pub-private-sub">
                      {requested
                        ? "Your follow request is pending approval."
                        : "Send a follow request to see their stats."}
                    </div>
                  </div>
                ) : (
                  profile.stats && (
                    <>
                      <div className="pub-divider" />
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
                    </>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Followers / Following modal */}
      {modalOpen && (
        <UserListModal
          title={modalOpen === "followers" ? "Followers" : "Following"}
          users={modalLoading ? [] : modalUsers}
          onClose={() => setModalOpen(null)}
          onNavigate={navigateToUser}
        />
      )}
    </>
  );
}