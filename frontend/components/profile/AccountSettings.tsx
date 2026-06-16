export default function AccountSettings() {
  // TODO: replace with real user data from GET /api/user/profile
  const fields = [
    { label: "Full Name",     value: "Akash Pal"          },
    { label: "Email Address", value: "akash@example.com"  },
    { label: "Phone",         value: "+91 98765 43210"    },
    { label: "Member Since",  value: "June 2026"          },
  ];

  return (
    <>
      <style>{`
        .account-settings-card {
          background: #ffffff;
          border: 1px solid #e8eaed;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(15,23,42,0.03);
        }

        .account-settings-header {
          padding: 1.1rem 1.6rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .account-settings-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
        }

        .account-fields { padding: 0.4rem 0; }

        .account-field-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.9rem 1.6rem;
          gap: 1rem;
          border-bottom: 1px solid #f8fafc;
        }
        .account-field-row:last-child { border-bottom: none; }

        .account-field-label {
          font-size: 0.8rem;
          color: #94a3b8;
          font-weight: 500;
          flex-shrink: 0;
          min-width: 110px;
        }
        .account-field-value {
          font-size: 0.875rem;
          color: #334155;
          font-weight: 500;
          text-align: right;
        }
      `}</style>

      <div className="account-settings-card">
        <div className="account-settings-header">
          <div className="account-settings-title">Account Settings</div>
        </div>
        <div className="account-fields">
          {fields.map((f) => (
            <div className="account-field-row" key={f.label}>
              <div className="account-field-label">{f.label}</div>
              <div className="account-field-value">{f.value}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}