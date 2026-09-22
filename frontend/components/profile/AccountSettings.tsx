"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile, UserProfile } from "@/services/user";
import { updateUsernameService } from "@/services/social";

// We call the backend directly from here via updateProfile
// which now accepts username + bio too

export default function AccountSettings() {
  const [user, setUser]           = useState<any | null>(null);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [saving, setSaving]       = useState(false);

  const [draft, setDraft] = useState({
    name: "", email: "", username: "", bio: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        setUser(data);
        setDraft({
          name:     data.name     ?? "",
          email:    data.email    ?? "",
          username: (data as any).username ?? "",
          bio:      (data as any).bio      ?? "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to load account info.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true); setError(""); setSuccess("");
    try {
      const updated = await updateProfile({
        name:     draft.name,
        email:    draft.email,
        username: draft.username || undefined,
        bio:      draft.bio      || undefined,
      } as any);
      setUser(updated);
      setEditing(false);
      setSuccess("Account updated.");
      window.dispatchEvent(new Event("profile-updated"));
      setTimeout(() => setSuccess(""), 2500);
    } catch (err: any) {
      setError(err.message || "Failed to update account.");
    } finally {
      setSaving(false);
    }
  };

  const memberSince = user
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <>
      <style>{`
        .account-settings-card { background: #ffffff; border: 1px solid #e8eaed; border-radius: 18px; overflow: hidden; box-shadow: 0 1px 2px rgba(15,23,42,0.03); }
        .account-settings-header { display: flex; align-items: center; justify-content: space-between; padding: 1.1rem 1.6rem; border-bottom: 1px solid #f1f5f9; }
        .account-settings-title { font-size: 0.95rem; font-weight: 600; color: #0f172a; }
        .account-edit-toggle { font-size: 0.8rem; color: #16a34a; background: none; border: none; cursor: pointer; font-weight: 500; font-family: 'Inter', sans-serif; }
        .account-edit-toggle:hover { color: #15803d; }

        .account-fields { padding: 0.4rem 0; }
        .account-field-row { display: flex; align-items: center; justify-content: space-between; padding: 0.9rem 1.6rem; gap: 1rem; border-bottom: 1px solid #f8fafc; }
        .account-field-row:last-child { border-bottom: none; }
        .account-field-label { font-size: 0.8rem; color: #94a3b8; font-weight: 500; flex-shrink: 0; min-width: 110px; }
        .account-field-value { font-size: 0.875rem; color: #334155; font-weight: 500; text-align: right; word-break: break-all; }
        .account-field-skeleton { background: #f1f5f9; border-radius: 4px; height: 14px; width: 120px; }

        /* Edit form */
        .account-edit-form { padding: 1.2rem 1.6rem; display: flex; flex-direction: column; gap: 0.9rem; border-top: 1px solid #f1f5f9; }
        .account-edit-label { font-size: 0.76rem; color: #64748b; font-weight: 500; margin-bottom: 0.3rem; display: block; }
        .account-edit-input {
          width: 100%; background: #f7f8fa; border: 1px solid #e8eaed; border-radius: 8px;
          padding: 0.65rem 0.9rem; font-size: 0.875rem; color: #334155;
          font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s;
        }
        .account-edit-input:focus { border-color: #16a34a; }
        .account-edit-textarea { resize: vertical; min-height: 70px; }
        .account-edit-hint { font-size: 0.72rem; color: #94a3b8; margin-top: 0.25rem; }
        .account-edit-actions { display: flex; gap: 0.6rem; justify-content: flex-end; }
        .account-btn-save { background: #16a34a; color: #ffffff; border: none; padding: 0.6rem 1.3rem; border-radius: 8px; font-size: 0.84rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; transition: background 0.2s; }
        .account-btn-save:hover { background: #15803d; }
        .account-btn-save:disabled { background: #e8eaed; color: #94a3b8; cursor: not-allowed; }
        .account-btn-cancel { background: transparent; border: 1px solid #e8eaed; color: #64748b; padding: 0.6rem 1.1rem; border-radius: 8px; font-size: 0.84rem; cursor: pointer; font-family: 'Inter', sans-serif; }
        .account-success { font-size: 0.8rem; color: #16a34a; font-weight: 500; padding: 0.5rem 1.6rem; }
        .account-error   { font-size: 0.8rem; color: #f87171; padding: 0.5rem 1.6rem 0.8rem; }
      `}</style>

      <div className="account-settings-card">
        <div className="account-settings-header">
          <div className="account-settings-title">Account Settings</div>
          {!editing && (
            <button className="account-edit-toggle" onClick={() => setEditing(true)}>
              Edit
            </button>
          )}
        </div>

        {/* Read-only rows */}
        {!editing && (
          <div className="account-fields">
            {[
              { label: "Full Name",   value: user?.name                    },
              { label: "Email",       value: user?.email                   },
              { label: "Username",    value: user?.username ? `@${user.username}` : "Not set" },
              { label: "Bio",         value: user?.bio || "—"              },
              { label: "Member Since",value: memberSince                   },
            ].map((f) => (
              <div className="account-field-row" key={f.label}>
                <div className="account-field-label">{f.label}</div>
                {loading
                  ? <div className="account-field-skeleton" />
                  : <div className="account-field-value">{f.value}</div>
                }
              </div>
            ))}
          </div>
        )}

        {success && !editing && <div className="account-success">{success}</div>}

        {/* Edit form */}
        {editing && (
          <div className="account-edit-form">
            <div>
              <label className="account-edit-label">Full Name</label>
              <input className="account-edit-input" value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
            </div>
            <div>
              <label className="account-edit-label">Email</label>
              <input type="email" className="account-edit-input" value={draft.email}
                onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
            </div>
            <div>
              <label className="account-edit-label">Username</label>
              <input className="account-edit-input" value={draft.username}
                placeholder="e.g. akash_pal"
                onChange={(e) => setDraft((d) => ({ ...d, username: e.target.value.toLowerCase() }))} />
              <div className="account-edit-hint">3–20 chars · lowercase letters, numbers, underscores</div>
            </div>
            <div>
              <label className="account-edit-label">Bio</label>
              <textarea className="account-edit-input account-edit-textarea"
                value={draft.bio} placeholder="A short bio about yourself..."
                onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))} />
            </div>
            {error && <div className="account-error">{error}</div>}
            <div className="account-edit-actions">
              <button className="account-btn-cancel" onClick={() => { setEditing(false); setError(""); }}>
                Cancel
              </button>
              <button className="account-btn-save" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}