"use client";

import { Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminReportsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Тайлан ба Аналитик</h1>
          <p className="text-slate-500 text-sm mt-1">Санхүү болон платформын өсөлтийн дэлгэрэнгүй тоо баримтууд.</p>
        </div>
        <Button variant="outline" className="h-10 px-4 flex items-center gap-2 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <Download className="w-4 h-4" /> CSV Татах
        </Button>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">Нийт орлого (Сүүлийн 30 хоног)</h3>
          <div className="flex items-end gap-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">₮14.5M</h2>
            <span className="flex items-center text-sm font-bold text-emerald-600 mb-1.5"><TrendingUp className="w-4 h-4 mr-1" /> +18.2%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">Шинэ хэрэглэгч</h3>
          <div className="flex items-end gap-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">342</h2>
            <span className="flex items-center text-sm font-bold text-emerald-600 mb-1.5"><TrendingUp className="w-4 h-4 mr-1" /> +5.4%</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
          <h3 className="text-sm font-medium text-slate-500 mb-2">Цуцлагдсан төсөл</h3>
          <div className="flex items-end gap-4">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">12</h2>
            <span className="flex items-center text-sm font-bold text-red-500 mb-1.5"><TrendingDown className="w-4 h-4 mr-1" /> -2.1%</span>
          </div>
        </div>
      </div>

      {/* Fake Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Орлогын хандлага</h3>
          <div className="h-64 flex items-end justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 relative">
            {/* Mock Chart Bars */}
            {[40, 65, 45, 80, 95, 75, 110].map((height, i) => (
              <div key={i} className="w-full relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₮{(height/10).toFixed(1)}M</div>
                <div style={{ height: `${height}%` }} className="bg-blue-600 dark:bg-blue-500 rounded-t-sm w-full mx-1 md:mx-2 hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs font-medium text-slate-400">
            <span>Даваа</span>
            <span>Мягмар</span>
            <span>Лхагва</span>
            <span>Пүрэв</span>
            <span>Баасан</span>
            <span>Бямба</span>
            <span>Ням</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Хэрэглэгчийн идэвх</h3>
          <div className="space-y-4">
            {/* Mock Progress Bars */}
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-700 dark:text-slate-300"><span>Ажлын зар нийтэлсэн</span> <span className="font-bold">45%</span></div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-700 dark:text-slate-300"><span>Санал илгээсэн</span> <span className="font-bold">78%</span></div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1 text-slate-700 dark:text-slate-300"><span>AI-аар батлагдсан</span> <span className="font-bold">32%</span></div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
