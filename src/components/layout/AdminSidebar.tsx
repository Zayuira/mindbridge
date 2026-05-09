import Link from "next/link";
import { LayoutDashboard, Users, Briefcase, CreditCard, AlertTriangle, Settings, LogOut, BrainCircuit, Server } from "lucide-react";

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 text-slate-300 flex flex-col h-full sticky top-0 left-0 hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center space-x-2 text-white">
          <BrainCircuit className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold tracking-tight">Mind Bridge Admin</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
        <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-blue-600/10 text-blue-500 font-medium transition-colors">
          <LayoutDashboard className="w-5 h-5" /> Дашбоард
        </Link>
        <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <Users className="w-5 h-5" /> Хэрэглэгчид
        </Link>
        <Link href="/admin/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <Briefcase className="w-5 h-5" /> Ажлын зарууд
        </Link>
        <Link href="/admin/payments" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <CreditCard className="w-5 h-5" /> Төлбөр тооцоо
        </Link>
        <Link href="/admin/reports" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <AlertTriangle className="w-5 h-5" /> Санал, Гомдол
        </Link>
        <Link href="/admin/system" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
          <Server className="w-5 h-5 text-emerald-400" /> Систем хяналт
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 transition-colors">
          <Settings className="w-5 h-5" /> Тохиргоо
        </Link>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-500/10 w-full text-left transition-colors font-medium">
          <LogOut className="w-5 h-5" /> Гарах
        </button>
      </div>
    </aside>
  );
}
