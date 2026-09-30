import { useState } from 'react';
import { Search, Bell, ChevronDown, Building2, User, Shield, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { notifications } from '@/data/notifications';
import { useNavigate } from 'react-router-dom';

type AppRole = 'admin' | 'teacher' | 'student';

interface TopBarProps {
  role: AppRole;
  onRoleChange: (r: AppRole) => void;
}

const roles: { value: AppRole; label: string; icon: React.ElementType; color: string; bg: string; border: string }[] = [
  { value: 'admin',   label: 'Placement Cell Admin', icon: Shield,         color: '#A5B4FC', bg: 'rgba(99,102,241,0.10)',  border: 'rgba(99,102,241,0.22)' },
  { value: 'teacher', label: 'Faculty / Teacher',    icon: User,           color: '#6EE7B7', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.20)' },
  { value: 'student', label: 'Student',              icon: GraduationCap,  color: '#FCD34D', bg: 'rgba(245,158,11,0.10)',  border: 'rgba(245,158,11,0.22)' },
];

function SearchBar() {
  const [val, setVal] = useState('');
  return (
    <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
      <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-disabled)', pointerEvents: 'none' }} />
      <input
        type="search"
        value={val}
        onChange={e => setVal(e.target.value)}
        placeholder="Search students, drives, companies…"
        className="input-base"
        style={{ paddingLeft: 36, fontSize: 13 }}
        aria-label="Global search"
      />
    </div>
  );
}

export function TopBar({ role, onRoleChange }: TopBarProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const navigate = useNavigate();
  const unread = notifications.filter(n => !n.read).length;
  const current = roles.find(r => r.value === role)!;
  const CurrentIcon = current.icon;

  return (
    <header className="topbar">
      <SearchBar />

      {/* Campus pill */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '7px 13px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 9, cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}>
        <Building2 size={13} style={{ color: 'var(--text-tertiary)' }} />
        <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Northbridge Institute
        </span>
        <ChevronDown size={11} style={{ color: 'var(--text-tertiary)' }} />
      </div>

      <div style={{ flex: 1 }} />

      {/* Season tag */}
      <div style={{
        padding: '6px 12px',
        background: 'rgba(59,130,246,0.08)',
        border: '1px solid rgba(59,130,246,0.18)',
        borderRadius: 8,
        fontSize: 12,
        color: '#93C5FD',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}>
        Sep – Dec 2026 Season
      </div>

      {/* Role switcher */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowRoleMenu(v => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 13px',
            background: current.bg,
            border: `1px solid ${current.border}`,
            borderRadius: 9, cursor: 'pointer',
            fontSize: 13, fontWeight: 600, color: current.color,
            fontFamily: 'inherit', transition: 'all 0.15s',
          }}
          aria-label="Switch role"
          aria-expanded={showRoleMenu}
        >
          <CurrentIcon size={14} />
          <span style={{ maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {current.label}
          </span>
          <ChevronDown size={12} style={{ opacity: 0.7, flexShrink: 0 }} />
        </button>

        {showRoleMenu && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, zIndex: 49 }}
              onClick={() => setShowRoleMenu(false)}
            />
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 8px)',
              width: 220,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-medium)',
              borderRadius: 12,
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              overflow: 'hidden',
              zIndex: 50,
            }}>
              <div style={{ padding: '10px 14px 8px', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-disabled)', borderBottom: '1px solid var(--border-subtle)' }}>
                Switch Panel
              </div>
              {roles.map(r => {
                const RIcon = r.icon;
                const isActive = r.value === role;
                return (
                  <button
                    key={r.value}
                    onClick={() => { onRoleChange(r.value); setShowRoleMenu(false); }}
                    style={{
                      width: '100%', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '11px 16px',
                      background: isActive ? r.bg : 'transparent',
                      color: isActive ? r.color : 'var(--text-secondary)',
                      fontSize: 13.5, fontWeight: isActive ? 600 : 500,
                      cursor: 'pointer', border: 'none', fontFamily: 'inherit',
                      transition: 'all 0.12s',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <RIcon size={15} />
                    {r.label}
                    {isActive && (
                      <div style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: r.color }} />
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Notifications */}
      <button
        onClick={() => navigate('/notifications')}
        style={{
          position: 'relative', padding: '8px', borderRadius: 9,
          background: 'transparent', border: '1px solid transparent',
          cursor: 'pointer', color: 'var(--text-tertiary)',
          transition: 'all 0.15s',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)'; }}
        aria-label={`Notifications (${unread} unread)`}
      >
        <Bell size={17} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--accent-rose)',
            border: '1.5px solid var(--bg-base)',
          }} />
        )}
      </button>

      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: '50%',
        background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, color: 'white',
        cursor: 'pointer', flexShrink: 0,
        border: '2px solid rgba(99,102,241,0.35)',
      }}>
        LN
      </div>
    </header>
  );
}
