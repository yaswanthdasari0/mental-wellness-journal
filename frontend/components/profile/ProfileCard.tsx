"use client";

import { useState } from "react";

function CameraIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5l-2 3H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-3.5l-2-3z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a1 1 0 0 0-1 1v15a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1v-7" />
      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

export default function ProfileCard() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Akash Pal");
  const [email, setEmail] = useState("akash@example.com");
  const [draft, setDraft] = useState({ name, email });

  const handleSave = () => {
    setName(draft.name);
    setEmail(draft.email);
    setEditing(false);
  };

  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <>
      <style>{`
        .profile-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          padding: 2rem 1.8rem;
          box-shadow: 0 1px 2px rgba(15,23,42,0.03);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }

        .profile-avatar-wrap { position: relative; }

        .profile-avatar {
          width: 88px; height: 88px;
          border-radius: 50%;
          background: linear-gradient(135deg, #16a34a, #4ade80);
          color: #ffffff;
          font-family: 'DM Serif Display', serif;
          font-size: 2rem;
          display: flex; align-items: center; justify-content: center;
          letter-spacing: -0.02em;
          user-select: none;
        }

        .profile-avatar-edit {
          position: absolute;
          bottom: 2px; right: 2px;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: #ffffff;
          border: 1.5px solid #e8eaed;
          color: #64748b;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
        }
        .profile-avatar-edit:hover { border-color: #16a34a; color: #16a34a; }

        .profile-name {
          font-family: 'DM Serif Display', serif;
          font-size: 1.3rem;
          color: #0f172a;
          letter-spacing: -0.02em;
        }
        .profile-email {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-top: -0.5rem;
        }

        /* Inline edit form */
        .profile-edit-form {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
          text-align: left;
        }
        .profile-edit-label {
          font-size: 0.76rem;
          color: #64748b;
          font-weight: 500;
          margin-bottom: 0.25rem;
          display: block;
        }
        .profile-edit-input {
          width: 100%;
          background: #f7f8fa;
          border: 1px solid #e8eaed;
          border-radius: 8px;
          padding: 0.65rem 0.9rem;
          font-size: 0.875rem;
          color: #334155;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .profile-edit-input:focus { border-color: #16a34a; }

        .profile-edit-actions {
          display: flex;
          gap: 0.6rem;
          justify-content: flex-end;
          margin-top: 0.3rem;
        }
        .profile-btn-save {
          background: #16a34a;
          color: #ffffff;
          border: none;
          padding: 0.6rem 1.3rem;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .profile-btn-save:hover { background: #15803d; }
        .profile-btn-cancel {
          background: transparent;
          border: 1px solid #e8eaed;
          color: #64748b;
          padding: 0.6rem 1.1rem;
          border-radius: 8px;
          font-size: 0.84rem;
          cursor: pointer;
          transition: border-color 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .profile-btn-cancel:hover { border-color: #94a3b8; }

        .profile-edit-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: transparent;
          border: 1px solid #e8eaed;
          color: #64748b;
          padding: 0.55rem 1.1rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s;
          font-family: 'Inter', sans-serif;
        }
        .profile-edit-btn:hover { border-color: #16a34a; color: #16a34a; }

        .profile-joined {
          font-size: 0.74rem;
          color: #cbd5e1;
          margin-top: -0.3rem;
        }
      `}</style>

      <div className="profile-card">
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-avatar-edit"><CameraIcon /></div>
        </div>

        {!editing ? (
          <>
            <div>
              <div className="profile-name">{name}</div>
              <div className="profile-email">{email}</div>
            </div>
            <div className="profile-joined">Member since June 2026</div>
            <button className="profile-edit-btn" onClick={() => { setDraft({ name, email }); setEditing(true); }}>
              <EditIcon /> Edit Profile
            </button>
          </>
        ) : (
          <div className="profile-edit-form">
            <div>
              <label className="profile-edit-label">Name</label>
              <input className="profile-edit-input" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
            </div>
            <div>
              <label className="profile-edit-label">Email</label>
              <input className="profile-edit-input" type="email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
            </div>
            <div className="profile-edit-actions">
              <button className="profile-btn-cancel" onClick={() => setEditing(false)}>Cancel</button>
              <button className="profile-btn-save" onClick={handleSave}>Save</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}