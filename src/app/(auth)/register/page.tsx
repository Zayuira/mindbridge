"use client";

import Link from "next/link";
import { User, Mail, Lock, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"freelancer" | "client">("freelancer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: `${lastName} ${firstName}`.trim(),
          email,
          phone,
          password,
          role: role.toUpperCase(),
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Бүртгүүлэхэд алдаа гарлаа.");
      }

      router.push(`/verify?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 py-12">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Шинэ бүртгэл үүсгэх</h1>
          <p className="text-slate-500 mt-2">Ямар онцлогоор бүртгүүлэхээ сонгоно уу</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setRole("freelancer")}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
              role === "freelancer"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400"
            )}
          >
            <User className="w-8 h-8 mb-2" />
            <span className="font-semibold">Фрилансер</span>
            <span className="text-xs opacity-80 mt-1">Ажил хайх, санал илгээх</span>
          </button>

          <button
            type="button"
            onClick={() => setRole("client")}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all",
              role === "client"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-400"
            )}
          >
            <Building2 className="w-8 h-8 mb-2" />
            <span className="font-semibold">Клиент</span>
            <span className="text-xs opacity-80 mt-1">Ажил хөлслөх, төлбөр хийх</span>
          </button>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Овог</label>
              <Input placeholder="Овог" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Нэр</label>
              <Input placeholder="Нэр" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">И-мэйл хаяг</label>
            <Input type="email" placeholder="name@example.com" value={email} onChange={e => setEmail(e.target.value)} required icon={<Mail className="w-4 h-4" />} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Утасны дугаар</label>
            <Input type="tel" placeholder="88888888" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Нууц үг</label>
            <Input type="password" placeholder="Шинэ нууц үг зохиох" value={password} onChange={e => setPassword(e.target.value)} required icon={<Lock className="w-4 h-4" />} />
          </div>

          <Button variant="primary" className="w-full mt-6 py-6 font-semibold" type="submit" disabled={loading}>
            {loading ? "Түрхүлээнэ үү..." : "Бүртгэл үүсгэх"}
          </Button>

          <p className="text-xs text-center text-slate-500 mt-4 leading-relaxed px-4">
            Бүртгүүлснээр та манай Үйлчилгээний нөхцөл болон Нууцлалын бодлогыг хүлээн зөвшөөрсөнд тооцно.
          </p>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-6">
          Бүртгэлтэй хэрэглэгч үү?{" "}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Нэвтрэх
          </Link>
        </div>
      </div>
    </div>
  );
}
