"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";
import {
  ArrowLeft, MapPin, DollarSign, Calendar, Share2, CheckCircle2,
  Bookmark, User, Pencil, AlertCircle, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setNotFound(true);
        else {
          setJob(data.job);
          // Check if user is in proposals (assuming the API didn't return this, we could also fetch /api/proposals?jobId=...)
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
    
    // Check if applied
    if (userId && role === "FREELANCER") {
      fetch(`/api/proposals?jobId=${id}`)
        .then(r => r.json())
        .then(data => {
          if (data.proposals && data.proposals.length > 0) setHasApplied(true);
        });
    }
  }, [id, userId, role]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-slate-500">
        Уншиж байна...
      </div>
    );
  }

  if (notFound || !job) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ажил олдсонгүй</h2>
        <Link href="/jobs"><Button variant="outline">Буцах</Button></Link>
      </div>
    );
  }

  // Check if current user is the owner of this job
  const isOwner = role === "CLIENT" && job.client?.user_id === userId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Буцах
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-2 text-sm font-medium mb-6">
                  <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    {job.client?.company_name || "Байгууллага"}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    job.status === "OPEN" ? "bg-green-100 text-green-700" :
                    job.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {job.status === "OPEN" ? "Нээлттэй" :
                     job.status === "IN_PROGRESS" ? "Явагдаж байна" : "Хаагдсан"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="ghost" size="icon" className="rounded-full shadow-sm border border-slate-200 dark:border-slate-800">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full shadow-sm border border-slate-200 dark:border-slate-800">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6 border-y border-slate-100 dark:border-slate-800 mb-6">
              {job.client?.location && (
                <div>
                  <p className="text-sm text-slate-500 mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> Байршил</p>
                  <p className="font-semibold text-slate-900 dark:text-white">{job.client.location}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-1"><Calendar className="w-4 h-4" /> Дуусах огноо</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {new Date(job.deadline).toLocaleDateString("mn-MN")}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-1"><DollarSign className="w-4 h-4" /> Төсөв</p>
                <p className="font-semibold text-green-600 dark:text-green-500">
                  {job.budget_min > 0 ? `₮${job.budget_min.toLocaleString()} - ₮${job.budget_max.toLocaleString()}` : "Тохиролцоно"}
                </p>
              </div>
            </div>

            <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {job.description}
            </div>

            {job.skills?.length > 0 && (
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Шаардлагатай ур чадварууд</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s: any) => (
                    <span key={s.id} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 sticky top-24 space-y-4">

            {/* Freelancer: Submit proposal or see status */}
            {role === "FREELANCER" && job.status === "OPEN" && (
              <div className="space-y-3">
                {hasApplied ? (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-green-800 dark:text-green-300 font-bold">Санал илгээсэн</p>
                  </div>
                ) : (
                  <Link href={`/jobs/${id}/proposals/new`} className="block w-full">
                    <Button variant="primary" className="w-full py-6 font-bold text-base shadow-lg hover:shadow-xl transition-all">
                      Санал илгээх
                    </Button>
                  </Link>
                )}
                
                <Link href={`/messages?partnerId=${job.client?.user_id || ""}&jobId=${id}`} className="block w-full">
                  <Button variant="outline" className="w-full py-6 font-bold text-base flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" /> Зурвас бичих
                  </Button>
                </Link>
              </div>
            )}

            {/* Client: Edit own job */}
            {isOwner && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <Pencil className="w-4 h-4" />
                  <span>Та энэ ажлын эзэн</span>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
                  <p className="text-center text-sm font-bold text-blue-900 dark:text-blue-100 mb-3">
                    {job.proposals?.length ?? 0} санал ирсэн байна.
                  </p>
                  <Link href={`/jobs/${id}/proposals`} className="block w-full">
                    <Button variant="primary" className="w-full">
                      Саналуудыг үзэх
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Not logged in */}
            {!session && (
              <Link href="/login" className="block w-full">
                <Button variant="primary" className="w-full py-6 font-bold text-base">
                  Нэвтэрч санал илгээх
                </Button>
              </Link>
            )}

            {/* Client info */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Клиентийн мэдээлэл</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {job.client?.company_name || "—"}
                    </p>
                    <p className="text-slate-500 text-xs">{job.client?.industry || ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">Баталгаажсан байгууллага</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Нийт зарласан ажил:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {job.client?.total_jobs_posted ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
