"use client";

import { Activity, Server, Database, HardDrive, Cpu, AlertTriangle, ShieldAlert } from "lucide-react";

export default function AdminSystemPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Систем хяналт</h1>
        <p className="text-slate-500 text-sm mt-1">Серверийн үзүүлэлтүүд, AI хөдөлгүүрийн төлөв болон өгөгдлийн сангийн эрүүл мэнд.</p>
      </div>

      {/* Systems Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { name: "Үндсэн Сервер", status: "Хэвийн", load: "34%", icon: <Server className="w-5 h-5" /> },
          { name: "Өгөгдлийн Сан", status: "Хэвийн", load: "12%", icon: <Database className="w-5 h-5" /> },
          { name: "Mind Bridge AI", status: "Ачаалал ихтэй", load: "89%", icon: <Cpu className="w-5 h-5" /> },
          { name: "Storage Bucket", status: "Хэвийн", load: "56%", icon: <HardDrive className="w-5 h-5" /> }
        ].map((sys, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sys.status === 'Хэвийн' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' : 'bg-orange-50 text-orange-600 dark:bg-orange-900/30'}`}>
                {sys.icon}
              </div>
              <div className={`px-2 py-1 rounded-md text-[10px] font-bold ${sys.status === 'Хэвийн' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-800/40 dark:text-emerald-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-800/40 dark:text-orange-300'}`}>
                {sys.status}
              </div>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">{sys.name}</h3>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${parseInt(sys.load) > 80 ? 'bg-orange-500' : 'bg-emerald-500'}`} 
                  style={{ width: sys.load }}
                ></div>
              </div>
              <span className="text-xs font-bold text-slate-500">{sys.load}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-time Logs View */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden flex flex-col h-[400px]">
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
            <h3 className="font-mono text-sm text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Terminal / Live Logs
            </h3>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
              <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            </div>
          </div>
          <div className="p-4 flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-slate-300 space-y-1">
            <p><span className="text-slate-500">[2026-03-20 02:40:15]</span> <span className="text-blue-400">INFO:</span> User U153 authenticated successfully.</p>
            <p><span className="text-slate-500">[2026-03-20 02:40:22]</span> <span className="text-blue-400">INFO:</span> New job listing POST /api/jobs (Client C42)</p>
            <p><span className="text-slate-500">[2026-03-20 02:40:40]</span> <span className="text-purple-400">SYS:</span> AI Matching Model invoked for Job ID 884</p>
            <p><span className="text-slate-500">[2026-03-20 02:40:45]</span> <span className="text-emerald-400">SUCCESS:</span> Generated 15 proposals predictions. Cache updated.</p>
            <p><span className="text-slate-500">[2026-03-20 02:41:02]</span> <span className="text-orange-400">WARN:</span> High memory usage predicted in 5 mins. Scaling worker nodes.</p>
            <p><span className="text-slate-500">[2026-03-20 02:41:10]</span> <span className="text-blue-400">INFO:</span> Node instance #4 deployed.</p>
            <div className="animate-pulse text-emerald-500 mt-2">_</div>
          </div>
        </div>

        {/* Security / Alerts List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Аюулгүй байдал & Мэдэгдлүүд</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-orange-200 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-950/20 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-orange-900 dark:text-orange-300">Токапын сунгалт шаардлагатай!</h4>
                <p className="text-xs text-orange-800 dark:text-orange-400/80 mt-1">AWS дата сангийн Storage 85% хүрсэн тул маргаашийн дотор өргөтгөх шаардлагатай.</p>
              </div>
            </div>
            
            <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-3">
              <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Шинэ нэвтрэх оролдлого</h4>
                <p className="text-xs text-slate-500 mt-1">Оршин суугаа хаягаа өөрчилсөн IP: 192.168.1.1 хаягаас админ руу хандсан.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
