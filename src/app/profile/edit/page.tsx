"use client";

import { Save, ArrowLeft, Image as ImageIcon, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role || "FREELANCER";
  const isClient = role === "CLIENT";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Common fields
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  // Client fields
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");

  // Freelancer fields
  const [title, setTitle] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [skills, setSkills] = useState("");

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((data) => {
        const p = data.profile;
        if (!p) return;
        setLocation(p.location || "");
        setBio(p.bio || "");
        if (isClient) {
          setCompanyName(p.company_name || "");
          setIndustry(p.industry || "");
        } else {
          setTitle(p.title || "");
          setHourlyRate(p.hourly_rate?.toString() || "");
          const skillNames = p.skills?.map((s: any) => s.skill.name).join(", ") || "";
          setSkills(skillNames);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session, isClient]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const body = isClient
      ? { companyName, industry, bio, location }
      : {
          title,
          bio,
          hourlyRate,
          location,
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        };

    try {
      const res = await fetch("/api/profiles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Хадгалахад алдаа гарлаа.");
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/profile"), 1000);
      }
    } catch {
      setError("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="text-slate-500">Уншиж байна...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/profile" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1" /> Буцах
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Профайл засах</h1>
          <p className="text-slate-500 mt-1">Та өөрийн мэдээллээ байнга шинэчилж байх нь ажил олоход тустай.</p>
        </div>
        <Button
          variant="primary"
          className="hidden sm:flex items-center gap-2"
          onClick={handleSave}
          disabled={saving}
        >
          <Save className="w-4 h-4" /> {saving ? "Хадгалж байна..." : "Хадгалах"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">Амжилттай хадгалагдлаа! Чиглүүлж байна...</div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">

        {/* Cover & Avatar */}
        <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
          <button className="absolute bottom-4 right-4 bg-black/30 hover:bg-black/50 text-white backdrop-blur-md px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all">
            <ImageIcon className="w-4 h-4" /> Ковер солих
          </button>
        </div>

        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-16 mb-8">
            <div className="relative group">
              <div className="w-32 h-32 bg-slate-200 dark:bg-slate-800 rounded-full border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center overflow-hidden">
                <User className="w-12 h-12 text-slate-400" />
              </div>
              <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full border-4 border-transparent flex items-center justify-center text-white text-sm font-medium transition-all cursor-pointer">
                Зураг солих
              </button>
            </div>
          </div>

          <form className="space-y-8" onSubmit={handleSave}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isClient && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Байгууллагын нэр</label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Байгууллагын нэр" />
                </div>
              )}

              {isClient && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Салбар</label>
                  <Input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Мэдээллийн Технологи" />
                </div>
              )}

              {!isClient && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Гарчиг / Мэргэжил</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ахлах UI/UX Дизайнер" />
                </div>
              )}

              {!isClient && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Цагийн тариф (₮)</label>
                  <Input type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="50000" />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Байршил</label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Улаанбаатар, Монгол" />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {isClient ? "Байгууллагын тухай" : "Миний тухай (Био)"}
              </label>
              <textarea
                className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent dark:border-slate-800 dark:bg-slate-950 dark:placeholder:text-slate-400 min-h-[120px]"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={isClient ? "Байгууллагынхаа талаар бичнэ үү..." : "Өөрийн тухай бичнэ үү..."}
              />
            </div>

            {/* Skills - only Freelancer */}
            {!isClient && (
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Ур чадварууд (Таслалаар тусгаарлана)</label>
                <Input
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Figma, UI Design, React, TypeScript"
                />
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800 sm:hidden">
              <Button variant="primary" className="w-full h-12" disabled={saving}>
                <Save className="w-4 h-4 mr-2" /> {saving ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
