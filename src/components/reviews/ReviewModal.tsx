"use client";

import { useState } from "react";
import { Star, X, MessageSquareQuote, User } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function ReviewModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-50 overflow-hidden border border-slate-200 dark:border-slate-800">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquareQuote className="w-5 h-5 text-blue-600" /> Үнэлгээ өгөх
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-3xl mx-auto border-2 border-white dark:border-slate-800 shadow-sm mb-4">
              <User className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">Бат-Эрдэнэ Д.</h4>
            <p className="text-sm text-slate-500">"E-Commerce Вебсайт хийлгэнэ" төсөл дээр ажилласан.</p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Ерөнхий үнэлгээ</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star 
                    className={`w-10 h-10 transition-colors ${
                      (hoveredRating || rating) >= star 
                        ? "fill-yellow-400 text-yellow-500 drop-shadow-sm" 
                        : "fill-slate-100 text-slate-300 dark:fill-slate-800 dark:text-slate-700"
                    }`} 
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-medium text-slate-500 mt-2 h-4">
              {rating > 0 && (
                ["Муу", "Хангалтгүй", "Дундаж", "Сайн", "Маш сайн"][rating - 1]
              )}
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Сэтгэгдэл (Заавал биш)</label>
            <textarea 
              className="flex w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus-visible:ring-blue-500 transition-shadow min-h-[120px]"
              placeholder="Хамтын ажиллагааны талаарх дэлгэрэнгүй сэтгэгдлээ үлдээнэ үү..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button variant="outline" className="w-full py-6 font-semibold rounded-xl" onClick={onClose}>
              Дараа болъё
            </Button>
            <Button variant="primary" className="w-full py-6 font-semibold rounded-xl" disabled={rating === 0}>
              Үнэлгээ илгээх
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

// Example wrapper to test the modal easily on the frontend
export function ReviewModalDemo() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        Үнэлгээний цонх нээх
      </Button>
      <ReviewModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
