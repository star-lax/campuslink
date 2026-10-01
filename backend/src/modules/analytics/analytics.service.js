import { getAnalyticsInputs } from './analytics.repository.js';

export async function buildAnalytics(filters = {}) {
  const db = await getAnalyticsInputs();
  const students = db.students.filter(s => !filters.graduationYear || String(s.graduationYear) === filters.graduationYear);
  const offers = db.offers;
  const placed = students.filter(s => s.placementStatus === 'placed' || s.placementStatus === 'offer-received' || s.offerIds?.length).length;
  const acceptedOffers = offers.filter(o => ['accepted', 'joining-pending', 'joined'].includes(o.stage));
  const packages = offers.map(o => Number(o.ctcLPA)).filter(Number.isFinite);
  const branchBreakdown = [...new Set(students.map(s => s.branch))].map(branch => { const members = students.filter(s => s.branch === branch); const branchPlaced = members.filter(s => s.placementStatus === 'placed' || s.placementStatus === 'offer-received' || s.offerIds?.length).length; return { branch, placed: branchPlaced, total: members.length, rate: members.length ? Math.round(branchPlaced / members.length * 100) : 0 }; });
  const readiness = ['not-ready', 'developing', 'ready', 'highly-employable'].map(band => ({ band, count: students.filter(s => s.readinessBand === band).length }));
  const salaryRanges = [[4,6,'4–6L'],[6,8,'6–8L'],[8,10,'8–10L'],[10,12,'10–12L'],[12,15,'12–15L']];
  const salaryDistribution = salaryRanges.map(([min,max,range]) => ({ range, count: packages.filter(value => value >= min && value < max).length })); salaryDistribution.push({ range: '15+L', count: packages.filter(value => value >= 15).length });
  const skillCounts = new Map(); offers.forEach(offer => { const job = db.jobs.find(j => j.companyName === offer.companyName && j.role === offer.role); (job?.requiredSkills || []).forEach(skill => skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1)); });
  const skillOffers = [...skillCounts.entries()].sort((a,b) => b[1]-a[1]).slice(0,8).map(([skill, count]) => ({ skill, offers: count }));
  return { overview: { totalStudents: students.length, placedStudents: placed, placementRate: students.length ? Number((placed / students.length * 100).toFixed(1)) : 0, offerCount: offers.length, acceptedOfferCount: acceptedOffers.length, averagePackage: packages.length ? Number((packages.reduce((a,b)=>a+b,0)/packages.length).toFixed(1)) : 0, highestPackage: packages.length ? Math.max(...packages) : 0, companyCount: db.companies.length, driveCount: db.drives.length }, branchBreakdown, readiness, salaryDistribution, skillOffers, driveMetrics: { total: db.drives.length, live: db.drives.filter(d=>d.status==='live').length, completed: db.drives.filter(d=>d.status==='completed').length, registeredStudents: db.drives.reduce((sum,d)=>sum+d.registeredStudents,0) }, offerMetrics: { total: offers.length, accepted: acceptedOffers.length, pending: offers.filter(o=>['draft','sent','joining-pending'].includes(o.stage)).length }, recruiterMetrics: db.companies.map(company => { const jobs = db.jobs.filter(j=>j.companyId===company.id); return { company: company.name, openRoles: jobs.reduce((sum,j)=>sum+j.openRoles,0), responseRate: jobs.length ? Math.round(jobs.reduce((sum,j)=>sum+j.responseRate,0)/jobs.length) : 0 }; }) };
}
