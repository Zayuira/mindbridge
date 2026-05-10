import Link from "next/link";
import { BrainCircuit, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              <span className="text-xl font-bold">Mind Bridge</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              AI технологиор баяжуулсан Монголын анхны фрилансеруудын ухаалаг платформ.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Клиентэд</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/jobs/create" className="hover:text-blue-600 transition-colors">Ажил оруулах</Link></li>
              <li><Link href="/freelancers" className="hover:text-blue-600 transition-colors">Фрилансер хайх</Link></li>
              <li><Link href="/how-to-hire" className="hover:text-blue-600 transition-colors">Хэрхэн хөлслөх вэ?</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Фрилансерт</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li><Link href="/jobs" className="hover:text-blue-600 transition-colors">Ажил хайх</Link></li>
              <li><Link href="/profile/edit" className="hover:text-blue-600 transition-colors">Профайл үүсгэх</Link></li>
              <li><Link href="/how-to-work" className="hover:text-blue-600 transition-colors">Хэрхэн ажиллах вэ?</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Холбогдох</h3>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li>Улаанбаатар хот</li>
              <li>info@mindbridge.mn</li>
              <li>+976 88000000</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
