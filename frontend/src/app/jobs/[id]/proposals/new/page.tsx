"use client";

import Link from "next/link";
import { ArrowLeft, Send, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function NewProposalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [job, setJob] = useState<any>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const role = (session?.user as any)?.role;

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setJob(data.job);
        setLoading(false);
      });
  }, [id]);

  // Block clients and unauthenticated users
  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <p className="text-slate-500">Уншиж байна...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Нэвтрэх шаардлагатай</h2>
        <p className="text-slate-500 mb-4">Санал илгээхийн тулд эхлээд нэвтэрнэ үү.</p>
        <Link href="/login"><Button variant="primary">Нэвтрэх</Button></Link>
      </div>
    );
  }

  if (role !== "FREELANCER") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Зөвшөөрөлгүй</h2>
        <p className="text-slate-500 mb-4">Зөвхөн фрилансер санал илгээх боломжтой.</p>
        <Link href={`/jobs/${id}`}><Button variant="outline">Буцах</Button></Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverLetter.trim() || !bidAmount) {
      setError("Бүх талбарыг бөглөнө үү.");
      return;
    }
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/proposals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: id, coverLetter, bidAmount }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Алдаа гарлаа.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push(`/jobs/${id}`), 1500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <Link href={`/jobs/${id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Ажлын дэлгэрэнгүй рүү буцах
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Санал илгээх</h1>
        {job && (
          <p className="text-slate-500 mt-2">
            <span className="font-medium text-slate-700 dark:text-slate-300">"{job.title}"</span> ажилд өөрийн саналаа илгээх.
          </p>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex gap-2 items-center">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex gap-2 items-center">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> Санал амжилттай илгээгдлээ! Чиглүүлж байна...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Proposal Form */}
        <div className="lg:col-span-2 space-y-6">
          <form className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> Нүүр захиа (Cover Letter)
              </h3>
              <p className="text-sm text-slate-500">Яагаад энэ ажилд тохирох хүн гэдгээ илэрхийлэн бичнэ үү.</p>
              <textarea
                className="flex w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 min-h-[250px]"
                placeholder="Сайн байна уу, би танай төсөлтэй танилцлаа..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Нөхцөл</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Санал болгох үнэ (₮)</label>
                <Input
                  type="number"
                  placeholder="Жишээ: 4000000"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  required
                />
                {job && (
                  <p className="text-xs text-slate-500">
                    Клиентийн төсөв: ₮{job.budget_min?.toLocaleString()} - ₮{job.budget_max?.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <Button variant="primary" type="submit" className="w-full sm:w-auto px-8 py-6 font-bold flex items-center justify-center gap-2" disabled={submitting}>
                <Send className="w-4 h-4" /> {submitting ? "Илгээж байна..." : "Саналыг илгээх"}
              </Button>
            </div>
          </form>
        </div>

        {/* Tips Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Зөвлөмж</h3>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex gap-3">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                <p>Нүүр захиандаа өмнөх туршлагаа тодорхой дурдаарай.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                <p>Санал болгох үнэ нь клиентийн төсвийн хүрээнд байх нь зохимжтой.</p>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                <p>Яагаад таг ажилд тохирох хүн болохоо тодорхой бичээрэй.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
