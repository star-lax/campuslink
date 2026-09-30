// ─── Student domain ───────────────────────────────────────────────────────────

export type ReadinessBand =
  | 'not-ready'
  | 'developing'
  | 'ready'
  | 'highly-employable';

export type PlacementStatus =
  | 'unplaced'
  | 'shortlisted'
  | 'interviewing'
  | 'offer-received'
  | 'placed'
  | 'opted-out';

export interface SkillScore {
  skill: string;
  score: number; // 0–100
}

export interface MockInterviewRecord {
  round: string;
  date: string;
  score: number; // 0–10
  feedback: string;
}

export interface Student {
  id: string;
  name: string;
  avatar?: string; // initials fallback
  branch: Branch;
  graduationYear: number;
  cgpa: number;
  backlogsActive: number;
  backlogsHistorical: number;
  skills: string[];
  skillScores: SkillScore[];
  targetRoles: string[];
  readinessScore: number; // 0–100
  readinessBand: ReadinessBand;
  placementStatus: PlacementStatus;
  email: string;
  phone: string;
  resumeUrl?: string;
  certifications: string[];
  projects: string[];
  mockInterviews: MockInterviewRecord[];
  riskFlags: string[];
  recommendedActions: string[];
  eligibleDrives: string[];
  offerIds: string[];
  location: string;
}

// ─── Branch ───────────────────────────────────────────────────────────────────

export type Branch =
  | 'CSE'
  | 'IT'
  | 'ECE'
  | 'EEE'
  | 'MECH'
  | 'CIVIL'
  | 'AIDS'
  | 'AIML'
  | 'CHEM';

// ─── Recruiter / JD domain ────────────────────────────────────────────────────

export type RecruiterStatus = 'active' | 'paused' | 'completed' | 'upcoming';

export interface JobDescription {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  companyInitials: string;
  companyColor: string;
  role: string;
  ctcMin: number; // in LPA
  ctcMax: number;
  jobType: 'Full-time' | 'Internship' | 'PPO';
  requiredSkills: string[];
  preferredSkills: string[];
  minCGPA: number;
  eligibleBranches: Branch[];
  graduationYears: number[];
  noBacklogsRequired: boolean;
  openRoles: number;
  shortlistedCount: number;
  responseRate: number; // 0–100 %
  status: RecruiterStatus;
  driveId?: string;
  location: string;
  jdSummary: string;
}

// ─── Match domain ─────────────────────────────────────────────────────────────

export interface MatchScore {
  studentId: string;
  jobId: string;
  totalScore: number; // 0–100
  skillOverlap: number; // 0–100
  cgpaScore: number; // 0–100
  interviewScore: number; // 0–100
  eligibilityScore: number; // 0–100
  matchedSkills: string[];
  missingSkills: string[];
  eligibilityStatus: 'eligible' | 'conditional' | 'ineligible';
  shortlisted: boolean;
  strongFitReasons: string[];
  weaknessReasons: string[];
  recommendation: 'shortlist' | 'review' | 'reject';
}

// ─── Drive / Calendar domain ──────────────────────────────────────────────────

export type DriveStatus = 'scheduled' | 'live' | 'completed' | 'cancelled' | 'rescheduling';
export type ConflictType = 'venue-double-booking' | 'recruiter-overlap' | 'student-overlap' | 'time-gap-too-short';
export type ConflictSeverity = 'critical' | 'warning' | 'info';

export interface DriveSlot {
  start: string; // ISO
  end: string;
  activity: string;
  venue: string;
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  companyInitials: string;
  companyColor: string;
  jobIds: string[];
  date: string; // YYYY-MM-DD
  slots: DriveSlot[];
  venue: string;
  registeredStudents: number;
  shortlistedStudents: number;
  status: DriveStatus;
  coordinators: string[];
}

export interface ConflictItem {
  id: string;
  type: ConflictType;
  severity: ConflictSeverity;
  driveIds: string[];
  description: string;
  cause: string;
  suggestedResolution: string;
  resolved: boolean;
}

// ─── Offer domain ─────────────────────────────────────────────────────────────

export type OfferStage =
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'joining-pending'
  | 'joined'
  | 'revoked';

export type DocStatus = 'pending' | 'uploaded' | 'verified' | 'rejected';

export interface OfferDocument {
  name: string;
  status: DocStatus;
  uploadedAt?: string;
  dueDate: string;
}

export interface Offer {
  id: string;
  studentId: string;
  studentName: string;
  studentBranch: Branch;
  companyName: string;
  companyInitials: string;
  companyColor: string;
  role: string;
  ctcLPA: number;
  fixedComponent: number;
  variableComponent: number;
  signingBonus?: number;
  relocationAllowance?: number;
  offerDate: string;
  acceptanceDeadline: string;
  joiningDate: string;
  location: string;
  stage: OfferStage;
  documents: OfferDocument[];
  offerLetterUrl?: string;
  notes: string;
}

// ─── Notification domain ──────────────────────────────────────────────────────

export type NotificationCategory = 'student' | 'recruiter' | 'system';
export type NotificationPriority = 'high' | 'medium' | 'low';

export interface Notification {
  id: string;
  title: string;
  body: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionTarget?: string;
  recipientIds?: string[];
}

// ─── App / UI ─────────────────────────────────────────────────────────────────

export type AppRole = 'admin' | 'recruiter' | 'student';

export interface AppState {
  role: AppRole;
  selectedCampus: string;
  dateRange: { from: string; to: string };
}
