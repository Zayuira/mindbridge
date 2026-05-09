"use client";

import Link from "next/link";
import { MapPin, Briefcase, Mail, Calendar, Star, Edit, User, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "FREELANCER";
  const isClient = role === "CLIENT";

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data.profile);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session]);

  const name = profile?.user?.full_name || session?.user?.name || "Хэрэглэгч";
  const email = profile?.user?.email || session?.user?.email || "";

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="text-slate-500">Уншиж байна...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
            <div className="w-32 h-32 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-4 border-4 border-white dark:border-slate-950 shadow-md flex items-center justify-center overflow-hidden relative">
              <User className="w-12 h-12 text-slate-400" />
            </div>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{name}</h1>
            <p className="text-blue-600 dark:text-blue-400 font-medium">
              {isClient ? (profile?.company_name || "Байгууллага") : (profile?.title || "Фрилансер")}
            </p>

            <div className="flex items-center justify-center gap-1 mt-2 text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-4 h-4 ${star <= (profile?.averageRating || 0) ? "fill-current" : "text-slate-300 dark:text-slate-700"}`} 
                />
              ))}
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 ml-1">
                {profile?.averageRating?.toFixed(1) || "0.0"} ({profile?.reviewCount || 0})
              </span>
            </div>

            <Link href="/profile/edit" className="mt-6 block">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" /> Профайл засах
              </Button>
            </Link>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Холбоо барих</h3>
            <ul className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
              {(profile?.location) && (
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-400" /> {profile.location}
                </li>
              )}
              <li className="flex items-center gap-3 whitespace-nowrap overflow-hidden text-ellipsis">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" /> {email}
              </li>
              <li className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-slate-400" /> 2023 онд нэгдсэн
              </li>
            </ul>
          </div>
        </div>

        {/* Right Content */}
        <div className="md:col-span-2 space-y-8">

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Миний тухай</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {profile?.bio || (isClient ? "Байгууллагын тухай мэдээлэл оруулаагүй байна." : "Өөрийн тухай мэдээлэл оруулаагүй байна.")}
            </p>
          </div>

          {isClient ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Байгууллагын мэдээлэл</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Байгууллагын нэр</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{profile?.company_name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Овог нэр</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Салбар</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{profile?.industry || "—"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Нийт зарласан ажил</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{profile?.jobs?.length ?? 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Миний зарласан ажлууд</h2>
                  <Link href="/jobs/create">
                    <Button variant="outline" size="sm">Ажил нэмэх</Button>
                  </Link>
                </div>
                <div className="space-y-6">
                  <div className="mb-8">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Нээлттэй ажлын зарууд</h3>
                    {profile?.jobs?.length > 0 ? (
                      <div className="space-y-4">
                        {profile.jobs.map((job: any) => (
                          <div key={job.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all hover:border-blue-200 dark:hover:border-blue-900/50">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">{job.title}</h4>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${
                                  job.status === 'OPEN' ? 'bg-green-100 text-green-700' : 
                                  job.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {job.status === 'OPEN' ? 'Нээлттэй' : job.status === 'IN_PROGRESS' ? 'Явагдаж буй' : 'Хаагдсан'}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs text-slate-500">Төсөв: ₮{job.budget_min.toLocaleString()} - ₮{job.budget_max.toLocaleString()}</p>
                                <div className="flex items-center gap-1 text-[11px] text-blue-600 font-medium">
                                    <User className="w-3 h-3" />
                                    <span>{job._count?.proposals || 0} санал</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={`/jobs/${job.id}/proposals`}>
                                    <Button variant="outline" size="sm" className="h-8 text-[11px] font-semibold border-blue-100 text-blue-600 hover:bg-blue-50">Саналууд үзэх</Button>
                                </Link>
                                <Link href={`/jobs/${job.id}`}>
                                    <Button variant="ghost" size="sm" className="h-8 text-[11px] font-semibold text-slate-500">Дэлгэрэнгүй</Button>
                                </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm italic">Зарласан ажил байхгүй байна.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Идэвхтэй гэрээнүүд</h3>
                    {profile?.contracts?.filter((c: any) => c.status === 'ACTIVE').length > 0 ? (
                      <div className="space-y-4">
                        {profile.contracts.filter((c: any) => c.status === 'ACTIVE').map((contract: any) => (
                          <div key={contract.id} className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-950/10 flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">{contract.job?.title}</h4>
                              <p className="text-xs text-slate-500 mt-1">Партнер: {contract.freelancer?.user?.full_name || contract.client?.user?.full_name}</p>
                            </div>
                            <Link href={`/contracts/${contract.id}`}>
                              <Button variant="ghost" size="sm" className="text-blue-600">Гэрээ үзэх</Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm italic">Идэвхтэй гэрээ байхгүй.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Ажлын түүх</h3>
                    {profile?.contracts?.filter((c: any) => c.status === 'COMPLETED').length > 0 ? (
                      <div className="space-y-4">
                        {profile.contracts.filter((c: any) => c.status === 'COMPLETED').map((contract: any) => (
                          <div key={contract.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center opacity-80">
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">{contract.job?.title}</h4>
                              <p className="text-xs text-slate-500 mt-1">Дууссан: {new Date(contract.createdAt || contract.created_at).toLocaleDateString()}</p>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm italic">Дууссан ажил одоогоор байхгүй.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Skills */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Ур чадварууд</h2>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.length > 0
                    ? profile.skills.map((s: any) => (
                        <span key={s.skill.id} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700">
                          {s.skill.name}
                        </span>
                      ))
                    : <p className="text-slate-400 text-sm">Ур чадвар нэмэгдээгүй байна.</p>
                  }
                </div>
              </div>

              {/* Proposals */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Миний илгээсэн саналууд</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Одоо хийж буй ажлууд</h3>
                    {profile?.contracts?.filter((c: any) => c.status === 'ACTIVE').length > 0 ? (
                      <div className="space-y-4">
                        {profile.contracts.filter((c: any) => c.status === 'ACTIVE').map((contract: any) => (
                          <div key={contract.id} className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-950/10 flex justify-between items-center">
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">{contract.job?.title}</h4>
                              <p className="text-xs text-slate-500 mt-1">Захиалагч: {contract.client?.user?.full_name}</p>
                            </div>
                            <Link href={`/contracts/${contract.id}`}>
                              <Button variant="ghost" size="sm" className="text-blue-600">Гэрээ үзэх</Button>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm italic">Идэвхтэй ажил байхгүй.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Саналууд</h3>
                    {profile?.proposals?.length > 0 ? (
                      <div className="space-y-4">
                        {profile.proposals.map((prop: any) => (
                          <div key={prop.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex justify-between items-start mb-2">
                              <Link href={`/jobs/${prop.job.id}`} className="hover:text-blue-600">
                                <h4 className="font-bold">{prop.job.title}</h4>
                              </Link>
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                                prop.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' : 
                                prop.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {prop.status === 'PENDING' ? 'Хүлээгдэж буй' : prop.status}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 italic mb-3">"{prop.cover_letter}"</p>
                            <div className="flex justify-between items-center text-xs text-slate-500">
                              <span>₮{prop.bid_amount.toLocaleString()} • {new Date(prop.createdAt || prop.created_at).toLocaleDateString()}</span>
                              <Link href={`/messages?partnerId=${prop.job.client?.user_id || ""}&jobId=${prop.job.id}`}>
                                <Button variant="ghost" size="sm" className="h-8 text-blue-600">Зурвас бичих</Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm italic">Илгээсэн санал байхгүй.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Portfolio */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Портфолио</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="group relative rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden cursor-pointer">
                      <div className="aspect-video bg-slate-100 dark:bg-slate-800 p-4 flex items-center justify-center">
                        <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 transition-transform group-hover:scale-110" />
                      </div>
                      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-sm">
                        <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Портфолио жишээ {i}</h4>
                        <p className="text-slate-500 mt-1">Төслийн тайлбар энд байна.</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
