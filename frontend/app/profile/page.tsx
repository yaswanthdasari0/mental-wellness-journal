"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { getProfile } from "@/services/user";
import { getAvatar, getUser } from "@/services/auth";
import { getFollowers, getFollowing, SocialUser } from "@/services/social";

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-7"/>
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18M6 6l12 12"/>
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}

function UserListModal({
  title, users, onClose, onNavigate,
}: {
  title: string; users: SocialUser[];
  onClose: () => void;
  onNavigate: (username: string | null) => void;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}><XIcon /></button>
        </div>
        <div className="modal-list">
          {users.length === 0
            ? <div className="modal-empty">No users yet.</div>
            : users.map((u) => (
              <div key={u.id} className="modal-user-row" onClick={() => onNavigate(u.username)}>
                <div className="modal-avatar">
                  {u.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <div className="modal-user-name">{u.name}</div>
                  <div className="modal-user-handle">{u.username ? `@${u.username}` : "No username"}</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile]   = useState<any>(null);
  const [avatar, setAvatar]     = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);

  const [followers, setFollowers]   = useState<SocialUser[]>([]);
  const [following, setFollowing]   = useState<SocialUser[]>([]);
  const [modalOpen, setModalOpen]   = useState<"followers" | "following" | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setAvatar(getAvatar());
      } catch {} finally { setLoading(false); }
    };
    load();

    window.addEventListener("profile-updated", () => {
      setAvatar(getAvatar());
      getProfile().then(setProfile).catch(() => {});
    });
  }, []);

  const openModal = async (type: "followers" | "following") => {
    if (!profile) return;
    setModalOpen(type); setModalLoading(true);
    try {
      const users = type === "followers"
        ? await getFollowers(profile.id)
        : await getFollowing(profile.id);
      type === "followers" ? setFollowers(users) : setFollowing(users);
    } catch {} finally { setModalLoading(false); }
  };

  const initials = profile?.name
    ? profile.name.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  return (
    <>
      <style jsx>{`
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&display=swap');

  * {
    box-sizing: border-box;
  }

  .profile-layout {
    display: flex;
    min-height: 100vh;
    background: #f4f6f8;
    font-family: 'Inter', sans-serif;
  }

  .profile-main {
    flex: 1;
    min-width: 0;
  }

  .profile-content {
    padding: 1.8rem 2rem 3rem;
    max-width: 900px;
    margin: 0 auto;
  }

  .profile-page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.8rem;
  }

  .profile-page-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.7rem;
    color: #0f172a;
    letter-spacing: -0.02em;
  }

  .profile-settings-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #ffffff;
    border: 1px solid #e8eaed;
    border-radius: 10px;
    padding: 0.6rem 1.1rem;
    font-size: 0.84rem;
    font-weight: 500;
    color: #64748b;
    cursor: pointer;
    text-decoration: none;
    transition: border-color 0.15s, color 0.15s, transform 0.15s;
    font-family: 'Inter', sans-serif;
  }

  .profile-settings-btn:hover {
    border-color: #16a34a;
    color: #16a34a;
    transform: translateY(-1px);
  }

  /* Profile card */
  .profile-card {
    background: #ffffff;
    border: 1px solid #eef0f2;
    border-radius: 20px;
    padding: 2.5rem 2rem;
    box-shadow: 0 8px 30px rgba(15, 23, 42, 0.06);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.1rem;
  }

  /* Avatar */
  .profile-avatar-wrap {
    position: relative;
    padding: 4px;
    border-radius: 50%;
    background: linear-gradient(135deg, #16a34a, #4ade80);
  }

  .profile-avatar {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    background: linear-gradient(135deg, #16a34a, #4ade80);
    color: #ffffff;
    font-family: 'DM Serif Display', serif;
    font-size: 2.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 3px solid #ffffff;
  }

  .profile-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .profile-name {
    font-family: 'DM Serif Display', serif;
    font-size: 1.6rem;
    color: #0f172a;
    letter-spacing: -0.02em;
  }

  .profile-handle {
    font-size: 0.88rem;
    color: #94a3b8;
    margin-top: -0.6rem;
  }

  .profile-bio {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.65;
    max-width: 380px;
  }

  .profile-joined {
    font-size: 0.74rem;
    color: #cbd5e1;
    letter-spacing: 0.01em;
  }

  /* Privacy badge */
  .profile-privacy {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.74rem;
    font-weight: 600;
    padding: 0.3rem 0.85rem;
    border-radius: 100px;
    letter-spacing: 0.01em;
  }

  .profile-privacy.public {
    background: rgba(22, 163, 74, 0.1);
    color: #15803d;
  }

  .profile-privacy.private {
    background: rgba(124, 58, 237, 0.1);
    color: #6d28d9;
  }

  /* Follower counts */
  .profile-counts {
    display: flex;
    gap: 1.5rem;
    margin-top: 0.4rem;
  }

  .profile-count {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 0.5rem 1.1rem;
    border-radius: 12px;
    transition: background 0.15s, transform 0.15s;
  }

  .profile-count:hover {
    background: #f4faf6;
    transform: translateY(-1px);
  }

  .profile-count:hover .profile-count-num {
    color: #16a34a;
  }

  .profile-count-num {
    font-family: 'DM Serif Display', serif;
    font-size: 1.5rem;
    color: #0f172a;
    transition: color 0.15s;
  }

  .profile-count-label {
    font-size: 0.74rem;
    color: #94a3b8;
    margin-top: 0.1rem;
  }

  /* Edit profile button */
  .profile-edit-btn {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    background: #0f172a;
    border: 1px solid #0f172a;
    color: #ffffff;
    padding: 0.6rem 1.4rem;
    border-radius: 10px;
    font-size: 0.84rem;
    font-weight: 500;
    cursor: pointer;
    font-family: 'Inter', sans-serif;
    transition: all 0.15s;
    text-decoration: none;
  }

  .profile-edit-btn:hover {
    background: #16a34a;
    border-color: #16a34a;
    transform: translateY(-1px);
  }

  /* Stats row */
  .profile-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: #eef0f2;
    border-radius: 16px;
    overflow: hidden;
    margin-top: 0.6rem;
    width: 100%;
  }

  .profile-stat {
    background: #ffffff;
    padding: 1.1rem;
    text-align: center;
    transition: background 0.15s;
  }

  .profile-stat:hover {
    background: #fafbfc;
  }

  .profile-stat-value {
    font-family: 'DM Serif Display', serif;
    font-size: 1.5rem;
    color: #0f172a;
  }

  .profile-stat-label {
    font-size: 0.74rem;
    color: #94a3b8;
    margin-top: 0.25rem;
  }

  .profile-loading {
    font-size: 0.85rem;
    color: #94a3b8;
    padding: 2rem;
    text-align: center;
  }

  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.5);
    backdrop-filter: blur(2px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-box {
    background: #ffffff;
    border-radius: 20px;
    width: 100%;
    max-width: 400px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 24px 70px rgba(15, 23, 42, 0.25);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid #f1f5f9;
  }

  .modal-title {
    font-size: 1rem;
    font-weight: 600;
    color: #0f172a;
  }

  .modal-close {
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 0.2rem;
    border-radius: 6px;
    transition: background 0.15s, color 0.15s;
  }

  .modal-close:hover {
    color: #0f172a;
    background: #f1f5f9;
  }

  .modal-list {
    overflow-y: auto;
    flex: 1;
  }

  .modal-user-row {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.85rem 1.5rem;
    cursor: pointer;
    transition: background 0.12s;
  }

  .modal-user-row:hover {
    background: #f7f8fa;
  }

  .modal-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #16a34a, #4ade80);
    color: #fff;
    font-size: 0.85rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .modal-user-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #0f172a;
  }

  .modal-user-handle {
    font-size: 0.76rem;
    color: #94a3b8;
  }

  .modal-empty {
    padding: 2rem;
    text-align: center;
    font-size: 0.85rem;
    color: #94a3b8;
  }

  @media (max-width: 560px) {
    .profile-content {
      padding: 1.5rem 1.2rem 2.5rem;
    }

    .profile-card {
      padding: 2rem 1.4rem;
    }

    .profile-counts {
      gap: 0.6rem;
    }
  }
`}</style>

      <div className="profile-layout">
        <Sidebar />
        <div className="profile-main">
          <Header />
          <div className="profile-content">

            {/* Page header */}
            <div className="profile-page-header">
              <h1 className="profile-page-title">My Profile</h1>
              <button
                className="profile-settings-btn"
                onClick={() => router.push("/settings")}
              >
                <SettingsIcon /> Settings
              </button>
            </div>

            {loading ? (
              <div className="profile-loading">Loading profile...</div>
            ) : (
              <div className="profile-card">
                {/* Avatar */}
                <div className="profile-avatar-wrap">
                  <div className="profile-avatar">
                    {avatar
                      ? <img src={avatar} alt="Profile" />
                      : initials
                    }
                  </div>
                </div>

                {/* Name + handle */}
                <div>
                  <div className="profile-name">{profile?.name}</div>
                  <div className="profile-handle">
                    {profile?.username ? `@${profile.username}` : "No username set · go to Settings to add one"}
                  </div>
                </div>

                {/* Privacy badge */}
                <div className={`profile-privacy ${profile?.isPublic ? "public" : "private"}`}>
                  {!profile?.isPublic && <LockIcon />}
                  {profile?.isPublic ? "Public account" : "Private account"}
                </div>

                {/* Bio */}
                {profile?.bio && <div className="profile-bio">{profile.bio}</div>}

                {/* Member since */}
                <div className="profile-joined">Member since {memberSince}</div>

                {/* Follower / Following counts */}
                <div className="profile-counts">
                  <div className="profile-count" onClick={() => openModal("followers")}>
                    <div className="profile-count-num">{followers.length > 0 ? followers.length : profile?.followerCount ?? 0}</div>
                    <div className="profile-count-label">Followers</div>
                  </div>
                  <div className="profile-count" onClick={() => openModal("following")}>
                    <div className="profile-count-num">{following.length > 0 ? following.length : profile?.followingCount ?? 0}</div>
                    <div className="profile-count-label">Following</div>
                  </div>
                </div>

                {/* Edit profile → settings */}
                <button
                  className="profile-edit-btn"
                  onClick={() => router.push("/settings")}
                >
                  <EditIcon /> Edit Profile
                </button>

                {/* Stats */}
                {profile?.stats && (
                  <div className="profile-stats">
                    <div className="profile-stat">
                      <div className="profile-stat-value">{profile.stats.journals ?? 0}</div>
                      <div className="profile-stat-label">Journals</div>
                    </div>
                    <div className="profile-stat">
                      <div className="profile-stat-value">{profile.stats.habits ?? 0}</div>
                      <div className="profile-stat-label">Habits</div>
                    </div>
                    <div className="profile-stat">
                      <div className="profile-stat-value">{profile.stats.meditations ?? 0}</div>
                      <div className="profile-stat-label">Meditations</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <UserListModal
          title={modalOpen === "followers" ? "Followers" : "Following"}
          users={modalLoading ? [] : (modalOpen === "followers" ? followers : following)}
          onClose={() => setModalOpen(null)}
          onNavigate={(username) => { setModalOpen(null); if (username) router.push(`/u/${username}`); }}
        />
      )}
    </>
  );
}