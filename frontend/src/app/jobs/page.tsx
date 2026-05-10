import Link from "next/link";
import { Search, MapPin, Clock, DollarSign, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import prisma from "@/lib/prisma";
import { calculateMatchScore, getMatchColor } from "@/lib/matching-logic";

async function getJobsData() {
  try {
    const [jobs, skills] = await Promise.all([
      prisma.job.findMany({
        where: { status: 'OPEN' },
        include: {
          client: {
            select: {
              company_name: true,
              location: true,
            },
          },
          skills: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.skill.findMany({
        select: { category: true },
        distinct: ['category'],
      })
    ]);

    const categories = Array.from(new Set(skills.map(s => s.category)));

    return { jobs, categories };
  } catch (error) {
    console.error("Error fetching jobs data:", error);
    return { jobs: [], categories: [] };
  }
}

export default async function JobsPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const role = session?.user?.role;

  const { jobs, categories } = await getJobsData();

  let userProposalJobIds: string[] = [];
  let freelancerProfile: any = null;
  if (userId && role === "FREELANCER") {
    freelancerProfile = await prisma.freelancerProfile.findUnique({
      where: { user_id: userId },
      include: { skills: { include: { skill: true } } }
    });

    const proposals = await prisma.proposal.findMany({
      where: { 
        freelancer: { id: freelancerProfile?.id }
      },
      select: { job_id: true }
    });
    userProposalJobIds = proposals.map(p => p.job_id);

    if (freelancerProfile) {
      jobs.sort((a: any, b: any) => calculateMatchScore(b, freelancerProfile) - calculateMatchScore(a, freelancerProfile));
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-6 text-slate-900 dark:text-white font-semibold">
              <Filter className="w-5 h-5" /> Шүүлтүүр
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Ангилал</label>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 dark:text-slate-400">
                      <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Төсөв (MNT)</label>
                <select className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                  <option>Бүгд</option>
                  <option>₮500k хүртэл</option>
                  <option>₮500k - ₮2M</option>
                  <option>₮2M+</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-6">

          {/* Header Search */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex-1 relative">
              <Input placeholder="Ажлын нэр, түлхүүр үг..." icon={<Search className="w-4 h-4" />} className="h-12 w-full text-lg" />
            </div>
            <Button variant="primary" className="h-12 px-8">Хайх</Button>
          </div>

          {/* Job List */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{jobs.length} ажил олдлоо</h2>
              <select className="text-sm border-none bg-transparent font-medium text-slate-600 dark:text-slate-400 focus:ring-0 cursor-pointer">
                <option>Шинэ нь эхэндээ</option>
                <option>Төсвөөр (Их)</option>
                <option>Төсвөөр (Бага)</option>
              </select>
            </div>

            {jobs.map((job: any) => (
              <div key={job.id} className="group bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:shadow-md transition-all">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <Link href={`/jobs/${job.id}`}>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {job.title}
                      </h3>
                    </Link>
                    <p className="text-slate-500 mt-1">{job.client?.company_name || "Байгууллага"}</p>

                    <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.client?.location || "Зайнаас"}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {job.status === "OPEN" ? "Нээлттэй" : job.status}</span>
                      <span className="flex items-center gap-1.5 text-green-600 dark:text-green-500 font-medium">
                        <DollarSign className="w-4 h-4" />
                        {job.budget_min > 0 ? `₮${job.budget_min.toLocaleString()} - ₮${job.budget_max.toLocaleString()}` : "Тохиролцоно"}
                      </span>
                      {role === "FREELANCER" && freelancerProfile && (
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold flex items-center gap-1.5 ${getMatchColor(calculateMatchScore(job, freelancerProfile))}`}>
                          <div className="w-1 h-1 rounded-full bg-current animate-pulse"></div>
                          {calculateMatchScore(job, freelancerProfile)}% Тохироо
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.skills?.map((s: any) => (
                        <span key={s.id} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium">
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 shrink-0 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6">
                    <span className="text-xs text-slate-400">{new Date(job.createdAt || Date.now()).toLocaleDateString()}</span>
                    <Link href={`/jobs/${job.id}`}>
                      {userProposalJobIds.includes(job.id) ? (
                        <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10">
                          Санал илгээсэн
                        </Button>
                      ) : (
                        <Button variant="outline" className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          Дэлгэрэнгүй
                        </Button>
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <Button variant="ghost">Цааш унших...</Button>
          </div>

        </main>
      </div>
    </div>
  );
}
