import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BrainCircuit, MessageSquare, UserCircle, LogOut } from "lucide-react";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { LogoutButton } from "@/components/layout/LogoutButton";

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <div className="flex gap-2 items-center mr-8">
          <BrainCircuit className="h-6 w-6 text-blue-600 dark:text-blue-500" />
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Mind Bridge
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link href="/jobs" className="hover:text-blue-600 transition-colors">Ажлын зарууд</Link>
          <Link href="/freelancers" className="hover:text-blue-600 transition-colors">Фрилансерүүд</Link>
          <Link href="/how-to-work" className="hover:text-blue-600 transition-colors">Хэрхэн ажиллах вэ?</Link>
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-4">
            
            {session ? (
              <>
                <Link href="/messages" className="text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors p-2">
                  <MessageSquare className="w-5 h-5" />
                </Link>
                
                <NotificationDropdown />

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      {session.user?.name}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {(session.user as any)?.role === "CLIENT" ? "Клиент" : "Фрилансер"}
                    </span>
                  </div>
                  
                  <Link href="/profile">
                    <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors cursor-pointer">
                      <UserCircle className="w-5 h-5" />
                    </div>
                  </Link>
                  
                  {/* Use Client Component for seamless sign out without ugly built-in NextAuth page */}
                  <LogoutButton />
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-flex">
                  <Button variant="ghost">Нэвтрэх</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary">Бүртгүүлэх</Button>
                </Link>
              </>
            )}
            
          </nav>
        </div>
      </div>
    </header>
  );
}
