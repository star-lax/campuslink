import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLPA(value: number): string {
  if (value >= 100) return `₹${(value / 100).toFixed(1)}Cr PA`;
  return `₹${value.toFixed(1)} LPA`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatRelative(iso: string): string {
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'JUST NOW';
  if (diffMins < 60) return `${diffMins}M AGO`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}H AGO`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}D AGO`;
  return formatDate(iso).toUpperCase();
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function readinessBandLabel(band: string): string {
  const map: Record<string, string> = {
    'not-ready': 'Not Ready',
    developing: 'Developing',
    ready: 'Ready',
    'highly-employable': 'Highly Employable',
  };
  return map[band] ?? band;
}

export function readinessBandColor(band: string): string {
  const map: Record<string, string> = {
    'not-ready': '#C84B31',
    developing: '#555555',
    ready: '#111111',
    'highly-employable': '#111111',
  };
  return map[band] ?? '#111111';
}

export function placementStatusLabel(status: string): string {
  const map: Record<string, string> = {
    unplaced: 'Unplaced',
    shortlisted: 'Shortlisted',
    interviewing: 'Interviewing',
    'offer-received': 'Offer Received',
    placed: 'Placed',
    'opted-out': 'Opted Out',
  };
  return map[status] ?? status;
}

export function placementStatusColor(status: string): string {
  const map: Record<string, string> = {
    unplaced: '#666666',
    shortlisted: '#111111',
    interviewing: '#111111',
    'offer-received': '#111111',
    placed: '#111111',
    'opted-out': '#888888',
  };
  return map[status] ?? '#111111';
}

export function offerStageLabel(stage: string): string {
  const map: Record<string, string> = {
    draft: 'Draft',
    sent: 'Sent',
    accepted: 'Accepted',
    'joining-pending': 'Joining Pending',
    joined: 'Joined',
    revoked: 'Revoked',
  };
  return map[stage] ?? stage;
}

export function offerStageColor(stage: string): string {
  const map: Record<string, string> = {
    draft: '#666666',
    sent: '#111111',
    accepted: '#111111',
    'joining-pending': '#C84B31',
    joined: '#111111',
    revoked: '#C84B31',
  };
  return map[stage] ?? '#111111';
}

export function docStatusColor(s: string): string {
  const m: Record<string, string> = {
    pending: '#666666',
    uploaded: '#111111',
    verified: '#111111',
    rejected: '#C84B31',
  };
  return m[s] ?? '#111111';
}

export function conflictSeverityColor(s: string): string {
  return s === 'critical' ? '#C84B31' : '#111111';
}

export function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}

export function scoreToColor(score: number): string {
  if (score >= 80) return '#111111';
  if (score >= 60) return '#333333';
  if (score >= 40) return '#666666';
  return '#C84B31';
}
