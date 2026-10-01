import { useState, useEffect } from 'react';
import { Bell, Send, CheckCheck, Info, AlertCircle, Users, Filter, X } from 'lucide-react';
import { notifications as allNotifs } from '@/data/notifications';
import { apiClient } from '@/services/apiClient';
import type { Notification } from '@/types';
import { formatRelative } from '@/lib/utils';

type Category = 'all' | 'alert' | 'info' | 'action' | 'success';

const CATEGORIES: { value: Category; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'all',     label: 'All',        icon: Bell,         color: '#4E6380' },
  { value: 'alert',   label: 'Alerts',     icon: AlertCircle,  color: '#F43F5E' },
  { value: 'info',    label: 'Info',       icon: Info,         color: '#3B82F6' },
  { value: 'action',  label: 'Action',     icon: CheckCheck,   color: '#F59E0B' },
  { value: 'success', label: 'Success',    icon: CheckCheck,   color: '#10B981' },
];

function notifColor(type: string) {
  if (type === 'alert')   return '#F43F5E';
  if (type === 'info')    return '#3B82F6';
  if (type === 'action')  return '#F59E0B';
  if (type === 'success') return '#10B981';
  return '#4E6380';
}

const TEMPLATES = [
  'Drive notification for {company} is now open. Students with CGPA ≥ {cutoff} can apply.',
  'Reminder: Placement drive on {date} at {venue}. Please ensure documentation is ready.',
  'Congratulations! You have received an offer from {company}. Please respond by {deadline}.',
  'Action required: Upload missing documents before {date} to remain eligible.',
];

export function Notifications() {
  const [apiNotifs, setApiNotifs] = useState<Notification[] | null>(null);
  const [notifs, setNotifs] = useState(allNotifs.map(n => ({ ...n })));
  useEffect(() => { apiClient<Notification[]>('/notifications').then(result => { if (result.data.length) { setApiNotifs(result.data); setNotifs(result.data); } }).catch(() => undefined); }, []);
  const [cat, setCat] = useState<Category>('all');
  const [showCompose, setShowCompose] = useState(false);
  const [composeMsg, setComposeMsg] = useState('');
  const [composeTarget, setComposeTarget] = useState('All eligible students');

  const filtered = cat === 'all' ? notifs : notifs.filter(n => n.type === cat);
  const unread = notifs.filter(n => !n.read).length;

  const markAllRead = () => { setNotifs(prev => prev.map(n => ({ ...n, read: true }))); apiClient('/notifications/read-all', { method: 'PATCH' }).catch(() => undefined); };
  const markRead = (id: string) => { setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)); apiClient(`/notifications/${id}/read`, { method: 'PATCH' }).catch(() => undefined); };

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">
            {unread > 0 ? `${unread} unread · ` : ''}Manage announcements and targeted communications
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {unread > 0 && (
            <button className="btn btn-outline btn-sm" onClick={markAllRead}>
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
          <button className="btn btn-primary btn-sm" onClick={() => setShowCompose(true)}>
            <Send size={14} /> Compose
          </button>
        </div>
      </div>

      <div className="notifications-workspace" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>

        {/* ── Feed ─────────────────────── */}
        <div>
          {/* Category chips */}
          <div className="notifications-category-filter" style={{ display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => {
              const Icon = c.icon;
              const count = c.value === 'all' ? notifs.length : notifs.filter(n => n.type === c.value).length;
              const isActive = cat === c.value;
              return (
                <button
                  key={c.value}
                  onClick={() => setCat(c.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 14px', borderRadius: 9,
                    background: isActive ? `${c.color}16` : 'var(--bg-card)',
                    border: `1px solid ${isActive ? `${c.color}35` : 'var(--border-default)'}`,
                    color: isActive ? c.color : 'var(--text-tertiary)',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <Icon size={13} />
                  {c.label}
                  {count > 0 && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 5,
                      background: isActive ? `${c.color}25` : 'rgba(255,255,255,0.07)',
                      color: isActive ? c.color : 'var(--text-tertiary)',
                    }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notif list */}
          <div className="card notifications-feed" style={{ overflow: 'hidden' }}>
            {filtered.length === 0 ? (
              <div className="empty-state"><Bell size={36} style={{ opacity: 0.2 }} /><div>No notifications in this category</div></div>
            ) : filtered.map((n, i) => {
              const color = notifColor(n.type);
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    display: 'flex', gap: 14, padding: '16px 22px',
                    borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    background: n.read ? 'transparent' : 'rgba(59,130,246,0.03)',
                    cursor: 'pointer', transition: 'background 0.15s',
                    borderLeft: n.read ? '3px solid transparent' : `3px solid ${color}`,
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = n.read ? 'transparent' : 'rgba(59,130,246,0.03)'}
                >
                  {/* Icon */}
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: `${color}16`, border: `1px solid ${color}28`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: 2,
                  }}>
                    <Bell size={16} style={{ color }} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: n.read ? 500 : 700, color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: 1.4 }}>
                        {n.title}
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                        {!n.read && (
                          <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                        )}
                        <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                          {formatRelative(n.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.55 }}>{n.body}</div>
                    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                      <span style={{
                        fontSize: 11.5, fontWeight: 700, padding: '2px 8px', borderRadius: 5,
                        background: `${color}14`, color, border: `1px solid ${color}24`,
                      }}>
                        {n.type}
                      </span>
                      {n.targetAudience && (
                        <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Users size={11} /> {n.targetAudience}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Quick compose panel ───────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card notifications-compose" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div className="card-title">Quick Compose</div>
            </div>
            <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Target Audience
                </label>
                <select
                  className="input-base"
                  value={composeTarget}
                  onChange={e => setComposeTarget(e.target.value)}
                  style={{ fontSize: 13 }}
                >
                  <option>All eligible students</option>
                  <option>Unplaced students only</option>
                  <option>CSE/IT branch only</option>
                  <option>CGPA ≥ 8.0</option>
                  <option>Students with active backlogs</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Message
                </label>
                <textarea
                  className="input-base"
                  rows={4}
                  value={composeMsg}
                  onChange={e => setComposeMsg(e.target.value)}
                  placeholder="Type your message or pick a template…"
                  style={{ resize: 'vertical', fontSize: 13 }}
                />
              </div>
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => { setComposeMsg(''); }}
              >
                <Send size={14} /> Send Notification
              </button>
            </div>
          </div>

          {/* Templates */}
          <div className="card notifications-templates" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div className="card-title">Templates</div>
            </div>
            <div style={{ padding: '6px 0 12px' }}>
              {TEMPLATES.map((t, i) => (
                <button
                  key={i}
                  onClick={() => setComposeMsg(t)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '11px 20px',
                    background: 'transparent', border: 'none',
                    borderBottom: i < TEMPLATES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    cursor: 'pointer', transition: 'background 0.12s',
                    fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  {t.slice(0, 60)}…
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
