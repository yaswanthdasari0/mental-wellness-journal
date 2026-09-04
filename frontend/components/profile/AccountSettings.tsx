"use client";

import { useEffect, useState } from "react";
import { getProfile, UserProfile } from "@/services/user";

export default function AccountSettings() {
  const [user, setUser]       = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getProfile();
        setUser(data);
      } catch (err: any) {
        setError(err.message || "Failed to load account info.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const memberSince = user
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  const fields = [
    { label: "Full Name",     value: user?.name      ?? "—" },
    { label: "Email Address", value: user?.email     ?? "—" },
    { label: "Member Since",  value: memberSince           },
  ];

  return (
    <>
      <style>{`
        .account-settings-card { background: #ffffff; border: 1px solid #e8eaed; border-radius: 18px; overflow: hidden; box-shadow: 0 1px 2px rgba(15,23,42,0.03); }
        .account-settings-header { padding: 1.1rem 1.6rem; border-bottom: 1px solid #f1f5f9; }
        .account-settings-title { font-size: 0.95rem; font-weight: 600; color: #0f172a; }
        .account-fields { padding: 0.4rem 0; }
        .account-field-row {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.9rem 1.6rem; gap: 1rem; border-bottom: 1px solid #f8fafc;
        }
        .account-field-row:last-child { border-bottom: none; }
        .account-field-label { font-size: 0.8rem; color: #94a3b8; font-weight: 500; flex-shrink: 0; min-width: 110px; }
        .account-field-value { font-size: 0.875rem; color: #334155; font-weight: 500; text-align: right; }
        .account-field-skeleton { background: #f1f5f9; border-radius: 4px; height: 14px; width: 120px; }
        .account-error { font-size: 0.82rem; color: #f87171; padding: 0.8rem 1.6rem; }
      `}</style>

      <div className="account-settings-card">
        <div className="account-settings-header">
          <div className="account-settings-title">Account Settings</div>
        </div>
        <div className="account-fields">
          {error && <div className="account-error">{error}</div>}
          {fields.map((f) => (
            <div className="account-field-row" key={f.label}>
              <div className="account-field-label">{f.label}</div>
              {loading
                ? <div className="account-field-skeleton" />
                : <div className="account-field-value">{f.value}</div>
              }
            </div>
          ))}
        </div>
      </div>
    </>
  );
}