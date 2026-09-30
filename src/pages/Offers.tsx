import { useState } from 'react';
import { FileText, CheckCircle2, Clock, XCircle, AlertTriangle, Download, ChevronDown } from 'lucide-react';
import { offers } from '@/data/offers';
import { offerStageColor, offerStageLabel, formatDate } from '@/lib/utils';

type Stage = 'all' | 'draft' | 'sent' | 'accepted' | 'joining-pending' | 'joined' | 'revoked';

const stages: Stage[] = ['all', 'draft', 'sent', 'accepted', 'joining-pending', 'joined', 'revoked'];

const stageIcon = (stage: string) => {
  if (stage === 'accepted' || stage === 'joined') return <CheckCircle2 size={13} />;
  if (stage === 'revoked')                        return <XCircle size={13} />;
  if (stage === 'joining-pending')                return <Clock size={13} />;
  if (stage === 'sent')                           return <AlertTriangle size={13} />;
  return <FileText size={13} />;
};

export function Offers() {
  const [stageFilter, setStageFilter] = useState<Stage>('all');
  const [selected, setSelected] = useState(offers[0] ?? null);

  const filtered = stageFilter === 'all'
    ? offers
    : offers.filter(o => o.stage === stageFilter);

  const stageCounts = Object.fromEntries(
    stages.map(s => [s, s === 'all' ? offers.length : offers.filter(o => o.stage === s).length])
  );

  const kpis = [
    { label: 'Total Offers',   value: offers.length,                           color: '#3B82F6' },
    { label: 'Accepted',       value: offers.filter(o=>o.stage==='accepted').length, color: '#10B981' },
    { label: 'Pending',        value: offers.filter(o=>['draft','sent','joining-pending'].includes(o.stage)).length, color: '#F59E0B' },
    { label: 'Revoked',        value: offers.filter(o=>o.stage==='revoked').length, color: '#F43F5E' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Offer Tracker</h1>
          <p className="page-subtitle">Manage placement offers, documentation, and joining status</p>
        </div>
        <button className="btn btn-outline btn-sm"><Download size={14} /> Export CSV</button>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} className="stat-card" style={{ '--accent-color': k.color } as React.CSSProperties}>
            <div className="stat-value num" style={{ color: k.color }}>{k.value}</div>
            <div className="stat-label">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Stage filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {stages.map(s => {
          const isActive = stageFilter === s;
          const color = s === 'all' ? '#4E6380' : offerStageColor(s);
          return (
            <button
              key={s}
              onClick={() => setStageFilter(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '7px 14px', borderRadius: 9,
                background: isActive ? `${color}16` : 'var(--bg-card)',
                border: `1px solid ${isActive ? `${color}35` : 'var(--border-default)'}`,
                color: isActive ? color : 'var(--text-tertiary)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {offerStageLabel(s === 'all' ? 'draft' : s) === 'Draft' && s === 'all' ? 'All Stages' : offerStageLabel(s === 'all' ? '' : s) || 'All Stages'}
              {s === 'all' ? 'All' : offerStageLabel(s)}
              {stageCounts[s] > 0 && (
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 5,
                  background: isActive ? `${color}25` : 'rgba(255,255,255,0.07)',
                  color: isActive ? color : 'var(--text-tertiary)',
                }}>
                  {stageCounts[s]}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 20 }}>

        {/* ── Offers table ─────────────── */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: 620 }}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Company / Role</th>
                  <th style={{ textAlign: 'right' }}>CTC</th>
                  <th>Stage</th>
                  <th>Issued</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state"><FileText size={32} style={{ opacity: 0.2 }} /><div>No offers in this stage</div></div>
                    </td>
                  </tr>
                ) : filtered.map(offer => {
                  const isSelected = selected?.id === offer.id;
                  const color = offerStageColor(offer.stage);
                  return (
                    <tr
                      key={offer.id}
                      onClick={() => setSelected(offer)}
                      style={{ cursor: 'pointer', background: isSelected ? 'rgba(99,102,241,0.07)' : undefined }}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                            background: `${color}18`, border: `1px solid ${color}28`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700, color,
                          }}>
                            {offer.studentName.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{offer.studentName}</div>
                            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{offer.branch} · {offer.rollNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{offer.companyName}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-tertiary)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{offer.role}</div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="num" style={{ fontSize: 14, fontWeight: 800, color: '#10B981' }}>₹{offer.ctc} LPA</span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 6,
                          background: `${color}14`, color, border: `1px solid ${color}28`,
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                        }}>
                          {stageIcon(offer.stage)} {offerStageLabel(offer.stage)}
                        </span>
                      </td>
                      <td style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>{formatDate(offer.issuedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Offer detail ─────────────── */}
        {selected ? (
          <div className="card" style={{ overflow: 'hidden' }}>
            {/* Header stripe */}
            <div style={{ height: 4, background: offerStageColor(selected.stage) }} />
            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 22, overflowY: 'auto' }}>

              {/* Company + student */}
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.3px', fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: 2 }}>
                  {selected.companyName}
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginBottom: 12 }}>{selected.role}</div>
                <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>For: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selected.studentName}</span></div>
              </div>

              {/* CTC breakdown */}
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.16)', borderRadius: 12, padding: '16px 18px' }}>
                <div className="section-title" style={{ color: '#6EE7B7', marginBottom: 14 }}>CTC Breakdown</div>
                {[
                  { label: 'Base Salary',    value: `₹${(selected.ctc * 0.7).toFixed(1)} LPA` },
                  { label: 'Variable Pay',   value: `₹${(selected.ctc * 0.15).toFixed(1)} LPA` },
                  { label: 'Joining Bonus',  value: `₹${(selected.ctc * 0.1).toFixed(1)} LPA` },
                  { label: 'Stock/ESOPs',    value: `₹${(selected.ctc * 0.05).toFixed(1)} LPA` },
                ].map(row => (
                  <div className="info-row" key={row.label}>
                    <span className="info-key">{row.label}</span>
                    <span className="info-value">{row.value}</span>
                  </div>
                ))}
                <div style={{ paddingTop: 12, borderTop: '1px solid rgba(16,185,129,0.16)', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#6EE7B7' }}>Gross CTC</span>
                  <span className="num" style={{ fontSize: 20, fontWeight: 900, color: '#10B981' }}>₹{selected.ctc} LPA</span>
                </div>
              </div>

              {/* Stage + dates */}
              <div>
                <div className="section-title">Timeline</div>
                {[
                  { label: 'Offer Issued',  value: formatDate(selected.issuedAt) },
                  { label: 'Deadline',      value: formatDate(selected.deadline) },
                  { label: 'Joining Date',  value: formatDate(selected.joiningDate) },
                  { label: 'Current Stage', value: offerStageLabel(selected.stage) },
                ].map(row => (
                  <div className="info-row" key={row.label}>
                    <span className="info-key">{row.label}</span>
                    <span className="info-value" style={{ color: row.label === 'Current Stage' ? offerStageColor(selected.stage) : 'var(--text-primary)' }}>{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Documents */}
              <div>
                <div className="section-title">Documentation</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selected.documents.map((doc: { name: string; status: string }) => {
                    const docColor = doc.status === 'verified' ? '#10B981' : doc.status === 'uploaded' ? '#60A5FA' : doc.status === 'rejected' ? '#F43F5E' : '#4E6380';
                    return (
                      <div
                        key={doc.name}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          padding: '10px 14px',
                          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                          borderRadius: 10,
                        }}
                      >
                        <FileText size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 13, color: 'var(--text-secondary)' }}>{doc.name}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 5,
                          background: `${docColor}16`, color: docColor, border: `1px solid ${docColor}28`,
                        }}>
                          {doc.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="empty-state"><FileText size={36} style={{ opacity: 0.2 }} /><div>Select an offer to view details</div></div>
          </div>
        )}
      </div>
    </div>
  );
}
