import { useState } from 'react';
import { User, Bell, Shield, Database, Globe, Save, ChevronRight, Check, Building2 } from 'lucide-react';

type Section = 'profile' | 'notifications' | 'access' | 'integrations' | 'campus';

const SECTIONS: { id: Section; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'profile',        label: 'Profile',              icon: User,      description: 'Manage your personal information and credentials' },
  { id: 'notifications',  label: 'Notifications',        icon: Bell,      description: 'Configure how and when you receive alerts' },
  { id: 'access',         label: 'Access Control',       icon: Shield,    description: 'Manage roles, permissions, and team access' },
  { id: 'integrations',   label: 'Integrations',         icon: Database,  description: 'Connect external APIs and data sources' },
  { id: 'campus',         label: 'Campus Configuration', icon: Building2, description: 'Set placement rules, batches, and policy' },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({ label, sub, checked, onChange }: { label: string; sub?: string; checked: boolean; onChange: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
        {sub && <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>{sub}</div>}
      </div>
      <button
        onClick={onChange}
        style={{
          width: 44, height: 24, borderRadius: 12,
          background: checked ? '#3B82F6' : 'rgba(255,255,255,0.1)',
          border: 'none', cursor: 'pointer', position: 'relative',
          transition: 'background 0.2s', flexShrink: 0,
        }}
        role="switch"
        aria-checked={checked}
      >
        <div style={{
          position: 'absolute', top: 2, left: checked ? 22 : 2,
          width: 20, height: 20, borderRadius: '50%', background: 'white',
          transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  );
}

function IntegrationCard({ name, desc, connected, color }: { name: string; desc: string; connected: boolean; color: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '16px 18px',
      background: 'var(--bg-card)', border: '1px solid var(--border-default)',
      borderRadius: 12, transition: 'border-color 0.15s',
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 11, flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 800, color,
      }}>
        {name.slice(0, 2).toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>{desc}</div>
      </div>
      {connected ? (
        <span style={{
          fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
          background: 'rgba(16,185,129,0.12)', color: '#6EE7B7',
          border: '1px solid rgba(16,185,129,0.22)',
          display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0,
        }}>
          <Check size={12} /> Connected
        </span>
      ) : (
        <button className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>Connect</button>
      )}
    </div>
  );
}

export function Settings() {
  const [section, setSection] = useState<Section>('profile');
  const [saved, setSaved] = useState(false);

  /* Profile state */
  const [name, setName]   = useState('Lakshmi Narayan');
  const [email, setEmail] = useState('lakshminarayan@northbridge.edu.in');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [college, setCollege] = useState('Northbridge Institute of Technology');

  /* Notif toggles */
  const [notifToggles, setNotifToggles] = useState({
    driveConflict: true,
    offerDeadline: true,
    studentAtRisk: true,
    weeklyDigest: false,
    recruiterMessage: true,
    systemAlerts: true,
  });

  /* Access */
  const members = [
    { name: 'Priya S.',         role: 'admin',   email: 'priya@nit.edu'   },
    { name: 'Rahul Verma',      role: 'teacher',  email: 'rahul@nit.edu'  },
    { name: 'Ananya Krishnan',  role: 'teacher',  email: 'ananya@nit.edu' },
    { name: 'Kiran Bose',       role: 'student',  email: 'kiran@nit.edu'  },
  ];

  const roleColors: Record<string, string> = { admin: '#6366F1', teacher: '#10B981', student: '#F59E0B' };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage platform preferences, campus policies, and integrations</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={handleSave} style={{ minWidth: 110 }}>
          {saved ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>

        {/* ── Section nav ──────────────── */}
        <div className="card" style={{ padding: '8px', alignSelf: 'start' }}>
          {SECTIONS.map(s => {
            const Icon = s.icon;
            const isActive = section === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                style={{
                  width: '100%', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', borderRadius: 9,
                  background: isActive ? 'rgba(59,130,246,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                  color: isActive ? '#93C5FD' : 'var(--text-tertiary)',
                  fontSize: 13.5, fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit', marginBottom: 2,
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <Icon size={16} />
                {s.label}
                {isActive && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
              </button>
            );
          })}
        </div>

        {/* ── Content ──────────────────── */}
        <div className="card" style={{ padding: '28px 30px' }}>
          {/* Profile */}
          {section === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4 }}>Profile Information</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Update your public placement cell profile</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <Field label="Full Name">
                  <input className="input-base" value={name} onChange={e => setName(e.target.value)} />
                </Field>
                <Field label="Email Address">
                  <input className="input-base" type="email" value={email} onChange={e => setEmail(e.target.value)} />
                </Field>
                <Field label="Phone Number">
                  <input className="input-base" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                </Field>
                <Field label="Institution">
                  <input className="input-base" value={college} onChange={e => setCollege(e.target.value)} />
                </Field>
              </div>
              <div style={{ paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Change Password</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <Field label="New Password">
                    <input className="input-base" type="password" placeholder="••••••••" />
                  </Field>
                  <Field label="Confirm Password">
                    <input className="input-base" type="password" placeholder="••••••••" />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {section === 'notifications' && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4 }}>Notification Preferences</div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 24 }}>Choose which events trigger alerts</div>
              <Toggle label="Drive Scheduling Conflicts" sub="Get alerted when two drives overlap" checked={notifToggles.driveConflict} onChange={() => setNotifToggles(p => ({ ...p, driveConflict: !p.driveConflict }))} />
              <Toggle label="Offer Acceptance Deadlines" sub="Reminders 48h before offer expires" checked={notifToggles.offerDeadline} onChange={() => setNotifToggles(p => ({ ...p, offerDeadline: !p.offerDeadline }))} />
              <Toggle label="At-Risk Student Alerts" sub="When a student's readiness drops below 40" checked={notifToggles.studentAtRisk} onChange={() => setNotifToggles(p => ({ ...p, studentAtRisk: !p.studentAtRisk }))} />
              <Toggle label="Weekly Placement Digest" sub="Sunday summary of the week's placement activity" checked={notifToggles.weeklyDigest} onChange={() => setNotifToggles(p => ({ ...p, weeklyDigest: !p.weeklyDigest }))} />
              <Toggle label="Recruiter Messages" sub="When a company contacts the placement cell" checked={notifToggles.recruiterMessage} onChange={() => setNotifToggles(p => ({ ...p, recruiterMessage: !p.recruiterMessage }))} />
              <Toggle label="System Alerts" sub="Platform updates, downtime, and maintenance" checked={notifToggles.systemAlerts} onChange={() => setNotifToggles(p => ({ ...p, systemAlerts: !p.systemAlerts }))} />
            </div>
          )}

          {/* Access control */}
          {section === 'access' && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4 }}>Team Access</div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 22 }}>Manage roles and permissions for placement cell staff</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {members.map(m => {
                  const color = roleColors[m.role] ?? '#4E6380';
                  return (
                    <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${color}20`, border: `1.5px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color, flexShrink: 0 }}>
                        {m.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>{m.email}</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6, background: `${color}14`, color, border: `1px solid ${color}25`, flexShrink: 0 }}>
                        {m.role}
                      </span>
                    </div>
                  );
                })}
              </div>
              <button className="btn btn-outline" style={{ marginTop: 18 }}>+ Invite Team Member</button>
            </div>
          )}

          {/* Integrations */}
          {section === 'integrations' && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4 }}>Integrations</div>
              <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 22 }}>Connect external systems and APIs — integration-ready placeholders</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <IntegrationCard name="Google Workspace" desc="Sync calendar, docs, and Gmail"          connected={true}  color="#4285F4" />
                <IntegrationCard name="WhatsApp API"     desc="Send bulk notifications via WhatsApp"   connected={false} color="#25D366" />
                <IntegrationCard name="Zoho Recruit"     desc="Import job descriptions from Zoho"      connected={true}  color="#C8203D" />
                <IntegrationCard name="HRMS Portal"      desc="Sync student records from college HRMS" connected={false} color="#6366F1" />
                <IntegrationCard name="OpenAI API"       desc="Enable AI readiness scoring and matching" connected={false} color="#10B981" />
              </div>
            </div>
          )}

          {/* Campus */}
          {section === 'campus' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 4 }}>Campus Configuration</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Set placement rules, policies, and batch definitions</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <Field label="Institution Name">
                  <input className="input-base" defaultValue="Northbridge Institute of Technology" />
                </Field>
                <Field label="Current Batch">
                  <input className="input-base" defaultValue="2023 – 2027" />
                </Field>
                <Field label="CGPA Cutoff (Standard)">
                  <input className="input-base" type="number" defaultValue="6.0" min="0" max="10" step="0.1" />
                </Field>
                <Field label="Dream Company CTC (₹ LPA)">
                  <input className="input-base" type="number" defaultValue="12" min="0" />
                </Field>
              </div>
              <div style={{ paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Placement Policies</div>
                <Toggle label="One Student – One Job Policy" sub="Students may only accept one offer per season" checked={true} onChange={() => {}} />
                <Toggle label="Dream Upgrade Allowed" sub="Students can switch to a higher-paying offer" checked={true} onChange={() => {}} />
                <Toggle label="Allow Opt-Out" sub="Students can opt out of placement season" checked={false} onChange={() => {}} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
