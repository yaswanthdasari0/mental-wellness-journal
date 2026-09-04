"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/services/auth";
import { changePassword } from "@/services/user";

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H9" />
      <path d="M13 12h7m0 0-3-3m3 3-3 3" />
    </svg>
  );
}
function ChevronIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export default function SecuritySection() {
  const router = useRouter();
  const [showLogout, setShowLogout]     = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Password form state
  const [currentPw, setCurrentPw]   = useState("");
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [pwLoading, setPwLoading]   = useState(false);
  const [pwError, setPwError]       = useState("");
  const [pwSuccess, setPwSuccess]   = useState("");

  const handleLogout = () => {
    clearAuth();
    document.cookie = "mindspace_token=; path=/; max-age=0";
    router.push("/login");
  };

  const handleChangePassword = async () => {
    setPwError("");
    setPwSuccess("");

    if (!currentPw || !newPw || !confirmPw) {
      setPwError("All fields are required."); return;
    }
    if (newPw.length < 6) {
      setPwError("New password must be at least 6 characters."); return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords don't match."); return;
    }

    setPwLoading(true);
    try {
      await changePassword({ currentPassword: currentPw, newPassword: newPw });
      setPwSuccess("Password changed successfully.");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => { setPwSuccess(""); setShowPassword(false); }, 2000);
    } catch (err: any) {
      setPwError(err.message || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .security-card { background: #ffffff; border: 1px solid #e8eaed; border-radius: 18px; overflow: hidden; box-shadow: 0 1px 2px rgba(15,23,42,0.03); }
        .security-header { padding: 1.1rem 1.6rem; border-bottom: 1px solid #f1f5f9; }
        .security-title { font-size: 0.95rem; font-weight: 600; color: #0f172a; }
        .security-list { padding: 0.4rem 0; }
        .security-row {
          display: flex; align-items: center; gap: 1rem; padding: 1rem 1.6rem;
          border-bottom: 1px solid #f8fafc; cursor: pointer; transition: background 0.15s;
        }
        .security-row:last-child { border-bottom: none; }
        .security-row:hover { background: #fafbfc; }
        .security-row.danger:hover { background: #fff5f5; }
        .security-row-icon { width: 34px; height: 34px; border-radius: 9px; background: #f0fdf4; color: #16a34a; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .security-row.danger .security-row-icon { background: #fff1f2; color: #f43f5e; }
        .security-row-label { flex: 1; font-size: 0.875rem; font-weight: 500; color: #1e293b; }
        .security-row.danger .security-row-label { color: #f43f5e; }
        .security-row-chevron { color: #cbd5e1; }

        /* Password form */
        .pw-form { padding: 0 1.6rem 1.2rem; display: flex; flex-direction: column; gap: 0.7rem; }
        .pw-label { font-size: 0.78rem; color: #64748b; font-weight: 500; margin-bottom: 0.25rem; display: block; }
        .pw-input {
          width: 100%; background: #f7f8fa; border: 1px solid #e8eaed; border-radius: 8px;
          padding: 0.65rem 0.9rem; font-size: 0.875rem; color: #334155;
          font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s;
        }
        .pw-input:focus { border-color: #16a34a; }
        .pw-error   { font-size: 0.8rem; color: #f87171; padding: 0.5rem 0.8rem; background: rgba(248,113,113,0.08); border: 1px solid rgba(248,113,113,0.2); border-radius: 7px; }
        .pw-success { font-size: 0.8rem; color: #16a34a; font-weight: 500; }
        .pw-actions { display: flex; gap: 0.6rem; justify-content: flex-end; margin-top: 0.3rem; }
        .pw-btn-save {
          background: #16a34a; color: #fff; border: none; padding: 0.6rem 1.3rem;
          border-radius: 8px; font-size: 0.84rem; font-weight: 600; cursor: pointer;
          font-family: 'Inter', sans-serif; transition: background 0.2s;
        }
        .pw-btn-save:hover { background: #15803d; }
        .pw-btn-save:disabled { background: #e8eaed; color: #94a3b8; cursor: not-allowed; }
        .pw-btn-cancel {
          background: transparent; border: 1px solid #e8eaed; color: #64748b;
          padding: 0.6rem 1.1rem; border-radius: 8px; font-size: 0.84rem;
          cursor: pointer; font-family: 'Inter', sans-serif;
        }

        /* Logout confirm */
        .logout-confirm { margin: 0 1.6rem 1rem; background: #fff1f2; border: 1px solid #fecdd3; border-radius: 10px; padding: 0.9rem 1rem; font-size: 0.84rem; color: #be123c; }
        .logout-confirm-actions { display: flex; gap: 0.6rem; margin-top: 0.7rem; }
        .logout-confirm-yes { background: #f43f5e; color: #ffffff; border: none; padding: 0.5rem 1.1rem; border-radius: 7px; font-size: 0.82rem; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; }
        .logout-confirm-yes:hover { background: #e11d48; }
        .logout-confirm-no { background: transparent; border: 1px solid #fecdd3; color: #be123c; padding: 0.5rem 1.1rem; border-radius: 7px; font-size: 0.82rem; cursor: pointer; font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="security-card">
        <div className="security-header">
          <div className="security-title">Security</div>
        </div>
        <div className="security-list">
          {/* Change Password row */}
          <div className="security-row" onClick={() => { setShowPassword((v) => !v); setShowLogout(false); }}>
            <div className="security-row-icon"><LockIcon /></div>
            <div className="security-row-label">Change Password</div>
            <div className="security-row-chevron"><ChevronIcon /></div>
          </div>

          {/* Log Out row */}
          <div className="security-row danger" onClick={() => { setShowLogout((v) => !v); setShowPassword(false); }}>
            <div className="security-row-icon"><LogoutIcon /></div>
            <div className="security-row-label">Log Out</div>
            <div className="security-row-chevron"><ChevronIcon /></div>
          </div>
        </div>

        {/* Change password form */}
        {showPassword && (
          <div className="pw-form">
            <div>
              <label className="pw-label">Current Password</label>
              <input type="password" className="pw-input" placeholder="••••••••" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} />
            </div>
            <div>
              <label className="pw-label">New Password</label>
              <input type="password" className="pw-input" placeholder="••••••••" value={newPw} onChange={(e) => setNewPw(e.target.value)} />
            </div>
            <div>
              <label className="pw-label">Confirm New Password</label>
              <input type="password" className="pw-input" placeholder="••••••••" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} />
            </div>
            {pwError   && <div className="pw-error">{pwError}</div>}
            {pwSuccess && <div className="pw-success">{pwSuccess}</div>}
            <div className="pw-actions">
              <button className="pw-btn-cancel" onClick={() => { setShowPassword(false); setPwError(""); }}>Cancel</button>
              <button className="pw-btn-save" onClick={handleChangePassword} disabled={pwLoading}>
                {pwLoading ? "Saving..." : "Change Password"}
              </button>
            </div>
          </div>
        )}

        {/* Logout confirm */}
        {showLogout && (
          <div className="logout-confirm">
            Are you sure you want to log out?
            <div className="logout-confirm-actions">
              <button className="logout-confirm-yes" onClick={handleLogout}>Yes, log out</button>
              <button className="logout-confirm-no" onClick={() => setShowLogout(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}