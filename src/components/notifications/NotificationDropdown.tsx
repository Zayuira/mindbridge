"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    { id: 1, text: "Таны 'E-Commerce Вебсайт' ажилд шинэ санал ирлээ.", time: "10 минутын өмнө", unread: true },
    { id: 2, text: "Ажлын гүйцэтгэлийг баталгаажуулж төлбөр шилжлээ.", time: "2 цагийн өмнө", unread: false },
    { id: 3, text: "Бат-Эрдэнэ танд зурвас илгээлээ.", time: "Өчигдөр", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 rounded-full transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
              <h3 className="font-bold text-slate-900 dark:text-white">Мэдэгдэл</h3>
              {unreadCount > 0 && (
                <button className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">Бүгдийг уншсан</button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notif) => (
                <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${notif.unread ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                  <p className="text-sm text-slate-800 dark:text-slate-200 line-clamp-2">{notif.text}</p>
                  <span className="text-xs text-slate-400 mt-2 block">{notif.time}</span>
                </div>
              ))}
            </div>

            <div className="p-3 text-center border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
              <button className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium">
                Бүх мэдэгдлийг харах
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
