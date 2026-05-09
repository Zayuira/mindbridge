"use client";

import { LogOut, X, AlertTriangle } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export function LogoutButton() {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        className="flex items-center text-slate-400 hover:text-red-500 transition-colors ml-2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        title="Гарах"
        aria-label="Системээс гарах"
      >
        <LogOut className="w-5 h-5" />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 translate-y-12">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Системээс гарах уу?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
                Та системээс гарахдаа итгэлтэй байна уу? Таны хийж буй амжаагүй үйлдлүүд хадгалагдахгүй байх магадлалтай.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors"
                >
                  Болих
                </button>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-red-500/20"
                >
                  Гарах
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
