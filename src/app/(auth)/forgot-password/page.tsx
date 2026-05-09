"use client";

import Link from "next/link";
import { KeyRound, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-8">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center mb-4">
            <KeyRound className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Нууц үг сэргээх</h1>
          <p className="text-sm text-slate-500 mt-2 text-center text-balance">
            Бүртгэлтэй и-мэйл хаягаа оруулж нууц үг сэргээх холбоос хүлээн авна уу.
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">И-мэйл хаяг</label>
            <Input 
              type="email" 
              placeholder="name@example.com" 
              icon={<Mail className="w-4 h-4" />}
            />
          </div>

          <Button variant="primary" className="w-full mt-6 py-6 font-semibold" type="submit">
            Сэргээх холбоос авах
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" /> Буцах
          </Link>
        </div>
      </div>
    </div>
  );
}
