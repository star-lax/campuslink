import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Users, Zap, CalendarDays, FileText,
  BarChart3, Bell, Settings, Radio, GraduationCap,
  BookOpen, ClipboardList, Trophy, UserCheck,
} from 'lucide-react';
import { notifications } from '@/data/notifications';
import { apiClient } from '@/services/apiClient';
import type { Notification } from '@/types';

type AppRole = 'admin' | 'teacher' | 'student';

interface SidebarProps {
  role: AppRole;
}

const adminNav = [
  { label: 'OVERVIEW', items: [
    { to: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ]},
  { label: 'PLACEMENT OPS', items: [
    { to: '/students', label: 'Students', icon: Users },
    { to: '/matching', label: 'Matching Studio', icon: Zap },
    { to: '/calendar', label: 'Drive Calendar', icon: CalendarDays },
    { to: '/offers', label: 'Offer Tracker', icon: FileText },
  ]},
  { label: 'COMMUNICATION', items: [
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: true },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]},
];

const teacherNav = [
  { label: 'OVERVIEW', items: [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  ]},
  { label: 'CLASSROOM', items: [
    { to: '/students', label: 'My Students', icon: Users },
    { to: '/calendar', label: 'Drive Schedule', icon: CalendarDays },
  ]},
  { label: 'TOOLS', items: [
    { to: '/notifications', label: 'Announcements', icon: Bell, badge: true },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]},
];

const studentNav = [
  { label: 'MY PROFILE', items: [
    { to: '/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
    { to: '/students', label: 'Profile & Skills', icon: GraduationCap },
  ]},
  { label: 'PLACEMENT', items: [
    { to: '/matching', label: 'Job Matches', icon: Zap },
    { to: '/calendar', label: 'Drive Calendar', icon: CalendarDays },
    { to: '/offers', label: 'My Offers', icon: Trophy },
  ]},
  { label: 'UPDATES', items: [
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: true },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]},
];

const roleConfig = {
  admin:   { nav: adminNav,   label: 'Placement Cell Admin',  dot: '#6366F1', initial: 'A' },
  teacher: { nav: teacherNav, label: 'Faculty / Teacher',     dot: '#10B981', initial: 'T' },
  student: { nav: studentNav, label: 'Student View',          dot: '#F59E0B', initial: 'S' },
};

export function Sidebar({ role }: SidebarProps) {
  const location = useLocation();
  const [apiUnread, setApiUnread] = useState<number | null>(null);
  useEffect(() => { apiClient<Notification[]>('/notifications?read=false').then(result => setApiUnread(result.data.length)).catch(() => setApiUnread(null)); }, []);
  const unread = apiUnread ?? notifications.filter(n => !n.read).length;
  const config = roleConfig[role];

  return (
    <aside className="sidebar">
      {/* ── Logo ─────────────────────── */}
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Logo mark */}
          <div style={{ width: 34, height: 34, flexShrink: 0 }}>
            <svg viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="34" height="34" rx="9" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.25)" strokeWidth="1"/>
              <circle cx="11" cy="12" r="4" fill="#3B82F6"/>
              <circle cx="23" cy="12" r="4" fill="#6366F1"/>
              <circle cx="17" cy="22" r="4" fill="#06B6D4"/>
              <line x1="11" y1="12" x2="23" y2="12" stroke="rgba(99,102,241,0.6)" strokeWidth="1.5"/>
              <line x1="11" y1="12" x2="17" y2="22" stroke="rgba(59,130,246,0.6)" strokeWidth="1.5"/>
              <line x1="23" y1="12" x2="17" y2="22" stroke="rgba(6,182,212,0.6)" strokeWidth="1.5"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              CAMPUSLINK
            </div>
            <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 1.5, letterSpacing: '0.04em' }}>
              Placement Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* ── Live indicator ────────────── */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', borderRadius: 8,
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.15)',
        }}>
          <div className="live-dot" />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#6EE7B7', letterSpacing: '0.01em' }}>
            Zoho Corp drive · Live now
          </span>
        </div>
      </div>

      {/* ── Role chip ─────────────────── */}
      <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 11px', borderRadius: 8,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border-subtle)',
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: config.dot, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
            {config.label}
          </span>
        </div>
      </div>

      {/* ── Navigation ───────────────── */}
      <nav style={{ flex: 1, overflowY: 'auto', paddingBottom: 16 }}>
        {config.nav.map(group => (
          <div key={group.label}>
            <div className="nav-group-label">{group.label}</div>
            {group.items.map(({ to, label, icon: Icon, badge }) => {
              const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={16} className="nav-icon" style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1 }}>{label}</span>
                  {badge && unread > 0 && (
                    <span style={{
                      fontSize: 10, fontWeight: 700,
                      background: 'rgba(244,63,94,0.18)',
                      color: '#F87171',
                      padding: '1px 6px', borderRadius: '99px',
                      minWidth: 18, textAlign: 'center',
                    }}>
                      {unread}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Campus footer ─────────────── */}
      <div style={{
        padding: '14px 20px 20px',
        borderTop: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <div style={{ fontSize: 10, color: 'var(--text-disabled)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          Campus
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, lineHeight: 1.35 }}>
          Northbridge Institute of Technology
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 3 }}>
          Batch 2023 – 2027
        </div>
      </div>
    </aside>
  );
}
