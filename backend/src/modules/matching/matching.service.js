import { getMatchingInputs } from './matching.repository.js';

const normalize = value => value.toLowerCase().replace(/[.\-_]/g, '').replace(/\s+/g, '');

function calculateMatch(student, job) {
  const skills = new Map(student.skills.map(skill => [normalize(skill), skill]));
  const required = job.requiredSkills || [];
  const preferred = job.preferredSkills || [];
  const matchedRequired = required.filter(skill => skills.has(normalize(skill)));
  const matchedPreferred = preferred.filter(skill => skills.has(normalize(skill)));
  const allRequirements = [...required, ...preferred];
  const matchedSkills = [...matchedRequired, ...matchedPreferred];
  const missingSkills = allRequirements.filter(skill => !skills.has(normalize(skill)));
  const skillOverlapScore = allRequirements.length ? Math.round((matchedSkills.length / allRequirements.length) * 100) : 0;
  const cgpaScore = Math.min(100, Math.round((student.cgpa / 10) * 100));
  const interviewScore = student.mockInterviews.length ? Math.round(student.mockInterviews.reduce((sum, interview) => sum + interview.score * 10, 0) / student.mockInterviews.length) : 0;
  const reasons = [];
  if (student.cgpa >= job.minCGPA) reasons.push(`CGPA ${student.cgpa} meets the ${job.minCGPA} requirement`);
  if (matchedRequired.length) reasons.push(`${matchedRequired.length}/${required.length} required skills matched`);
  if (student.projects.length) reasons.push(`${student.projects.length} relevant project${student.projects.length === 1 ? '' : 's'} listed`);
  if (interviewScore >= 70) reasons.push('Mock interview performance is above benchmark');
  const weaknesses = missingSkills.map(skill => `Missing ${skill}`);
  if (interviewScore < 60) weaknesses.push('Mock interview score is below benchmark');
  const eligibilityReasons = [];
  if (student.cgpa < job.minCGPA) eligibilityReasons.push(`CGPA ${student.cgpa} is below the required ${job.minCGPA}`);
  if (!job.eligibleBranches.includes(student.branch)) eligibilityReasons.push(`Branch ${student.branch} is not eligible`);
  if (!job.graduationYears.includes(student.graduationYear)) eligibilityReasons.push(`Graduation year ${student.graduationYear} is not eligible`);
  if (job.noBacklogsRequired && student.backlogsActive > 0) eligibilityReasons.push(`Student has ${student.backlogsActive} active backlog${student.backlogsActive === 1 ? '' : 's'}`);
  const eligible = eligibilityReasons.length === 0;
  const eligibilityScore = eligible ? 100 : 0;
  const totalScore = Math.round(skillOverlapScore * 0.4 + cgpaScore * 0.2 + interviewScore * 0.2 + eligibilityScore * 0.2);
  return { studentId: student.id, jobId: job.id, eligible, eligibilityStatus: eligible ? 'eligible' : 'ineligible', matchScore: totalScore, overallScore: totalScore, totalScore, skillOverlapScore, skillOverlap: skillOverlapScore, cgpaScore, interviewScore, eligibilityScore, matchedSkills, preferredSkillsMatched: matchedPreferred, missingSkills, strengths: reasons, strongFitReasons: reasons, weaknesses: [...eligibilityReasons, ...weaknesses], weaknessReasons: [...eligibilityReasons, ...weaknesses], eligibilityReasons, explanation: eligible ? (reasons.length ? reasons.join('. ') + '.' : 'Eligible based on job requirements.') : eligibilityReasons.join('. ') + '.', shortlisted: false, recommendation: !eligible ? 'reject' : totalScore >= 75 ? 'shortlist' : 'review' };
}

export async function getMatches(jobId, studentId) {
  const { students, jobs } = await getMatchingInputs();
  const job = jobs.find(candidate => candidate.id === jobId);
  if (!job) return null;
  const candidates = studentId ? students.filter(student => student.id === studentId) : students;
  if (studentId && candidates.length === 0) return null;
  return candidates.map(student => calculateMatch(student, job)).sort((a, b) => Number(b.eligible) - Number(a.eligible) || b.matchScore - a.matchScore);
}

export async function getAllMatches() {
  const { jobs } = await getMatchingInputs();
  const results = [];
  for (const job of jobs) results.push(...(await getMatches(job.id)));
  return results;
}
