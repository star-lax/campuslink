import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';
import { TrendingUp, Download, BarChart3 } from 'lucide-react';
import { apiClient } from '@/services/apiClient';

/* ─── Data ─────────────────────────────────────── */
const branchConversion = [
  { branch: 'AIDS', placed: 85, rate: 92 },
  { branch: 'AIML', placed: 68, rate: 87 },
  { branch: 'CSE',  placed: 254, rate: 81 },
  { branch: 'IT',   placed: 148, rate: 75 },
  { branch: 'ECE',  placed: 98,  rate: 63 },
  { branch: 'EEE',  placed: 64,  rate: 52 },
  { branch: 'MECH', placed: 78,  rate: 41 },
  { branch: 'CIVIL',placed: 32,  rate: 32 },
];

const salaryDist = [
  { range: '4–6L',  count: 12 },
  { range: '6–8L',  count: 22 },
  { range: '8–10L', count: 28 },
  { range: '10–12L',count: 18 },
  { range: '12–15L',count: 10 },
  { range: '15+L',  count:  6 },
];

const recruiterEngagement = [
  { month: 'Jun', companies: 4,  shortlists: 48  },
  { month: 'Jul', companies: 8,  shortlists: 120 },
  { month: 'Aug', companies: 14, shortlists: 285 },
  { month: 'Sep', companies: 22, shortlists: 430 },
  { month: 'Oct', companies: 18, shortlists: 310 },
  { month: 'Nov', companies: 12, shortlists: 180 },
];

const skillOfferData = [
  { skill: 'Python', offers: 34, color: '#3B82F6' },
  { skill: 'React',  offers: 28, color: '#6366F1' },
  { skill: 'DSA',    offers: 26, color: '#06B6D4' },
  { skill: 'Java',   offers: 22, color: '#10B981' },
  { skill: 'SQL',    offers: 18, color: '#F59E0B' },
  { skill: 'ML',     offers: 14, color: '#F43F5E' },
  { skill: 'Node',   offers: 12, color: '#8B5CF6' },
  { skill: 'AWS',    offers:  8, color: '#EC4899' },
];

const funnelData = [
  { stage: 'Registered',  count: 1248, color: '#4E6380' },
  { stage: 'Eligible',    count: 892,  color: '#3B82F6' },
  { stage: 'Applied',     count: 634,  color: '#6366F1' },
  { stage: 'Shortlisted', count: 312,  color: '#8B5CF6' },
  { stage: 'Interview',   count: 180,  color: '#F59E0B' },
  { stage: 'Offer',       count: 96,   color: '#10B981' },
];

const atRisk = [
  { branch: 'CIVIL', count: 68, pct: 68, color: '#F43F5E' },
  { branch: 'MECH',  count: 59, pct: 31, color: '#F87171' },
  { branch: 'EEE',   count: 48, pct: 39, color: '#FB923C' },
  { branch: 'ECE',   count: 35, pct: 22, color: '#FBBF24' },
  { branch: 'IT',    count: 18, pct:  9, color: '#60A5FA' },
  { branch: 'CSE',   count: 24, pct:  8, color: '#34D399' },
];

const topRecruiterTrend = [
  { month: 'Jun', Infosys: 2,  TCS: 4,  Zoho: 1 },
  { month: 'Jul', Infosys: 5,  TCS: 8,  Zoho: 4 },
  { month: 'Aug', Infosys: 12, TCS: 18, Zoho: 9 },
  { month: 'Sep', Infosys: 22, TCS: 30, Zoho: 16 },
  { month: 'Oct', Infosys: 18, TCS: 24, Zoho: 12 },
];

/* ─── Tooltip ──────────────────────────────────── */
function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
      borderRadius: 10, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color || p.fill }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Chart Card ───────────────────────────────── */
function ChartCard({ title, subtitle, children, action }: {
  title: string; subtitle?: string; children: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div className="card analytics-chart-card">
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
        {action}
      </div>
      <div style={{ padding: '4px 20px 22px' }}>{children}</div>
    </div>
  );
}

/* ─── KPI Row ──────────────────────────────────── */
const analyticsKPIs = [
  { label: 'Total Placed',     value: '847',    delta: '+96 this season', color: '#10B981' },
  { label: 'Placement Rate',   value: '67.9%',  delta: '+4.2% vs last yr', color: '#3B82F6' },
  { label: 'Highest Package',  value: '₹28 LPA', delta: 'Asterion Tech',  color: '#8B5CF6' },
  { label: 'Avg Package',      value: '₹12.6L', delta: '+₹1.2L vs last yr', color: '#F59E0B' },
];

export function Analytics() {
  const [period, setPeriod] = useState<'season' | 'ytd' | 'all'>('season');
  const [apiAnalytics, setApiAnalytics] = useState<any | null>(null);
  useEffect(() => { apiClient<any>('/analytics').then(result => setApiAnalytics(result.data)).catch(() => setApiAnalytics(null)); }, []);
  const kpis = apiAnalytics?.overview ? [
    { label: 'Total Placed', value: String(apiAnalytics.overview.placedStudents), delta: `${apiAnalytics.overview.offerCount} offers`, color: '#10B981' },
    { label: 'Placement Rate', value: `${apiAnalytics.overview.placementRate}%`, delta: `${apiAnalytics.overview.totalStudents} students`, color: '#3B82F6' },
    { label: 'Highest Package', value: `₹${apiAnalytics.overview.highestPackage} LPA`, delta: 'Backend aggregate', color: '#8B5CF6' },
    { label: 'Avg Package', value: `₹${apiAnalytics.overview.averagePackage}L`, delta: `${apiAnalytics.overview.acceptedOfferCount} accepted`, color: '#F59E0B' },
  ] : analyticsKPIs;

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Placement Analytics</h1>
          <p className="page-subtitle">Conversion rates, salary trends, and skill-offer correlations</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="analytics-controls">
            <div className="tab-bar">
            {(['season', 'ytd', 'all'] as const).map(p => (
              <button key={p} className={`tab-item ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                {p === 'season' ? 'This Season' : p === 'ytd' ? 'YTD' : 'All Time'}
              </button>
            ))}
            </div>
          </div>
          <button className="btn btn-outline btn-sm"><Download size={14} /> Export</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="analytics-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} className="stat-card" style={{ '--accent-color': k.color } as React.CSSProperties}>
            <div className="stat-value num" style={{ color: k.color }}>{k.value}</div>
            <div className="stat-label" style={{ marginTop: 6 }}>{k.label}</div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Row 1: Branch conversion + Salary distribution */}
      <div className="analytics-row analytics-row-wide" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, marginBottom: 20 }}>
        <ChartCard title="Branch-wise Placement Rate" subtitle="Placed vs registered students per branch">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={branchConversion} barSize={28}>
              <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="branch" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="placed" name="Placed" radius={[6, 6, 0, 0]}>
                {branchConversion.map((e, i) => (
                  <Cell key={i} fill={e.rate >= 75 ? '#10B981' : e.rate >= 50 ? '#3B82F6' : '#F43F5E'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          {/* Rate legend */}
          <div style={{ display: 'flex', gap: 16, paddingTop: 8, paddingLeft: 4, flexWrap: 'wrap' }}>
            {[
              { label: '≥ 75% rate', color: '#10B981' },
              { label: '50–74%',     color: '#3B82F6' },
              { label: '< 50%',      color: '#F43F5E' },
            ].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{l.label}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Salary Distribution" subtitle="Offers by CTC range">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={salaryDist} layout="vertical" barSize={16}>
              <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="range" type="category" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={50} />
              <Tooltip content={<ChartTip />} />
              <Bar dataKey="count" name="Offers" fill="#6366F1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 2: Recruiter engagement + Skills */}
      <div className="analytics-row analytics-row-even" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <ChartCard title="Recruiter Engagement Trend" subtitle="Companies and shortlists per month">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={recruiterEngagement}>
              <defs>
                <linearGradient id="coGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="slGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="companies"  name="Companies"  stroke="#3B82F6" strokeWidth={2} fill="url(#coGrad)" dot={false} />
              <Area type="monotone" dataKey="shortlists" name="Shortlists" stroke="#10B981" strokeWidth={2} fill="url(#slGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Recruiter Trends" subtitle="Offers by top 3 companies">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={topRecruiterTrend}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="TCS"     stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4, fill: '#3B82F6' }} />
              <Line type="monotone" dataKey="Infosys" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 4, fill: '#6366F1' }} />
              <Line type="monotone" dataKey="Zoho"    stroke="#10B981" strokeWidth={2.5} dot={{ r: 4, fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Row 3: Funnel + At-risk + Skill-offer */}
      <div className="analytics-row analytics-row-triple" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {/* Drive-to-offer funnel */}
        <ChartCard title="Drive-to-Offer Funnel" subtitle="Conversion at each stage">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
            {funnelData.map((s, i) => {
              const pct = Math.round(s.count / funnelData[0].count * 100);
              return (
                <div key={s.stage}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{s.stage}</span>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{pct}%</span>
                      <span className="num" style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.count}</span>
                    </div>
                  </div>
                  <div className="progress-track" style={{ height: 7 }}>
                    <div className="progress-fill" style={{ width: `${pct}%`, background: s.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </ChartCard>

        {/* At-risk by branch */}
        <ChartCard title="At-Risk Students" subtitle="Unplaced + low readiness">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, paddingTop: 8 }}>
            {atRisk.map(r => (
              <div key={r.branch} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: '2px 8px', borderRadius: 5,
                  background: `${r.color}18`, color: r.color,
                  border: `1px solid ${r.color}28`,
                  minWidth: 48, textAlign: 'center',
                }}>
                  {r.branch}
                </span>
                <div className="progress-track" style={{ height: 7, flex: 1 }}>
                  <div className="progress-fill" style={{ width: `${r.pct}%`, background: r.color }} />
                </div>
                <span className="num" style={{ fontSize: 13, fontWeight: 700, color: r.color, minWidth: 24, textAlign: 'right' }}>
                  {r.count}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Skill-to-offer correlation */}
        <ChartCard title="Skill → Offer Correlation" subtitle="Most in-demand skills">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
            {skillOfferData.map(s => (
              <div key={s.skill} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>{s.skill}</span>
                <div className="progress-track" style={{ height: 6, width: 80 }}>
                  <div className="progress-fill" style={{ width: `${(s.offers / 34) * 100}%`, background: s.color }} />
                </div>
                <span className="num" style={{ fontSize: 13, fontWeight: 700, color: s.color, minWidth: 20, textAlign: 'right' }}>{s.offers}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
