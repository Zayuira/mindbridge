"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Phone, CheckCircle2, Loader2, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  const handleVerify = async (type: "EMAIL" | "PHONE") => {
    const code = type === "EMAIL" ? emailCode : phoneCode;
    if (!code) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, type }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Баталгаажуулалт амжилтгүй.");
      }

      if (type === "EMAIL") setEmailVerified(true);
      if (type === "PHONE") setPhoneVerified(true);
      
      setMessage(data.message);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (type: "EMAIL" | "PHONE") => {
    setResending(type);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Код илгээхэд алдаа гарлаа.");
      }

      setMessage("Шинэ код илгээлээ.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(null);
    }
  };

  if (emailVerified && phoneVerified) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Баталгаажлаа!</h1>
        <p className="text-slate-500">Таны бүртгэл амжилттай баталгаажлаа. Одоо та нэвтэрч орох боломжтой.</p>
        <Button onClick={() => router.push("/login")} className="w-full py-6 font-bold">
          Нэвтрэх хэсэг рүү очих <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Баталгаажуулалт</h1>
        <p className="text-slate-500 mt-2">{email} хаяг руу илгээсэн кодыг оруулна уу.</p>
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{error}</div>}
      {message && <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg text-sm text-center font-medium">{message}</div>}

      <div className="space-y-6">
        {/* Email Verification Card */}
        <div className={`p-6 rounded-2xl border-2 transition-all ${emailVerified ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 dark:border-slate-800'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${emailVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">И-мэйл баталгаажуулах</p>
                <p className="text-xs text-slate-500">{emailVerified ? 'Баталгаажсан' : '6 оронтой код оруулна уу'}</p>
              </div>
            </div>
            {emailVerified && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
          </div>

          {!emailVerified && (
            <div className="flex gap-2">
              <Input
                placeholder="000000"
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)}
                maxLength={6}
                className="text-center tracking-[0.5em] font-mono text-xl"
              />
              <Button onClick={() => handleVerify("EMAIL")} disabled={loading || emailCode.length < 6}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Шалгах"}
              </Button>
            </div>
          )}
          
          {!emailVerified && (
            <button 
              onClick={() => handleResend("EMAIL")} 
              disabled={!!resending}
              className="mt-3 text-xs text-blue-600 hover:underline flex items-center gap-1 mx-auto"
            >
              {resending === "EMAIL" ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Дахин код илгээх
            </button>
          )}
        </div>

        {/* Phone Verification Card */}
        <div className={`p-6 rounded-2xl border-2 transition-all ${phoneVerified ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 dark:border-slate-800'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${phoneVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Утас баталгаажуулах</p>
                <p className="text-xs text-slate-500">{phoneVerified ? 'Баталгаажсан' : 'Гар утсанд ирсэн кодыг оруулна уу'}</p>
              </div>
            </div>
            {phoneVerified && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
          </div>

          {!phoneVerified && (
            <div className="flex gap-2">
              <Input
                placeholder="000000"
                value={phoneCode}
                onChange={(e) => setPhoneCode(e.target.value)}
                maxLength={6}
                className="text-center tracking-[0.5em] font-mono text-xl"
              />
              <Button onClick={() => handleVerify("PHONE")} disabled={loading || phoneCode.length < 6} variant="outline">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Шалгах"}
              </Button>
            </div>
          )}

          {!phoneVerified && (
            <button 
              onClick={() => handleResend("PHONE")} 
              disabled={!!resending}
              className="mt-3 text-xs text-blue-600 hover:underline flex items-center gap-1 mx-auto"
            >
              {resending === "PHONE" ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              Дахин код илгээх
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">
        <Suspense fallback={
          <div className="flex flex-col items-center py-10">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500">Түр хүлээнэ үү...</p>
          </div>
        }>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
