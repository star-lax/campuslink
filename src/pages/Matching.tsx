import { useState } from 'react';
import { CheckSquare, Square, Star, AlertTriangle, ChevronRight } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';
import { jobs } from '@/data/jobs';
import { students } from '@/data/students';
import { matchScores, getMatchesForJob } from '@/data/matches';

/* ─── Score ring ────────────────────────────────── */
function ScoreRing({ score }: { score: number }) {
  const r = 22, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#10B981' : score >= 65 ? '#60A5FA' : score >= 50 ? '#F59E0B' : '#F43F5E';
  return (
    <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
      <svg width={60} height={60} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={30} cy={30} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={5} />
        <circle
          cx={30} cy={30} r={r} fill="none"
          stroke={color} strokeWidth={5}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 800, color, fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}>
        {score}
      </div>
    </div>
  );
}

export function Matching() {
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id ?? '');
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  const selectedJob = jobs.find(j => j.id === selectedJobId) ?? jobs[0];
  const matches = getMatchesForJob(selectedJobId)
    .map(m => ({ ...m, student: students.find(s => s.id === m.studentId) }))
    .filter(m => m.student)
    .sort((a, b) => b.overallScore - a.overallScore);

  const selectedCandidate = selectedCandidateId
    ? matches.find(m => m.studentId === selectedCandidateId)
    : null;

  const toggleShortlist = (id: string) => {
    setShortlisted(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Matching Studio</h1>
          <p className="page-subtitle">AI-powered candidate–role fit analysis with explainable scoring</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-outline btn-sm">
            <Star size={14} /> {shortlisted.size} Shortlisted
          </button>
          <button className="btn btn-primary btn-sm">Send to Recruiter</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 380px', gap: 20, minHeight: 600 }}>

        {/* ── JD List ─────────────────── */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div className="card-header" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="card-title">Job Descriptions</div>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{jobs.length} roles</span>
          </div>
          <div style={{ overflowY: 'auto' }}>
            {jobs.map(job => {
              const isActive = job.id === selectedJobId;
              return (
                <button
                  key={job.id}
                  onClick={() => { setSelectedJobId(job.id); setSelectedCandidateId(null); }}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '14px 20px',
                    background: isActive ? `${job.companyColor}10` : 'transparent',
                    borderLeft: isActive ? `3px solid ${job.companyColor}` : '3px solid transparent',
                    borderTop: 'none', borderRight: 'none', borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: `${job.companyColor}20`, border: `1px solid ${job.companyColor}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, fontWeight: 800, color: job.companyColor,
                    }}>
                      {job.companyInitials}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.companyName}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 40 }}>
                    {job.role}
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6, paddingLeft: 40, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>≥{job.cgpaCutoff} CGPA</span>
                    <span style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>· {job.openRoles} roles</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Candidates ──────────────── */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {selectedJob && (
            <>
              <div className="card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                      background: `${selectedJob.companyColor}20`, border: `1px solid ${selectedJob.companyColor}30`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 800, color: selectedJob.companyColor,
                    }}>
                      {selectedJob.companyInitials}
                    </div>
                    <div>
                      <div className="card-title">{selectedJob.companyName} · {selectedJob.role}</div>
                      <div className="card-subtitle">≥{selectedJob.cgpaCutoff} CGPA · {selectedJob.openRoles} open roles · {selectedJob.ctcRange}</div>
                    </div>
                  </div>
                </div>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
                  background: 'rgba(16,185,129,0.12)', color: '#6EE7B7',
                  border: '1px solid rgba(16,185,129,0.22)',
                }}>
                  {matches.length} candidates
                </span>
              </div>
              <div style={{ overflowY: 'auto', maxHeight: 560 }}>
                {matches.map((m, i) => {
                  const s = m.student!;
                  const isShortlisted = shortlisted.has(m.studentId);
                  const isSelected = selectedCandidateId === m.studentId;
                  return (
                    <div
                      key={m.studentId}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 14,
                        padding: '14px 20px',
                        borderBottom: '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(99,102,241,0.07)' : 'transparent',
                        transition: 'background 0.15s', cursor: 'pointer',
                        borderLeft: isSelected ? '3px solid #6366F1' : '3px solid transparent',
                      }}
                      onClick={() => setSelectedCandidateId(isSelected ? null : m.studentId)}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)'; }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                    >
                      {/* Rank */}
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-disabled)', width: 20, textAlign: 'center', flexShrink: 0 }}>
                        {i + 1}
                      </div>

                      {/* Score ring */}
                      <ScoreRing score={m.overallScore} />

                      {/* Name info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>{s.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>
                          {s.branch} · CGPA {s.cgpa.toFixed(1)} · Score {s.readinessScore}
                        </div>
                        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                          {s.skills.slice(0, 3).map(sk => (
                            <span key={sk} className="tag">{sk}</span>
                          ))}
                        </div>
                      </div>

                      {/* Shortlist */}
                      <button
                        onClick={e => { e.stopPropagation(); toggleShortlist(m.studentId); }}
                        style={{
                          width: 32, height: 32, borderRadius: 8, border: 'none',
                          background: isShortlisted ? 'rgba(245,158,11,0.15)' : 'var(--bg-hover)',
                          color: isShortlisted ? '#F59E0B' : 'var(--text-tertiary)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transition: 'all 0.15s', flexShrink: 0,
                        }}
                        aria-label={isShortlisted ? 'Remove from shortlist' : 'Add to shortlist'}
                      >
                        {isShortlisted ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ── Explainer Panel ──────────── */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {selectedCandidate && selectedCandidate.student ? (
            <>
              <div className="card-header">
                <div className="card-title">Match Breakdown</div>
                <ScoreRing score={selectedCandidate.overallScore} />
              </div>
              <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto' }}>
                {/* Student brief */}
                <div style={{
                  padding: '14px 16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {selectedCandidate.student.name}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>
                    {selectedCandidate.student.branch} · CGPA {selectedCandidate.student.cgpa.toFixed(1)}
                  </div>
                </div>

                {/* Criteria scores */}
                <div>
                  <div className="section-title">Score Criteria</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Object.entries(selectedCandidate.criteriaScores).map(([key, val]) => {
                      const color = val >= 80 ? '#10B981' : val >= 60 ? '#60A5FA' : val >= 40 ? '#F59E0B' : '#F43F5E';
                      return (
                        <div key={key}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                              {key.replace(/([A-Z])/g, ' $1')}
                            </span>
                            <span className="num" style={{ fontSize: 13, fontWeight: 700, color }}>{val}</span>
                          </div>
                          <div className="progress-track" style={{ height: 6 }}>
                            <div className="progress-fill" style={{ width: `${val}%`, background: color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Skill radar */}
                <div>
                  <div className="section-title">Skill Radar</div>
                  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '8px 4px' }}>
                    <ResponsiveContainer width="100%" height={160}>
                      <RadarChart data={selectedCandidate.student.skillScores.map(s => ({ skill: s.skill, score: s.score }))}>
                        <PolarGrid stroke="rgba(255,255,255,0.06)" />
                        <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: 'var(--text-tertiary)' }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar dataKey="score" stroke="#6366F1" fill="#6366F1" fillOpacity={0.15} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Risk flags */}
                {selectedCandidate.redFlags.length > 0 && (
                  <div>
                    <div className="section-title" style={{ color: '#F87171' }}>Risk Flags</div>
                    {selectedCandidate.redFlags.map(flag => (
                      <div key={flag} style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '9px 12px', marginBottom: 6,
                        background: 'rgba(244,63,94,0.07)',
                        border: '1px solid rgba(244,63,94,0.18)', borderRadius: 8,
                        fontSize: 13, color: '#F87171',
                      }}>
                        <AlertTriangle size={13} />
                        {flag}
                      </div>
                    ))}
                  </div>
                )}

                {/* Shortlist button */}
                <button
                  className={`btn ${shortlisted.has(selectedCandidate.studentId) ? 'btn-outline' : 'btn-primary'}`}
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => toggleShortlist(selectedCandidate.studentId)}
                >
                  {shortlisted.has(selectedCandidate.studentId) ? (
                    <><CheckSquare size={15} /> Remove from Shortlist</>
                  ) : (
                    <><Star size={15} /> Add to Shortlist</>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ height: '100%' }}>
              <ChevronRight size={36} style={{ opacity: 0.2 }} />
              <div style={{ fontSize: 14, fontWeight: 600 }}>Select a candidate</div>
              <div style={{ fontSize: 13 }}>Click any row to see the match breakdown</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
