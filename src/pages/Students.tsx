import { useState, useMemo, useEffect } from 'react';
import { Search, X, ChevronDown, Filter, ExternalLink, GraduationCap, BookOpen, Award } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis,
} from 'recharts';
import { students } from '@/data/students';
import { apiClient } from '@/services/apiClient';
import { drives } from '@/data/drives';
import type { Student, Branch } from '@/types';
import {
  readinessBandColor, readinessBandLabel, placementStatusColor,
  placementStatusLabel, scoreToColor, formatDate,
} from '@/lib/utils';

const branches: Branch[] = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIDS', 'AIML', 'CHEM'];
const bands = ['not-ready', 'developing', 'ready', 'highly-employable'] as const;
const statusOptions = ['unplaced', 'shortlisted', 'interviewing', 'offer-received', 'placed', 'opted-out'];

/* ─── Student Drawer ──────────────────────────────── */
function StudentDrawer({ student: initialStudent, onClose }: { student: Student; onClose: () => void }) {
  const [student, setStudent] = useState(initialStudent);
  useEffect(() => {
    setStudent(initialStudent);
    apiClient<Partial<Student>>(`/readiness/${initialStudent.id}`).then(result => setStudent(current => ({ ...current, ...result.data }))).catch(() => undefined);
  }, [initialStudent]);
  const radarData = student.skillScores.map(s => ({ skill: s.skill, score: s.score }));
  const eligibleDriveObjs = drives.filter(d => student.eligibleDrives.includes(d.id));

  return (
    <>
      {/* Overlay */}
      <div
        className="drawer-overlay"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Panel */}
      <div className="drawer-panel" style={{ width: 480 }}>
        {/* Header */}
        <div style={{
          padding: '22px 24px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'sticky', top: 0,
          background: 'var(--bg-elevated)',
          zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            {/* Avatar */}
            <div style={{
              width: 52, height: 52, borderRadius: 14, flexShrink: 0,
              background: `${readinessBandColor(student.readinessBand)}22`,
              border: `2px solid ${readinessBandColor(student.readinessBand)}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 800, color: readinessBandColor(student.readinessBand),
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              {student.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {student.name}
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 3 }}>
                {student.branch} · Class of {student.graduationYear} · {student.rollNumber}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                <span style={{
                  fontSize: 11.5, fontWeight: 600, padding: '3px 9px', borderRadius: 6,
                  background: `${readinessBandColor(student.readinessBand)}16`,
                  color: readinessBandColor(student.readinessBand),
                  border: `1px solid ${readinessBandColor(student.readinessBand)}30`,
                }}>
                  {readinessBandLabel(student.readinessBand)}
                </span>
                <span style={{
                  fontSize: 11.5, fontWeight: 600, padding: '3px 9px', borderRadius: 6,
                  background: `${placementStatusColor(student.placementStatus)}16`,
                  color: placementStatusColor(student.placementStatus),
                  border: `1px solid ${placementStatusColor(student.placementStatus)}30`,
                }}>
                  {placementStatusLabel(student.placementStatus)}
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: scoreToColor(student.readinessScore), lineHeight: 1, fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="num">
                {student.readinessScore}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>Readiness</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 18, right: 18,
              width: 30, height: 30, borderRadius: 8, border: 'none',
              background: 'var(--bg-hover)', color: 'var(--text-tertiary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s',
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>

          {/* Quick stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
            {[
              { label: 'CGPA', value: student.cgpa.toFixed(1), color: '#60A5FA' },
              { label: 'Active BL', value: String(student.backlogsActive), color: student.backlogsActive > 0 ? '#F43F5E' : '#10B981' },
              { label: 'Hist. BL', value: String(student.backlogsHistorical), color: student.backlogsHistorical > 0 ? '#F59E0B' : '#10B981' },
              { label: 'Interviews', value: String(student.mockInterviews.length), color: '#6366F1' },
            ].map(stat => (
              <div
                key={stat.label}
                style={{
                  background: `${stat.color}10`,
                  border: `1px solid ${stat.color}25`,
                  borderRadius: 10, padding: '12px 8px', textAlign: 'center',
                }}
              >
                <div className="num" style={{ fontSize: 22, fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)', marginTop: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Skills radar */}
          <div>
            <div className="section-title">Skill Radar</div>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '16px 12px' }}>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData} cx="50%" cy="50%">
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10.5, fill: 'var(--text-tertiary)' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar dataKey="score" stroke="#6366F1" strokeWidth={2} fill="#6366F1" fillOpacity={0.15} dot={{ fill: '#6366F1', r: 3 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Readiness breakdown */}
          <div>
            <div className="section-title">Readiness Breakdown</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'DSA & Problem Solving', score: student.skillScores.find(s => s.skill === 'DSA')?.score ?? 50 },
                { label: 'Technical Depth', score: Math.round(student.skillScores.reduce((a, s) => a + s.score, 0) / student.skillScores.length) },
                { label: 'Mock Interview Avg', score: Math.round(student.mockInterviews.reduce((a, m) => a + m.score * 10, 0) / Math.max(1, student.mockInterviews.length)) },
                { label: 'Certifications & Projects', score: Math.min(100, student.certifications.length * 20 + student.projects.length * 15) },
                { label: 'Academic Standing', score: Math.round((student.cgpa / 10) * 100 - student.backlogsActive * 20) },
              ].map(item => {
                const c = scoreToColor(item.score);
                return (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.label}</span>
                      <span className="num" style={{ fontSize: 13, fontWeight: 700, color: c }}>{item.score}</span>
                    </div>
                    <div className="progress-track" style={{ height: 6 }}>
                      <div className="progress-fill" style={{ width: `${item.score}%`, background: c }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risk flags */}
          {student.riskFlags.length > 0 && (
            <div>
              <div className="section-title" style={{ color: '#F87171' }}>Risk Flags</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {student.riskFlags.map(flag => (
                  <div
                    key={flag}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 14px',
                      background: 'rgba(244,63,94,0.07)',
                      border: '1px solid rgba(244,63,94,0.18)',
                      borderRadius: 9,
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F43F5E', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: '#F87171' }}>{flag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended actions */}
          <div>
            <div className="section-title">Recommended Actions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {student.recommendedActions.map(action => (
                <div
                  key={action}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 14px',
                    background: 'rgba(59,130,246,0.07)',
                    border: '1px solid rgba(59,130,246,0.16)',
                    borderRadius: 9,
                  }}
                >
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-blue)', flexShrink: 0, marginTop: 4 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Eligible drives */}
          {eligibleDriveObjs.length > 0 && (
            <div>
              <div className="section-title">Eligible Drives</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {eligibleDriveObjs.slice(0, 4).map(d => (
                  <div
                    key={d.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 14px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 10,
                    }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: `${d.companyColor}18`,
                      border: `1px solid ${d.companyColor}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800, color: d.companyColor,
                    }}>
                      {d.companyInitials}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{d.companyName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{d.date}</div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 5,
                      background: d.status === 'live' ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.10)',
                      color: d.status === 'live' ? '#6EE7B7' : '#A5B4FC',
                      border: `1px solid ${d.status === 'live' ? 'rgba(16,185,129,0.22)' : 'rgba(99,102,241,0.20)'}`,
                    }}>
                      {d.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

/* ─── Main Page ───────────────────────────────────── */
export function Students() {
  const [apiStudents, setApiStudents] = useState<Student[] | null>(null);
  useEffect(() => { apiClient<Student[]>('/students').then(result => setApiStudents(result.data)).catch(() => setApiStudents(null)); }, []);
  const studentSource = apiStudents?.length ? apiStudents : students;
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState<Branch | ''>('');
  const [bandFilter, setBandFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortKey, setSortKey] = useState<'name' | 'cgpa' | 'readinessScore'>('readinessScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);

  const filtered = useMemo(() => {
    let arr = [...studentSource];
    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.branch.toLowerCase().includes(q) ||
        s.skills.some(sk => sk.toLowerCase().includes(q))
      );
    }
    if (branchFilter) arr = arr.filter(s => s.branch === branchFilter);
    if (bandFilter) arr = arr.filter(s => s.readinessBand === bandFilter);
    if (statusFilter) arr = arr.filter(s => s.placementStatus === statusFilter);
    arr.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return sortAsc
        ? (av < bv ? -1 : av > bv ? 1 : 0)
        : (av > bv ? -1 : av < bv ? 1 : 0);
    });
    return arr;
  }, [studentSource, search, branchFilter, bandFilter, statusFilter, sortKey, sortAsc]);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const hasFilters = branchFilter || bandFilter || statusFilter;

  return (
    <div className="students-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Students Directory</h1>
          <p className="page-subtitle">
            {filtered.length} of {students.length} students · manage profiles, track readiness
          </p>
        </div>
        <button className="btn btn-primary btn-sm">
          <GraduationCap size={14} /> Export Report
        </button>
      </div>

      {/* Search & Filters bar */}
      <div className="students-toolbar" style={{
        display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
        marginBottom: 22, padding: '16px 20px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-default)',
        borderRadius: 14,
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-disabled)', pointerEvents: 'none' }} />
          <input
            className="input-base"
            style={{ paddingLeft: 38, height: 40 }}
            placeholder="Search by name, roll, branch, skills…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Branch */}
        <div style={{ position: 'relative' }}>
          <select
            className="input-base"
            style={{ height: 40, paddingRight: 32, appearance: 'none', cursor: 'pointer', minWidth: 120, fontSize: 13 }}
            value={branchFilter}
            onChange={e => setBranchFilter(e.target.value as Branch | '')}
          >
            <option value="">All Branches</option>
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)' }} />
        </div>

        {/* Readiness Band */}
        <div style={{ position: 'relative' }}>
          <select
            className="input-base"
            style={{ height: 40, paddingRight: 32, appearance: 'none', cursor: 'pointer', minWidth: 150, fontSize: 13 }}
            value={bandFilter}
            onChange={e => setBandFilter(e.target.value)}
          >
            <option value="">All Readiness</option>
            {bands.map(b => <option key={b} value={b}>{readinessBandLabel(b)}</option>)}
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)' }} />
        </div>

        {/* Status */}
        <div style={{ position: 'relative' }}>
          <select
            className="input-base"
            style={{ height: 40, paddingRight: 32, appearance: 'none', cursor: 'pointer', minWidth: 140, fontSize: 13 }}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            {statusOptions.map(s => <option key={s} value={s}>{s.replace('-', ' ')}</option>)}
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-tertiary)' }} />
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => { setBranchFilter(''); setBandFilter(''); setStatusFilter(''); }}
          >
            <X size={13} /> Clear
          </button>
        )}
      </div>

      {/* Band summary chips */}
      <div className="students-band-summary" style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        {bands.map(b => {
          const count = students.filter(s => s.readinessBand === b).length;
          const color = readinessBandColor(b);
          const isActive = bandFilter === b;
          return (
            <button
              key={b}
              onClick={() => setBandFilter(isActive ? '' : b)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 14px',
                borderRadius: 9,
                background: isActive ? `${color}16` : 'var(--bg-card)',
                border: `1px solid ${isActive ? `${color}35` : 'var(--border-default)'}`,
                color: isActive ? color : 'var(--text-tertiary)',
                fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
              {readinessBandLabel(b)}
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 5,
                background: isActive ? `${color}25` : 'rgba(255,255,255,0.07)',
                color: isActive ? color : 'var(--text-tertiary)',
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="card students-table-card" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 800 }}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Branch</th>
                <th
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => toggleSort('cgpa')}
                >
                  CGPA {sortKey === 'cgpa' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th>Readiness Band</th>
                <th
                  style={{ textAlign: 'right', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => toggleSort('readinessScore')}
                >
                  Score {sortKey === 'readinessScore' ? (sortAsc ? '↑' : '↓') : ''}
                </th>
                <th>Skills</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <GraduationCap size={36} style={{ opacity: 0.3 }} />
                      <div style={{ fontSize: 14, fontWeight: 600 }}>No students match the current filters</div>
                      <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Try adjusting your search or filters</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(s => {
                const bandColor = readinessBandColor(s.readinessBand);
                const statColor = placementStatusColor(s.placementStatus);
                return (
                  <tr
                    key={s.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelected(s)}
                  >
                    {/* Name */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                          background: `${bandColor}18`,
                          border: `1.5px solid ${bandColor}30`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 12, fontWeight: 800, color: bandColor,
                        }}>
                          {s.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{s.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{s.rollNumber}</div>
                        </div>
                      </div>
                    </td>

                    {/* Branch */}
                    <td>
                      <span style={{
                        fontSize: 12, fontWeight: 600, padding: '3px 8px', borderRadius: 5,
                        background: 'rgba(99,102,241,0.10)',
                        color: '#A5B4FC',
                        border: '1px solid rgba(99,102,241,0.18)',
                      }}>{s.branch}</span>
                    </td>

                    {/* CGPA */}
                    <td>
                      <span className="num" style={{
                        fontSize: 14, fontWeight: 700,
                        color: s.cgpa >= 8 ? '#10B981' : s.cgpa >= 6.5 ? '#60A5FA' : '#F59E0B',
                      }}>
                        {s.cgpa.toFixed(1)}
                      </span>
                    </td>

                    {/* Band */}
                    <td>
                      <span style={{
                        fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                        background: `${bandColor}14`,
                        color: bandColor,
                        border: `1px solid ${bandColor}28`,
                      }}>
                        {readinessBandLabel(s.readinessBand)}
                      </span>
                    </td>

                    {/* Score */}
                    <td style={{ textAlign: 'right' }}>
                      <span className="num" style={{ fontSize: 17, fontWeight: 800, color: scoreToColor(s.readinessScore) }}>
                        {s.readinessScore}
                      </span>
                    </td>

                    {/* Skills */}
                    <td>
                      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                        {s.skills.slice(0, 3).map(sk => (
                          <span key={sk} className="tag">{sk}</span>
                        ))}
                        {s.skills.length > 3 && (
                          <span className="tag">+{s.skills.length - 3}</span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td>
                      <span style={{
                        fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                        background: `${statColor}14`,
                        color: statColor,
                        border: `1px solid ${statColor}28`,
                      }}>
                        {placementStatusLabel(s.placementStatus)}
                      </span>
                    </td>

                    {/* Arrow */}
                    <td>
                      <ExternalLink size={14} style={{ color: 'var(--text-tertiary)' }} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer */}
      {selected && <StudentDrawer student={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
