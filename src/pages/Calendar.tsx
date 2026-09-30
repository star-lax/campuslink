import { useState } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle2, Clock, MapPin, Users, X, Zap } from 'lucide-react';
import { drives, conflicts as allConflicts } from '@/data/drives';

/* ─── Helpers ───────────────────────────────────── */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function parseDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m: m - 1, d };
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

function firstDayOfMonth(y: number, m: number) {
  return new Date(y, m, 1).getDay();
}

/* ─── Status helpers ────────────────────────────── */
function driveStatusStyle(status: string) {
  if (status === 'live')     return { bg: 'rgba(16,185,129,0.18)',  color: '#6EE7B7', border: 'rgba(16,185,129,0.3)'  };
  if (status === 'upcoming') return { bg: 'rgba(59,130,246,0.14)',  color: '#93C5FD', border: 'rgba(59,130,246,0.3)'  };
  if (status === 'completed')return { bg: 'rgba(100,116,128,0.14)', color: '#94A3B8', border: 'rgba(100,116,128,0.2)' };
  return                            { bg: 'rgba(245,158,11,0.14)',  color: '#FCD34D', border: 'rgba(245,158,11,0.3)'  };
}

function severityStyle(sev: string) {
  if (sev === 'critical') return { color: '#F43F5E', bg: 'rgba(244,63,94,0.10)',  border: 'rgba(244,63,94,0.22)'  };
  if (sev === 'warning')  return { color: '#F59E0B', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.22)' };
  return                          { color: '#60A5FA', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.22)' };
}

/* ─── Drive popover ─────────────────────────────── */
function DrivePopover({ drive, onClose }: { drive: typeof drives[0]; onClose: () => void }) {
  const st = driveStatusStyle(drive.status);
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
    }} onClick={onClose}>
      <div
        style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
          borderRadius: 18, width: 460, boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top stripe */}
        <div style={{ height: 4, background: drive.companyColor }} />
        <div style={{ padding: '22px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: `${drive.companyColor}20`, border: `1px solid ${drive.companyColor}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: drive.companyColor,
              }}>
                {drive.companyInitials}
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {drive.companyName}
                </div>
                <span style={{
                  fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 5,
                  background: st.bg, color: st.color, border: `1px solid ${st.border}`,
                  marginTop: 4, display: 'inline-block',
                }}>
                  {drive.status}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'var(--bg-hover)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-tertiary)' }}
            >
              <X size={16} />
            </button>
          </div>

          {[
            { icon: Clock,    label: 'Date', value: `${drive.date} · ${drive.time}` },
            { icon: MapPin,   label: 'Venue', value: drive.venue },
            { icon: Users,    label: 'Registered', value: `${drive.registeredStudents} students` },
            { icon: CheckCircle2, label: 'Shortlisted', value: `${drive.shortlistedStudents} students` },
          ].map(row => (
            <div className="info-row" key={row.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <row.icon size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                <span className="info-key">{row.label}</span>
              </div>
              <span className="info-value">{row.value}</span>
            </div>
          ))}

          {drive.roles.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <div className="section-title">Roles</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {drive.roles.map(r => (
                  <span key={r} className="tag">{r}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────── */
export function Calendar() {
  const today = new Date();
  const [year,  setYear ] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDrive, setSelectedDrive] = useState<typeof drives[0] | null>(null);
  const [showOptimizer, setShowOptimizer] = useState(false);

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const totalDays  = daysInMonth(year, month);
  const firstDay   = firstDayOfMonth(year, month);

  const drivesThisMonth = drives.filter(d => {
    const { y, m } = parseDate(d.date);
    return y === year && m === month;
  });

  const drivesOnDay = (day: number) =>
    drivesThisMonth.filter(d => parseDate(d.date).d === day);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Drive Calendar</h1>
          <p className="page-subtitle">Schedule placement drives, detect conflicts, and optimize timing</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setShowOptimizer(true)}
          >
            <Zap size={14} /> Schedule Optimizer
          </button>
          <button className="btn btn-primary btn-sm">+ Add Drive</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

        {/* ── Calendar ──────────────── */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Month nav */}
          <div className="card-header">
            <button
              onClick={prevMonth}
              style={{ background: 'var(--bg-hover)', border: 'none', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="card-title">{MONTHS[month]} {year}</div>
            <button
              onClick={nextMonth}
              style={{ background: 'var(--bg-hover)', border: 'none', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ padding: '0 20px 20px' }}>
            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
              {DAYS.map(d => (
                <div key={d} style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', textAlign: 'center', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {cells.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} />;
                const dayDrives = drivesOnDay(day);
                const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate();
                return (
                  <div
                    key={day}
                    style={{
                      minHeight: 68, padding: '6px 8px',
                      borderRadius: 10, cursor: dayDrives.length ? 'pointer' : 'default',
                      background: isToday ? 'rgba(59,130,246,0.12)' : 'var(--bg-elevated)',
                      border: isToday ? '1px solid rgba(59,130,246,0.3)' : '1px solid var(--border-subtle)',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { if (dayDrives.length) (e.currentTarget as HTMLElement).style.border = '1px solid var(--border-medium)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = isToday ? '1px solid rgba(59,130,246,0.3)' : '1px solid var(--border-subtle)'; }}
                  >
                    <div style={{
                      fontSize: 12, fontWeight: isToday ? 800 : 600,
                      color: isToday ? '#93C5FD' : 'var(--text-secondary)',
                      marginBottom: 4,
                    }}>
                      {day}
                    </div>
                    {dayDrives.slice(0, 2).map(d => (
                      <div
                        key={d.id}
                        onClick={() => setSelectedDrive(d)}
                        style={{
                          fontSize: 10, fontWeight: 600,
                          padding: '2px 5px', borderRadius: 4,
                          background: `${d.companyColor}22`,
                          color: d.companyColor, marginBottom: 2,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          cursor: 'pointer',
                        }}
                      >
                        {d.companyInitials}
                      </div>
                    ))}
                    {dayDrives.length > 2 && (
                      <div style={{ fontSize: 9, color: 'var(--text-tertiary)', fontWeight: 600 }}>+{dayDrives.length - 2} more</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Sidebar: Conflicts + Drives ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Conflicts */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div className="card-title">Conflicts</div>
              <span style={{
                fontSize: 12, fontWeight: 700, padding: '3px 9px', borderRadius: 6,
                background: 'rgba(244,63,94,0.12)', color: '#F87171',
                border: '1px solid rgba(244,63,94,0.22)',
              }}>
                {allConflicts.length}
              </span>
            </div>
            <div>
              {allConflicts.slice(0, 4).map((c, i) => {
                const sev = severityStyle(c.severity);
                return (
                  <div
                    key={c.id}
                    style={{
                      padding: '14px 20px',
                      borderBottom: i < allConflicts.slice(0, 4).length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <AlertTriangle size={14} style={{ color: sev.color, marginTop: 1, flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                          {c.description}
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
                            background: sev.bg, color: sev.color, border: `1px solid ${sev.border}`,
                          }}>
                            {c.severity}
                          </span>
                          <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{c.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* This month's drives */}
          <div className="card" style={{ overflow: 'hidden' }}>
            <div className="card-header">
              <div className="card-title">{MONTHS[month]} Drives</div>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{drivesThisMonth.length} scheduled</span>
            </div>
            <div style={{ overflowY: 'auto', maxHeight: 320 }}>
              {drivesThisMonth.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px 20px' }}>
                  <div style={{ fontSize: 13 }}>No drives this month</div>
                </div>
              ) : drivesThisMonth.map((d, i) => {
                const st = driveStatusStyle(d.status);
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDrive(d)}
                    style={{
                      display: 'flex', gap: 12, alignItems: 'center',
                      padding: '12px 20px',
                      borderBottom: i < drivesThisMonth.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <div style={{
                      width: 8, flexShrink: 0, alignSelf: 'stretch',
                      background: d.companyColor, borderRadius: 4,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                        {d.companyName}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                        {parseDate(d.date).d} {MONTHS[month]} · {d.venue}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 5,
                      background: st.bg, color: st.color, border: `1px solid ${st.border}`,
                      flexShrink: 0,
                    }}>
                      {d.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Drive detail modal */}
      {selectedDrive && <DrivePopover drive={selectedDrive} onClose={() => setSelectedDrive(null)} />}

      {/* Optimizer modal */}
      {showOptimizer && (
        <div className="modal-overlay" onClick={() => setShowOptimizer(false)}>
          <div className="modal-panel" onClick={e => e.stopPropagation()}>
            <div style={{ padding: '28px 28px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={18} style={{ color: '#A5B4FC' }} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Schedule Optimizer</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2 }}>AI-powered conflict resolution</div>
                </div>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 20 }}>
                The optimizer will analyze all scheduled drives, detect student overlap, exam conflicts, and venue constraints, then suggest an optimized calendar that maximizes student participation.
              </p>
              <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 10, padding: '14px 16px', marginBottom: 22 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: '#A5B4FC', marginBottom: 6 }}>Detected issues</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {allConflicts.slice(0, 3).map(c => (
                    <div key={c.id} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 8 }}>
                      <span style={{ color: c.severity === 'critical' ? '#F87171' : '#FCD34D' }}>•</span>
                      {c.description}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="btn btn-outline" onClick={() => setShowOptimizer(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setShowOptimizer(false)}>
                  <Zap size={14} /> Run Optimizer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
