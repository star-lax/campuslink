import { useState } from 'react';
import {
  Users, TrendingUp, CalendarCheck, Award, IndianRupee,
  Plus, AlertTriangle, Zap, ArrowRight, CheckCircle2, Clock,
  TrendingDown, Briefcase, Activity,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { motion } from 'framer-motion';
import { students } from '@/data/students';
import { drives } from '@/data/drives';
import { jobs } from '@/data/jobs';
import { readinessBandColor, readinessBandLabel, scoreToColor } from '@/lib/utils';
import { useToast } from '@/components/Toast';

/* ─── Data ─────────────────────────────────────── */
const readinessData = [
  { name: 'Not Ready',          value: 142, color: '#F43F5E' },
  { name: 'Developing',         value: 318, color: '#F59E0B' },
  { name: 'Ready',              value: 512, color: '#60A5FA' },
  { name: 'Highly Employable',  value: 276, color: '#10B981' },
];

const offerFunnel = [
  { stage: 'Draft',          count: 4,  color: '#4E6380' },
  { stage: 'Sent',           count: 18, color: '#6366F1' },
  { stage: 'Accepted',       count: 52, color: '#10B981' },
  { stage: 'Joining Pending', count: 22, color: '#F59E0B' },
];

const placementTrend = [
  { month: 'Jun', placed: 8 },
  { month: 'Jul', placed: 14 },
  { month: 'Aug', placed: 31 },
  { month: 'Sep', placed: 52 },
  { month: 'Oct', placed: 68 },
  { month: 'Nov', placed: 96 },
];

const priorityStudents = students
  .filter(s => s.readinessBand === 'not-ready' || (s.readinessBand === 'developing' && s.riskFlags.length > 0))
  .slice(0, 6);

const kpis = [
  { label: 'Total Students',    value: '1,248', delta: '+12',  positive: true,  icon: Users,         color: '#3B82F6', accent: '--accent-blue'   },
  { label: 'Placement Ready',   value: '68%',   delta: '+4%',  positive: true,  icon: TrendingUp,    color: '#10B981', accent: '--accent-green'  },
  { label: 'Active Drives',     value: '14',    delta: '+6',   positive: true,  icon: CalendarCheck, color: '#F59E0B', accent: '--accent-amber'  },
  { label: 'Offers This Season', value: '96',   delta: '+22',  positive: true,  icon: Award,         color: '#6366F1', accent: '--accent-indigo' },
  { label: 'Avg. Package',      value: '₹12.6L', delta: '+1.2L', positive: true, icon: IndianRupee, color: '#06B6D4', accent: '--accent-cyan'   },
];

const liveToday = drives.filter(d =>
  ['2026-09-22', '2026-09-23', '2026-09-24'].includes(d.date)
).slice(0, 4);

const recruiterRows = jobs.slice(0, 5).map(j => ({
  company: j.companyName,
  initials: j.companyInitials,
  color: j.companyColor,
  role: j.role,
  open: j.openRoles,
  shortlisted: j.shortlistedCount,
  responseRate: j.responseRate,
  status: j.status,
}));

/* ─── Sub-components ────────────────────────────── */
function KpiCard({ label, value, delta, positive, icon: Icon, color }: typeof kpis[0]) {
  return (
    <div className="stat-card animate-in" style={{ '--accent-color': color } as React.CSSProperties}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: 11,
          background: `${color}18`,
          border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={18} style={{ color }} />
        </div>
        <div className={`stat-delta ${positive ? 'positive' : 'negative'}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {delta}
        </div>
      </div>
      <div className="stat-value num">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function SectionCard({ title, subtitle, action, children, noPad }: {
  title: string; subtitle?: string; action?: React.ReactNode;
  children: React.ReactNode; noPad?: boolean;
}) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
        {action}
      </div>
      {noPad ? children : <div style={{ padding: '20px 24px' }}>{children}</div>}
    </div>
  );
}

/* ─── Page ──────────────────────────────────────── */
export function Dashboard() {
  const { toast } = useToast();
  const [, setResolved] = useState<string[]>([]);

  return (
    <div>
      {/* ── Page header ───────────────────────────── */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Placement Command Center</h1>
          <p className="page-subtitle">
            Real-time readiness, drive activity, and offer pipeline — Sep 2026 season
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => toast('Schedule Drive flow — connect to backend API.', 'info')}
          >
            <CalendarCheck size={14} /> Schedule Drive
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => toast('Create Drive flow — connect to backend API.', 'info')}
          >
            <Plus size={14} /> New Drive
          </button>
        </div>
      </div>

      {/* ── KPI Strip ────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.32 }}
          >
            <KpiCard {...k} />
          </motion.div>
        ))}
      </div>

      {/* ── Row 2: Readiness + Priority Interventions ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, marginBottom: 20 }}>

        {/* Readiness Distribution */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SectionCard title="Readiness Distribution" subtitle="1,248 students total">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie
                  data={readinessData}
                  cx="50%" cy="50%"
                  innerRadius={52} outerRadius={76}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {readinessData.map(e => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip
                  content={({ active, payload }) =>
                    active && payload?.[0] ? (
                      <div style={{
                        background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
                        borderRadius: 10, padding: '10px 14px',
                      }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{payload[0].name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{payload[0].value} students</div>
                      </div>
                    ) : null
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 4, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {readinessData.map(d => {
                const pct = Math.round(d.value / 1248 * 100);
                return (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: 13, color: 'var(--text-secondary)' }}>{d.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* Mini progress */}
                      <div style={{ width: 60, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: d.color, borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: d.color, width: 32, textAlign: 'right' }} className="num">{d.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </motion.div>

        {/* Priority Interventions */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <SectionCard
            title="Priority Interventions"
            subtitle="Students needing immediate attention"
            action={
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 12, padding: '3px 10px', background: 'rgba(244,63,94,0.12)', color: '#F87171', borderRadius: 6, fontWeight: 600, border: '1px solid rgba(244,63,94,0.25)' }}>
                  34 at risk
                </span>
                <button className="btn btn-ghost btn-xs" style={{ gap: 5 }}>
                  View all <ArrowRight size={12} />
                </button>
              </div>
            }
            noPad
          >
            <div>
              {priorityStudents.map((s, i) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 24px',
                    borderBottom: i < priorityStudents.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: `${readinessBandColor(s.readinessBand)}20`,
                    border: `1.5px solid ${readinessBandColor(s.readinessBand)}35`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, color: readinessBandColor(s.readinessBand),
                    flexShrink: 0,
                  }}>
                    {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.name}
                      </span>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: '2px 7px',
                        borderRadius: 5,
                        background: `${readinessBandColor(s.readinessBand)}18`,
                        color: readinessBandColor(s.readinessBand),
                        border: `1px solid ${readinessBandColor(s.readinessBand)}30`,
                        flexShrink: 0,
                      }}>
                        {readinessBandLabel(s.readinessBand)}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.branch} · CGPA {s.cgpa} · <span style={{ color: 'var(--accent-rose)' }}>{s.riskFlags[0]}</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: scoreToColor(s.readinessScore), lineHeight: 1 }} className="num">
                      {s.readinessScore}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>score</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </motion.div>
      </div>

      {/* ── Row 3: Drive Timeline + Offer Pipeline ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20, marginBottom: 20 }}>

        {/* Live drive timeline */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <SectionCard
            title="Upcoming Drive Timeline"
            subtitle="Next 3 days"
            action={<button className="btn btn-ghost btn-xs" style={{ gap: 5 }}>Full calendar <ArrowRight size={12} /></button>}
            noPad
          >
            <div>
              {liveToday.map((drive, i) => {
                const isLive = drive.status === 'live';
                const hasConflict = drive.id === 'drive-001' || drive.id === 'drive-002';
                return (
                  <div
                    key={drive.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px 24px',
                      borderBottom: i < liveToday.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    {/* Company logo */}
                    <div style={{
                      width: 42, height: 42, borderRadius: 11, flexShrink: 0,
                      background: `${drive.companyColor}18`,
                      border: `1px solid ${drive.companyColor}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, color: drive.companyColor,
                      letterSpacing: '-0.5px',
                    }}>
                      {drive.companyInitials}
                    </div>

                    {/* Drive info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>
                          {drive.companyName}
                        </span>
                        {isLive && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            fontSize: 11, fontWeight: 700,
                            padding: '2px 8px', borderRadius: 5,
                            background: 'rgba(16,185,129,0.12)',
                            color: '#6EE7B7',
                            border: '1px solid rgba(16,185,129,0.25)',
                          }}>
                            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981' }} className="animate-pulse-glow" />
                            LIVE
                          </span>
                        )}
                        {hasConflict && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontSize: 11, fontWeight: 700,
                            padding: '2px 8px', borderRadius: 5,
                            background: 'rgba(244,63,94,0.10)',
                            color: '#F87171', border: '1px solid rgba(244,63,94,0.22)',
                          }}>
                            <AlertTriangle size={10} /> Conflict
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>
                        {drive.date} · {drive.venue}
                      </div>
                    </div>

                    {/* Counts */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }} className="num">
                        {drive.shortlistedStudents}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>shortlisted</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </motion.div>

        {/* Offer Pipeline */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <SectionCard title="Offer Pipeline" subtitle="96 total offers this season">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {offerFunnel.map(({ stage, count, color }) => {
                const pct = Math.round(count / 52 * 100);
                return (
                  <div key={stage}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{stage}</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color }} className="num">{count}</span>
                    </div>
                    <div className="progress-track" style={{ height: 6 }}>
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.min(pct, 100)}%`, background: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mini placement trend */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>
                Placement Trend
              </div>
              <ResponsiveContainer width="100%" height={70}>
                <AreaChart data={placementTrend}>
                  <defs>
                    <linearGradient id="pgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                  <Area type="monotone" dataKey="placed" stroke="#6366F1" strokeWidth={2} fill="url(#pgGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </motion.div>
      </div>

      {/* ── Row 4: Recruiter Momentum + AI Insight ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>

        {/* Recruiter table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <SectionCard title="Recruiter Momentum" subtitle="Active this season" noPad>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th style={{ textAlign: 'right' }}>Open Roles</th>
                    <th style={{ textAlign: 'right' }}>Shortlisted</th>
                    <th>Response Rate</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recruiterRows.map(r => {
                    const rateColor = r.responseRate >= 80 ? '#10B981' : r.responseRate >= 60 ? '#F59E0B' : '#F43F5E';
                    return (
                      <tr key={r.company}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                              background: `${r.color}18`,
                              border: `1px solid ${r.color}30`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 11, fontWeight: 800, color: r.color,
                            }}>
                              {r.initials}
                            </div>
                            <div>
                              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{r.company}</div>
                              <div style={{ fontSize: 12, color: 'var(--text-tertiary)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.role}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }} className="num">{r.open}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }} className="num">{r.shortlisted}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="progress-track" style={{ height: 5, width: 80 }}>
                              <div className="progress-fill" style={{ width: `${r.responseRate}%`, background: rateColor }} />
                            </div>
                            <span style={{ fontSize: 12.5, fontWeight: 700, color: rateColor }} className="num">{r.responseRate}%</span>
                          </div>
                        </td>
                        <td>
                          <span style={{
                            fontSize: 12, fontWeight: 700,
                            padding: '4px 9px', borderRadius: 6,
                            background: r.status === 'active' ? 'rgba(16,185,129,0.12)' : r.status === 'upcoming' ? 'rgba(245,158,11,0.10)' : 'rgba(99,102,241,0.12)',
                            color: r.status === 'active' ? '#6EE7B7' : r.status === 'upcoming' ? '#FCD34D' : '#A5B4FC',
                            border: `1px solid ${r.status === 'active' ? 'rgba(16,185,129,0.22)' : r.status === 'upcoming' ? 'rgba(245,158,11,0.20)' : 'rgba(99,102,241,0.22)'}`,
                          }}>
                            {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </motion.div>

        {/* AI Insight Card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <div className="card" style={{ height: '100%', background: 'linear-gradient(160deg, #111827, #0F1729)', position: 'relative', overflow: 'hidden' }}>
            {/* Glow bg */}
            <div style={{
              position: 'absolute', top: -40, right: -40, width: 200, height: 200,
              background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{ padding: '24px 24px 22px', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Zap size={18} style={{ color: '#A5B4FC' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#A5B4FC', letterSpacing: '0.04em' }}>AI PATTERN DETECTED</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>Simulated analysis · Not live</div>
                </div>
              </div>

              <h4 style={{
                fontSize: 15, fontWeight: 700, color: 'var(--text-primary)',
                lineHeight: 1.45, marginBottom: 12, letterSpacing: '-0.2px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}>
                Cloud skills gap is reducing eligible pool for 4 upcoming drives
              </h4>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 18 }}>
                Of 248 CSE/IT students eligible for Asterion and Nexavar roles, only 38 have AWS or cloud fundamentals. Companies prefer cloud basics — a 3-week module could expand the pool by <strong style={{ color: 'var(--text-primary)' }}>+74 students</strong>.
              </p>

              <div style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-subtle)',
                borderRadius: 10, padding: '14px 16px', marginBottom: 18,
              }}>
                <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Suggested Actions
                </div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                  <CheckCircle2 size={14} style={{ color: '#10B981', marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Schedule AWS Cloud Practitioner workshop · Target Oct 15
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Clock size={14} style={{ color: '#F59E0B', marginTop: 1, flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Impact: +74 eligible students for Q4 drives
                  </span>
                </div>
              </div>

              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}>
                <Activity size={14} /> View Skill Gap Analysis
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
