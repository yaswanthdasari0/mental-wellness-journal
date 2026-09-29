"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ProfileActivity from "@/components/profile/ProfileActivity";
import { getProfile } from "@/services/user";
import { getAvatar } from "@/services/auth";
import { getFollowers, getFollowing, SocialUser } from "@/services/social";

function SettingsIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>; }
function EditIcon()     { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>; }
function LockIcon()     { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>; }
function XIcon()        { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>; }

function UserListModal({ title, users, loading, onClose, onNavigate }: {
  title: string; users: SocialUser[]; loading: boolean;
  onClose: () => void; onNavigate: (u: SocialUser) => void;
}) {
  return (
    <>
      <style>{`
        .ulm-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:200; display:flex; align-items:center; justify-content:center; }
        .ulm-box { background:#fff; border-radius:18px; width:100%; max-width:400px; max-height:80vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 20px 60px rgba(15,23,42,0.2); }
        .ulm-header { display:flex; align-items:center; justify-content:space-between; padding:1.2rem 1.5rem; border-bottom:1px solid #f1f5f9; }
        .ulm-title { font-size:1rem; font-weight:600; color:#0f172a; }
        .ulm-close { background:none; border:none; cursor:pointer; color:#94a3b8; }
        .ulm-close:hover { color:#0f172a; }
        .ulm-list { overflow-y:auto; flex:1; }
        .ulm-row { display:flex; align-items:center; gap:0.85rem; padding:0.85rem 1.5rem; cursor:pointer; transition:background 0.12s; }
        .ulm-row:hover { background:#f7f8fa; }
        .ulm-avatar { width:38px; height:38px; border-radius:50%; background:linear-gradient(135deg,#16a34a,#4ade80); color:#fff; font-size:0.85rem; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .ulm-name   { font-size:0.875rem; font-weight:600; color:#0f172a; }
        .ulm-handle { font-size:0.76rem; color:#94a3b8; }
        .ulm-private { font-size:0.72rem; color:#7c3aed; }
        .ulm-empty  { padding:2rem; text-align:center; font-size:0.85rem; color:#94a3b8; }
        .ulm-loading { padding:2rem; text-align:center; font-size:0.85rem; color:#94a3b8; }
      `}</style>
      <div className="ulm-overlay" onClick={onClose}>
        <div className="ulm-box" onClick={e => e.stopPropagation()}>
          <div className="ulm-header">
            <div className="ulm-title">{title}</div>
            <button className="ulm-close" onClick={onClose}><XIcon /></button>
          </div>
          <div className="ulm-list">
            {loading
              ? <div className="ulm-loading">Loading...</div>
              : users.length === 0
              ? <div className="ulm-empty">No users yet.</div>
              : users.map(u => (
                <div key={u.id} className="ulm-row" onClick={() => onNavigate(u)}>
                  <div className="ulm-avatar">
                    {u.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0,2)}
                  </div>
                  <div>
                    <div className="ulm-name">{u.name}</div>
                    <div className="ulm-handle">
                      {u.username ? `@${u.username}` : "No username set"}
                    </div>
                    {!u.isPublic && <div className="ulm-private">🔒 Private account</div>}
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile]   = useState<any>(null);
  const [avatar, setAvatarState] = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);

  const [followers, setFollowers]   = useState<SocialUser[]>([]);
  const [following, setFollowing]   = useState<SocialUser[]>([]);
  const [modalOpen, setModalOpen]   = useState<"followers"|"following"|null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setAvatarState(getAvatar());
      } catch {} finally { setLoading(false); }
    };
    load();
    const refresh = () => {
      setAvatarState(getAvatar());
      getProfile().then(setProfile).catch(() => {});
    };
    window.addEventListener("profile-updated", refresh);
    return () => window.removeEventListener("profile-updated", refresh);
  }, []);

  const openModal = async (type: "followers"|"following") => {
    if (!profile) return;
    setModalOpen(type); setModalLoading(true);
    try {
      if (type === "followers") setFollowers(await getFollowers(profile.id));
      else setFollowing(await getFollowing(profile.id));
    } catch {} finally { setModalLoading(false); }
  };

  // Navigate to user — if no username, stay (nothing to navigate to)
  const handleUserClick = (u: SocialUser) => {
    setModalOpen(null);
    if (u.username) router.push(`/u/${u.username}`);
  };

  const initials   = profile?.name
    ? profile.name.split(" ").map((w:string) => w[0]).join("").toUpperCase().slice(0,2)
    : "?";
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US",{month:"long",year:"numeric"})
    : "";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing:border-box; }
        .profile-layout  { display:flex; min-height:100vh; background:#f7f8fa; font-family:'Inter',sans-serif; }
        .profile-main    { flex:1; min-width:0; }
        .profile-content { padding:1.8rem 2rem 3rem; max-width:780px; }

        .profile-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; }
        .profile-page-title { font-family:'DM Serif Display',serif; font-size:1.6rem; color:#0f172a; letter-spacing:-0.02em; }
        .profile-settings-btn {
          display:flex; align-items:center; gap:0.45rem;
          background:#fff; border:1px solid #e8eaed; border-radius:9px;
          padding:0.55rem 1rem; font-size:0.83rem; font-weight:500; color:#64748b;
          cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.15s;
        }
        .profile-settings-btn:hover { border-color:#16a34a; color:#16a34a; }

        .profile-card { background:#fff; border:1px solid #e8eaed; border-radius:18px; padding:1.8rem; box-shadow:0 1px 2px rgba(15,23,42,0.03); }
        .profile-card-top { display:flex; align-items:flex-start; gap:1.4rem; }

        .profile-avatar {
          width:80px; height:80px; border-radius:50%;
          background:linear-gradient(135deg,#16a34a,#4ade80);
          color:#fff; font-family:'DM Serif Display',serif; font-size:1.8rem;
          display:flex; align-items:center; justify-content:center;
          overflow:hidden; flex-shrink:0;
        }
        .profile-avatar img { width:100%; height:100%; object-fit:cover; }
        .profile-info { flex:1; min-width:0; }
        .profile-name   { font-family:'DM Serif Display',serif; font-size:1.3rem; color:#0f172a; letter-spacing:-0.02em; }
        .profile-handle { font-size:0.84rem; color:#94a3b8; margin-top:0.1rem; }
        .profile-bio    { font-size:0.84rem; color:#64748b; margin-top:0.5rem; line-height:1.55; }
        .profile-joined { font-size:0.72rem; color:#cbd5e1; margin-top:0.35rem; }
        .privacy-badge {
          display:inline-flex; align-items:center; gap:0.3rem;
          font-size:0.72rem; font-weight:500; padding:0.2rem 0.6rem;
          border-radius:100px; margin-top:0.4rem;
        }
        .privacy-badge.pub  { background:rgba(22,163,74,0.08);  color:#16a34a; }
        .privacy-badge.priv { background:rgba(124,58,237,0.08); color:#7c3aed; }
        .profile-edit-btn {
          display:flex; align-items:center; gap:0.4rem; flex-shrink:0;
          background:transparent; border:1px solid #e8eaed; color:#64748b;
          padding:0.5rem 1rem; border-radius:8px; font-size:0.82rem; font-weight:500;
          cursor:pointer; font-family:'Inter',sans-serif; transition:all 0.15s;
        }
        .profile-edit-btn:hover { border-color:#16a34a; color:#16a34a; }

        .profile-divider { height:1px; background:#f1f5f9; margin:1.2rem 0; }
        .profile-counts  { display:flex; gap:1.5rem; }
        .profile-count   {
          display:flex; flex-direction:column; align-items:center;
          cursor:pointer; padding:0.4rem 0.9rem; border-radius:10px; transition:background 0.15s;
        }
        .profile-count:hover { background:#f7f8fa; }
        .profile-count:hover .pcn { color:#16a34a; }
        .pcn   { font-family:'DM Serif Display',serif; font-size:1.3rem; color:#0f172a; }
        .pcl   { font-size:0.72rem; color:#94a3b8; }

        .profile-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:#f1f5f9; border-radius:12px; overflow:hidden; margin-top:1.2rem; }
        .profile-stat  { background:#fff; padding:1rem; text-align:center; }
        .psv { font-family:'DM Serif Display',serif; font-size:1.3rem; color:#0f172a; }
        .psl { font-size:0.72rem; color:#94a3b8; margin-top:0.15rem; }

        .profile-loading { font-size:0.85rem; color:#94a3b8; padding:2rem; }
        @media(max-width:600px) {
          .profile-content { padding:1.5rem 1.2rem 2.5rem; }
          .profile-card-top { flex-direction:column; align-items:center; text-align:center; }
        }
      `}</style>

      <div className="profile-layout">
        <Sidebar />
        <div className="profile-main">
          <Header />
          <div className="profile-content">

            <div className="profile-topbar">
              <h1 className="profile-page-title">My Profile</h1>
              <button className="profile-settings-btn" onClick={() => router.push("/settings")}>
                <SettingsIcon /> Settings
              </button>
            </div>

            {loading
              ? <div className="profile-loading">Loading profile...</div>
              : (
                <div className="profile-card">
                  <div className="profile-card-top">
                    {/* Avatar */}
                    <div className="profile-avatar">
                      {avatar ? <img src={avatar} alt="Profile" /> : initials}
                    </div>

                    {/* Info */}
                    <div className="profile-info">
                      <div className="profile-name">{profile?.name}</div>
                      <div className="profile-handle">
                        {profile?.username ? `@${profile.username}` : "No username · add one in Settings"}
                      </div>
                      <div className={`privacy-badge ${profile?.isPublic ? "pub" : "priv"}`}>
                        {!profile?.isPublic && <LockIcon />}
                        {profile?.isPublic ? "Public" : "Private"}
                      </div>
                      {profile?.bio    && <div className="profile-bio">{profile.bio}</div>}
                      {memberSince     && <div className="profile-joined">Member since {memberSince}</div>}
                    </div>

                    {/* Edit button */}
                    <button className="profile-edit-btn" onClick={() => router.push("/settings")}>
                      <EditIcon /> Edit
                    </button>
                  </div>

                  <div className="profile-divider" />

                  {/* Follower / Following counts */}
                  <div className="profile-counts">
                    <div className="profile-count" onClick={() => openModal("followers")}>
                      <div className="pcn">{profile?.followerCount ?? 0}</div>
                      <div className="pcl">Followers</div>
                    </div>
                    <div className="profile-count" onClick={() => openModal("following")}>
                      <div className="pcn">{profile?.followingCount ?? 0}</div>
                      <div className="pcl">Following</div>
                    </div>
                  </div>

                  {/* Stats */}
                  {profile?.stats && (
                    <div className="profile-stats">
                      <div className="profile-stat">
                        <div className="psv">{profile.stats.journals ?? 0}</div>
                        <div className="psl">Journals</div>
                      </div>
                      <div className="profile-stat">
                        <div className="psv">{profile.stats.habits ?? 0}</div>
                        <div className="psl">Habits</div>
                      </div>
                      <div className="profile-stat">
                        <div className="psv">{profile.stats.meditations ?? 0}</div>
                        <div className="psl">Meditations</div>
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            {/* Own journals/moods/habits activity */}
            {!loading && <ProfileActivity />}
          </div>
        </div>
      </div>

      {/* Follower / Following modal */}
      {modalOpen && (
        <UserListModal
          title={modalOpen === "followers" ? `Followers (${profile?.followerCount ?? 0})` : `Following (${profile?.followingCount ?? 0})`}
          users={modalOpen === "followers" ? followers : following}
          loading={modalLoading}
          onClose={() => setModalOpen(null)}
          onNavigate={handleUserClick}
        />
      )}
    </>
  );
}