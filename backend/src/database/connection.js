import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const databaseFile = path.resolve(process.cwd(), 'data', 'campuslink.json');
const frontendStudentsFile = path.resolve(process.cwd(), '..', 'src', 'data', 'students.ts');
const frontendJobsFile = path.resolve(process.cwd(), '..', 'src', 'data', 'jobs.ts');
const frontendDrivesFile = path.resolve(process.cwd(), '..', 'src', 'data', 'drives.ts');
const frontendOffersFile = path.resolve(process.cwd(), '..', 'src', 'data', 'offers.ts');
const frontendNotificationsFile = path.resolve(process.cwd(), '..', 'src', 'data', 'notifications.ts');
async function loadFrontendStudents() {
  const source = await readFile(frontendStudentsFile, 'utf8');
  const executable = source.replace(/^import[^;]+;\s*/gm, '').replace(/export\s+const\s+students\s*:\s*Student\[\]\s*=/, 'const students =').replace(/export\s+/g, '').concat('\nglobalThis.students = students;');
  const context = {};
  vm.runInNewContext(executable, context);
  return context.students;
}
async function loadFrontendJobs() {
  const source = await readFile(frontendJobsFile, 'utf8');
  const executable = source.replace(/^import[^;]+;\s*/gm, '').replace(/export\s+const\s+jobs\s*:\s*JobDescription\[\]\s*=/, 'const jobs =').replace(/export\s+/g, '').concat('\nglobalThis.jobs = jobs;');
  const context = {};
  vm.runInNewContext(executable, context);
  return context.jobs;
}
async function loadFrontendDrives() {
  const source = await readFile(frontendDrivesFile, 'utf8');
  const executable = source.replace(/^import[^;]+;\s*/gm, '').replace(/export\s+const\s+drives\s*:\s*PlacementDrive\[\]\s*=/, 'const drives =').replace(/export\s+const\s+conflicts\s*:\s*ConflictItem\[\]\s*=/, 'const conflicts =').replace(/export\s+/g, '').concat('\nglobalThis.drives = drives; globalThis.conflicts = conflicts;');
  const context = {};
  vm.runInNewContext(executable, context);
  return { drives: context.drives, conflicts: context.conflicts };
}
async function loadFrontendOffers() {
  const source = await readFile(frontendOffersFile, 'utf8');
  const executable = source.replace(/^import[^;]+;\s*/gm, '').replace(/export\s+const\s+offers\s*:\s*Offer\[\]\s*=/, 'const offers =').replace(/export\s+/g, '').concat('\nglobalThis.offers = offers;');
  const context = {};
  vm.runInNewContext(executable, context);
  return context.offers;
}
async function loadFrontendNotifications() {
  const source = await readFile(frontendNotificationsFile, 'utf8');
  const executable = source.replace(/^import[^;]+;\s*/gm, '').replace(/export\s+const\s+notifications\s*:\s*Notification\[\]\s*=/, 'const notifications =').replace(/export\s+/g, '').concat('\nglobalThis.notifications = notifications;');
  const context = {};
  vm.runInNewContext(executable, context);
  return context.notifications;
}
export async function connectDatabase() {
  await mkdir(path.dirname(databaseFile), { recursive: true });
  let database;
  try { database = JSON.parse(await readFile(databaseFile, 'utf8')); } catch { database = { students: [] }; }
  if (!database.students?.length) {
    try { database.students = await loadFrontendStudents(); } catch (error) { console.warn('Student seed unavailable:', error.message); }
    await writeFile(databaseFile, JSON.stringify(database, null, 2));
  }
  if (!database.jobs?.length) { try { database.jobs = await loadFrontendJobs(); } catch (error) { console.warn('Job seed unavailable:', error.message); } }
  if (!database.companies?.length) database.companies = (database.jobs || []).map(job => ({ id: job.companyId, name: job.companyName, initials: job.companyInitials, color: job.companyColor }));
  if (!database.drives?.length) { try { const seeded = await loadFrontendDrives(); database.drives = seeded.drives; database.conflicts = seeded.conflicts; } catch (error) { console.warn('Drive seed unavailable:', error.message); } }
  if (!database.offers?.length) { try { database.offers = await loadFrontendOffers(); } catch (error) { console.warn('Offer seed unavailable:', error.message); } }
  if (!database.notifications?.length) { try { database.notifications = await loadFrontendNotifications(); } catch (error) { console.warn('Notification seed unavailable:', error.message); } }
  await writeFile(databaseFile, JSON.stringify(database, null, 2));
  return databaseFile;
}
export async function readDatabase() { return JSON.parse(await readFile(databaseFile, 'utf8')); }
export async function writeDatabase(database) { await writeFile(databaseFile, JSON.stringify(database, null, 2)); return database; }
