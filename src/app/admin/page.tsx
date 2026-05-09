"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, Briefcase, DollarSign, TrendingUp, AlertCircle, CheckCircle2, Clock, ArrowRight } from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  users: <Users className="w-6 h-6 text-blue-500" />,
  revenue: <DollarSign className="w-6 h-6 text-purple-500" />,
  jobs: <Briefcase className="w-6 h-6 text-emerald-500" />,
  freelancers: <CheckCircle2 className="w-6 h-6 text-orange-500" />,
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [internalStats, setInternalStats] = useState<any>({ recentPayments: [], unverifiedCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(async res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, we haven't got JSON!");
        }
        return res.json();
      })
      .then(data => {
        if (data.stats) setStats(data.stats);
        if (data.internalStats) setInternalStats(data.internalStats);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">Самбар <LayoutDashboard className="w-8 h-8 text-blue-500" /></h1>
        <p className="text-slate-500 mt-2 text-sm md:text-base">Mind Bridge платформын ерөнхий статистик болон үйл ажиллагаа.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse h-32"></div>
          ))
        ) : (
          stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  {ICON_MAP[stat.type] || <TrendingUp className="w-6 h-6" />}
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${stat.shift.includes('+') ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'bg-orange-50 text-orange-600 dark:bg-slate-800'}`}>
                  {stat.shift}
                </span>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                <h3 className="text-sm font-medium text-slate-500 mt-1">{stat.title}</h3>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Transactions List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Сүүлийн гүйлгээнүүд
            </h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1">Бүгдийг харах <ArrowRight className="w-4 h-4" /></button>
          </div>
          
          <div className="space-y-4">
            {internalStats.recentPayments.length > 0 ? (
              internalStats.recentPayments.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 flex items-center justify-center font-bold">₮</div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 transition-colors">Төслийн хөлс · ₮{p.amount.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{p.clientName} - QPay</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-1 rounded">{p.status === 'PAID' ? 'Амжилттай' : p.status}</span>
                    <p className="text-[10px] text-slate-400 mt-1.5">{new Date(p.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-center py-8">Гүйлгээ байхгүй байна.</p>
            )}
          </div>
        </div>

        {/* Action Required Items */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Шийдвэрлэх шаардлагатай</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-orange-50 dark:bg-orange-950/30 rounded-xl border border-orange-100 dark:border-orange-900/40">
                <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-orange-900 dark:text-orange-200 mb-1">Маргаантай төсөл</h4>
                  <p className="text-xs text-orange-800/80 dark:text-orange-300/80 leading-relaxed mb-3">Клиент өгсөн ажлын явцтай санал нийлээгүй байна. ID: #4829</p>
                  <button className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 hover:underline">Шийдвэрлэх</button>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
                <Clock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">KYC Баталгаажуулалт</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{internalStats.unverifiedCount} шинэ хэрэглэгч бичиг баримтаа явуулж хүлээгдэж байна.</p>
                  <Link href="/admin/users">
                    <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline">Шалгах</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
