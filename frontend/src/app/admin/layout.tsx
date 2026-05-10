import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 dark:bg-slate-950/50">
        
        {/* Simple top bar for mobile or profile */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
          <h1 className="font-bold text-slate-900 dark:text-white md:hidden">Mind Bridge Admin</h1>
          <div className="hidden md:block">
            <span className="text-sm text-slate-500">Системийн хяналт</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Супер Админ</p>
                 {/* Status removed */}
              </div>
              <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm ring-2 ring-white cursor-pointer shadow-sm">
                 A
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
