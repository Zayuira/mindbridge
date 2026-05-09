import { Search, MapPin, Star, Filter, Verified, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { calculateMatchScore, getMatchColor } from "@/lib/matching-logic";

async function getFreelancerData() {
  try {
    const [freelancers, skills] = await Promise.all([
      prisma.freelancerProfile.findMany({
        include: {
          user: { select: { full_name: true, email: true } },
          skills: { include: { skill: true } },
          contracts: { 
            include: { reviews: true }
          },
        },
        orderBy: { createdAt: 'desc' } as any,
        take: 20,
      }),
      prisma.skill.findMany({
        select: { category: true },
        distinct: ['category'],
      })
    ]);

    const freelancersWithStats = freelancers.map(f => {
      const allReviews = f.contracts.flatMap(c => c.reviews);
      const totalReviews = allReviews.length;
      const avgRating = totalReviews > 0 
        ? allReviews.reduce((acc, r: any) => acc + r.rating, 0) / totalReviews 
        : 0;
      const completedProjects = f.contracts.filter(c => c.status === 'COMPLETED').length;
      
      return {
        ...f,
        averageRating: avgRating,
        reviewCount: totalReviews,
        completedProjects
      };
    });

    const categories = Array.from(new Set(skills.map(s => s.category)));

    return { freelancers: freelancersWithStats, categories };
  } catch (error) {
    console.error("Error fetching freelancer data:", error);
    return { freelancers: [], categories: [] };
  }
}

export default async function FreelancersPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const role = session?.user?.role;

  const { freelancers, categories } = await getFreelancerData();
  
  // Client бол хамгийн сүүлийн ажилтай нь харьцуулж Match үзүүлнэ
  let clientJob: any = null;
  if (userId && role === 'CLIENT') {
    clientJob = await prisma.job.findFirst({
      where: { client: { user_id: userId }, status: 'OPEN' },
      include: { skills: true },
      orderBy: { createdAt: 'desc' }
    });

    if (clientJob) {
      freelancers.sort((a: any, b: any) => calculateMatchScore(clientJob, b) - calculateMatchScore(clientJob, a));
    }
  }

  return (
    <div className="flex flex-col flex-1 bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Фрилансер хайх
          </h1>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Ур чадвар, нэр эсвэл мэргэжлээр хайх..."
                className="w-full h-14 pl-12 pr-4 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-blue-500 transition-colors text-slate-900 dark:text-white placeholder:text-slate-500"
              />
            </div>
            <Button
              variant="outline"
              className="h-14 px-6 md:px-8 bg-white dark:bg-slate-900 flex items-center gap-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
            >
              <Filter className="w-5 h-5" /> Шүүлтүүр
            </Button>
            <Button
              variant="primary"
              className="h-14 px-8 font-bold"
            >
              Хайх
            </Button>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <span key={cat} className="shrink-0 text-sm py-1.5 px-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-slate-200 transition-colors">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((f: any) => (
            <Link
              href={`/freelancers/${f.id}`}
              key={f.id}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xl font-bold text-slate-400 border border-slate-200 dark:border-slate-700">
                    {f.user?.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1 group-hover:text-blue-600 transition-colors">
                      {f.user?.full_name}
                      <Verified className="w-4 h-4 text-emerald-500" />
                    </h3>
                    <p className="text-sm text-slate-500 mb-1 line-clamp-1">
                      {f.title}
                    </p>
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{f.location || "Зайнаас"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center text-slate-900 dark:text-white font-bold text-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                  {f.averageRating > 0 ? f.averageRating.toFixed(1) : "Шинэ"}
                </div>
                <span className="text-slate-400 text-xs">
                  ({f.completedProjects} ажил)
                </span>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">
                  ₮{(f.hourly_rate || 0).toLocaleString()} / цаг
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                {f.skills?.map((sk: any) => (
                  <span
                    key={sk.skill.id}
                    className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-lg border border-slate-100 dark:border-slate-700/50"
                  >
                    {sk.skill.name}
                  </span>
                ))}
              </div>

              {role === 'CLIENT' && clientJob && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Тохироо:</span>
                  <div className={`px-2 py-0.5 rounded-md border text-[10px] font-black ${getMatchColor(calculateMatchScore(clientJob, f))}`}>
                    {calculateMatchScore(clientJob, f)}% MATCH
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            variant="outline"
            className="h-12 px-8 bg-white dark:bg-slate-900 font-medium flex items-center gap-2"
          >
            Дараагийн хуудас <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
