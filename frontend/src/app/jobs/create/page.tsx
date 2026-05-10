"use client";

import Link from "next/link";
import { ArrowLeft, Briefcase, Plus, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as any)?.role;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [deadline, setDeadline] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
    }
    setSkillInput("");
  };

  const removeSkill = (s: string) => setSkills(skills.filter((sk) => sk !== s));

  if (status === "loading") {
    return <div className="container mx-auto px-4 py-16 text-center text-slate-500">Уншиж байна...</div>;
  }

  // Block non-clients
  if (!session || role !== "CLIENT") {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Зөвшөөрөлгүй</h2>
        <p className="text-slate-500 mb-4">Зөвхөн клиент байгууллага ажил нийтлэх боломжтой.</p>
        <Link href="/jobs"><Button variant="outline">Буцах</Button></Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !deadline) {
      setError("Гарчиг, тайлбар, хугацааг заавал бөглөнө үү.");
      return;
    }
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, budgetMin, budgetMax, deadline, skills }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(data.error || "Алдаа гарлаа.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push(`/jobs/${data.job.id}`), 1500);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Буцах
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Шинэ ажил нийтлэх</h1>
          <p className="text-slate-500 mt-1">Төсөлдөө тохирох зөв фрилансерийг олохын тулд дэлгэрэнгүй мэдээлэл оруулна уу.</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex gap-2 items-center">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex gap-2 items-center">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> Ажил амжилттай нийтлэгдлээ! Чиглүүлж байна...
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8">
          <form className="space-y-8" onSubmit={handleSubmit}>

            {/* 1. Basic Info */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">1. Үндсэн мэдээлэл</h2>
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ажлын гарчиг <span className="text-red-500">*</span></label>
                  <Input
                    placeholder="Жишээ нь: E-Commerce Вебсайт хийлгэнэ (Next.js & Tailwind)"
                    className="text-base py-6"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Description */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">2. Дэлгэрэнгүй</h2>
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Дэлгэрэнгүй тайлбар <span className="text-red-500">*</span></label>
                  <textarea
                    className="flex w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 min-h-[200px]"
                    placeholder="Ажлын шаардлага, гүйцэтгэх ажлууд зэргийг дэлгэрэнгүй бичнэ үү..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Шаардлагатай ур чадварууд</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Жишээ: React"
                      className="flex-1"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                    />
                    <Button variant="outline" type="button" onClick={addSkill}>
                      <Plus className="w-4 h-4" /> Нэмэх
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((s) => (
                      <span key={s} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                        {s}
                        <button type="button" className="hover:text-red-500 ml-1" onClick={() => removeSkill(s)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Budget & Deadline */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">3. Төсөв ба Хугацаа</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Доод төсөв (₮)</label>
                  <Input type="number" placeholder="1000000" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Дээд төсөв (₮)</label>
                  <Input type="number" placeholder="3000000" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Дуусах огноо <span className="text-red-500">*</span></label>
                  <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
              <Link href="/jobs" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full sm:w-auto">Цуцлах</Button>
              </Link>
              <Button variant="primary" type="submit" className="w-full sm:w-auto h-12 px-8 font-bold flex items-center gap-2" disabled={submitting}>
                <Briefcase className="w-4 h-4" /> {submitting ? "Нийтэлж байна..." : "Нийтлэх"}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
