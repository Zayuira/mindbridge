/**
 * Лист дээр харуулах хурдан "Match %" тооцоолох функц.
 * Гүнзгий AI тооцооллыг зөвхөн дэлгэрэнгүй харагдац дээр хийнэ.
 */
export function calculateMatchScore(job: any, freelancer: any): number {
  if (!job || !freelancer) return 0;

  let score = 0;

  // 1. Ур чадварын тохироо (50%)
  const jobSkills = (job.skills || []).map((s: any) => s.name.toLowerCase());
  const flSkills = (freelancer.skills || []).map((s: any) =>
    (s.skill?.name || s.name || "").toLowerCase()
  );

  if (jobSkills.length > 0) {
    const overlap = jobSkills.filter((s: string) => flSkills.includes(s));
    const skillScore = (overlap.length / jobSkills.length) * 50;
    score += skillScore;
  } else {
    score += 25; // Ур чадвар заагаагүй бол дундаж оноо
  }

  // 2. Үнэлгээний тохироо (20%)
  const rating = freelancer.averageRating || freelancer.avg_rating || 0;
  score += (rating / 5) * 20;

  // 3. Төсвийн тохироо (20%)
  const flRate = freelancer.hourly_rate || 0;
  const jobMax = job.budget_max || 0;

  if (jobMax > 0) {
    if (flRate <= jobMax) {
      score += 20;
    } else {
      const penalty = Math.min(20, ((flRate - jobMax) / jobMax) * 20);
      score += Math.max(0, 20 - penalty);
    }
  } else {
    score += 15; // Төсөвгүй бол дундаж
  }

  // 4. Туршлага (10%)
  const completed = freelancer.completedProjects || freelancer.completed_jobs || 0;
  score += Math.min(10, (completed / 10) * 10);

  return Math.round(Math.max(30, Math.min(99, score))); // 30-99% хооронд байна
}

export function getMatchColor(score: number): string {
  if (score >= 90) return 'text-emerald-500 bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30';
  if (score >= 70) return 'text-blue-500 bg-blue-50 border-blue-100 dark:bg-blue-950/30';
  return 'text-slate-500 bg-slate-50 border-slate-100 dark:bg-slate-900/30';
}
