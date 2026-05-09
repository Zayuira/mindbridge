"use client";

import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard, History, Plus, QrCode } from "lucide-react";
import { Button } from "@/components/ui/Button";

const TRANSACTIONS = [
  { id: 1, type: "out", title: "E-Commerce Вебсайт төсөл (Урьдчилгаа)", amount: "₮1,500,000", date: "2026.03.18 14:30", status: "Амжилттай" },
  { id: 2, type: "in", title: "Цэнэглэлт (QPay)", amount: "₮3,000,000", date: "2026.03.18 10:15", status: "Амжилттай" },
  { id: 3, type: "out", title: "UI Дизайн төсөл", amount: "₮800,000", date: "2026.03.10 09:00", status: "Амжилттай" },
  { id: 4, type: "in", title: "Банкны шилжүүлэг (Голомт)", amount: "₮1,000,000", date: "2026.03.05 16:45", status: "Амжилттай" },
];

export default function PaymentsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Төлбөр ба Түрийвч</h1>
        <p className="text-slate-500 mt-2">Таны гүйлгээний түүх мөн Үлдэгдлийн мэдээлэл.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side - Wallet Cards */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Main Wallet Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wallet className="w-32 h-32 transform rotate-12 -translate-y-12 translate-x-8" />
            </div>
            
            <p className="text-blue-100 font-medium mb-1 relative z-10">Боломжит үлдэгдэл</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 relative z-10">₮1,700,000</h2>
            
            <div className="flex gap-3 relative z-10">
              <Button className="flex-1 bg-white text-blue-600 hover:bg-slate-50 font-bold border-none transition-transform hover:scale-105 active:scale-95">
                <Plus className="w-4 h-4 mr-2" /> Цэнэглэх
              </Button>
              <Button className="flex-1 bg-blue-800/50 hover:bg-blue-800/70 text-white font-bold border-none transition-transform hover:scale-105 active:scale-95 backdrop-blur-sm">
                Гаргах
              </Button>
            </div>
          </div>

          {/* Connected Methods */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-slate-400" /> Төлбөрийн хэрэгсэл
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-900/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-lg shadow-sm flex items-center justify-center font-bold text-blue-600 border border-slate-100 dark:border-slate-700">QPay</div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">QPay холбогдсон</p>
                    <p className="text-xs text-slate-500">Шууд гүйлгээ хийх боломжтой</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">Салгах</button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-dashed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 border-dashed">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Банкны карт холбох</p>
                    <p className="text-xs text-slate-500">Автомат төлбөрт ашиглах</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Transaction History */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-full">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-slate-400" /> Гүйлгээний түүх
              </h3>
              <select className="text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 font-medium text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Сүүлийн 30 хоног</option>
                <option>Энэ онд</option>
                <option>Бүх түүх</option>
              </select>
            </div>
            
            <div className="p-6">
              {TRANSACTIONS.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 mx-auto text-slate-200 dark:text-slate-800 mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">Гүйлгээний түүх байхгүй байна.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {TRANSACTIONS.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-transform group-hover:scale-110 ${
                          tx.type === "in" 
                            ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30" 
                            : "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800/30"
                        }`}>
                          {tx.type === "in" ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-base">{tx.title}</p>
                          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mt-0.5">
                            <span>{tx.date}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="text-emerald-600 dark:text-emerald-500">{tx.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`font-bold text-lg ${tx.type === "in" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"}`}>
                        {tx.type === "in" ? "+" : "-"}{tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
