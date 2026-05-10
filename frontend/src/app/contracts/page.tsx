"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FileText, CheckCircle2, Clock, XCircle, ChevronRight, AlertCircle, Briefcase } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ContractsPage() {
  const { data: session } = useSession();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/contracts")
      .then(res => res.json())
      .then(data => {
        if (data.contracts) setContracts(data.contracts);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "COMPLETED": return <FileText className="w-5 h-5 text-blue-500" />;
      case "CANCELLED": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE": return "Идэвхтэй";
      case "COMPLETED": return "Дууссан";
      case "CANCELLED": return "Цуцлагдсан";
      default: return status;
    }
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Нэвтрэх шаардлагатай</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Миний Гэрээнүүд</h1>
          <p className="text-slate-500 mt-2">Бүх идэвхтэй болон дууссан ажлын гэрээнүүд.</p>
        </div>
        <div className="hidden md:block">
          <div className="bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5" /> {contracts.filter(c => c.status === 'ACTIVE').length} Идэвхтэй
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : contracts.length > 0 ? (
        <div className="grid gap-4">
          {contracts.map((contract) => (
            <div key={contract.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      contract.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {getStatusLabel(contract.status)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">#{contract.id.slice(0, 8)}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {contract.job.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Партнер: <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {contract.client?.user?.full_name || contract.freelancer?.user?.full_name}
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900 dark:text-white">₮{contract.agreed_amount.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter mt-1">Нийт хөлс</p>
                  </div>
                  <Link href={`/contracts/${contract.id}`}>
                    <Button variant="outline" size="sm" className="group/btn">
                      Дэлгэрэнгүй <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Одоогоор гэрээ байхгүй байна</h3>
          <p className="text-slate-500 mt-2 max-w-sm mx-auto">Та ажил зарлах эсвэл санал илгээж гэрээ байгуулах боломжтой.</p>
        </div>
      )}
    </div>
  );
}
