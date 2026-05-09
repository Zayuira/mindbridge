"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Search, Send, MoreVertical, Paperclip, User, Briefcase, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";

function MessagesContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [msgText, setMsgText] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesCountRef = useRef(0);
  const userId = (session?.user as any)?.id;
  
  const partnerIdParam = searchParams.get("partnerId");
  const jobIdParam = searchParams.get("jobId");

  // Fetch conversations list
  const fetchConversations = useCallback(async (isInitial = false) => {
    if (!session?.user) return;
    try {
      const r = await fetch("/api/messages");
      const data = await r.json();
      const convs = data.conversations || [];
      setConversations(convs);
      
      if (isInitial) {
        setLoading(false);
        // Handle auto-selection from URL
        if (partnerIdParam && jobIdParam) {
          const existing = convs.find(
            (c: any) => 
              c.job_id === jobIdParam && 
              (c.sender_id === partnerIdParam || c.receiver_id === partnerIdParam)
          );

          if (existing) {
            setActiveConv(existing);
          } else {
            // Shadow mode: get partner name
            const userRes = await fetch(`/api/admin/users`);
            const userData = await userRes.json();
            const partner = userData.users?.find((u: any) => u.id === partnerIdParam);
            setActiveConv({
              isShadow: true,
              job_id: jobIdParam,
              sender_id: userId,
              receiver_id: partnerIdParam,
              receiver: {
                full_name: partner?.name || "Хэрэглэгч",
                role: partner?.role === 'Клиент' ? 'CLIENT' : 'FREELANCER'
              },
              job: { title: "Шинэ харилцан яриа" }
            });
          }
        }
      }
    } catch (e) {
      console.error(e);
      if (isInitial) setLoading(false);
    }
  }, [session, partnerIdParam, jobIdParam, userId]);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(async (isAutoScroll = false) => {
    if (!activeConv || !session || activeConv.isShadow) return;
    
    const otherId = activeConv.sender_id === userId ? activeConv.receiver_id : activeConv.sender_id;
    const jobId = activeConv.job_id;

    try {
      const r = await fetch(`/api/messages?partnerId=${otherId}&jobId=${jobId}`);
      const d = await r.json();
      const newMessages = d.messages || [];
      
      setMessages(newMessages);

      // Only scroll if message count changed
      if (newMessages.length > messagesCountRef.current || isAutoScroll) {
        messagesCountRef.current = newMessages.length;
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeConv, session, userId]);

  // Initial Load
  useEffect(() => {
    fetchConversations(true);
  }, [fetchConversations]);

  // Polling Intervals
  useEffect(() => {
    if (!session?.user) return;
    
    // Refresh list every 8s
    const listInterval = setInterval(() => fetchConversations(), 8000);
    
    // Refresh active chat every 3s
    let chatInterval: NodeJS.Timeout;
    if (activeConv && !activeConv.isShadow) {
      chatInterval = setInterval(() => fetchMessages(), 3000);
    }

    return () => {
      clearInterval(listInterval);
      if (chatInterval) clearInterval(chatInterval);
    };
  }, [session, activeConv, fetchConversations, fetchMessages]);

  // Fetch messages when activeConv changes
  useEffect(() => {
    messagesCountRef.current = 0; // Reset count to force scroll on initial load of chat
    fetchMessages(true);
  }, [activeConv, fetchMessages]);

  const handleSend = async () => {
    if (!msgText.trim() || !activeConv) return;

    const otherId = activeConv.sender_id === userId ? activeConv.receiver_id : activeConv.sender_id;
    
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          receiverId: otherId, 
          jobId: activeConv.job_id, 
          content: msgText 
        }),
      });

      const data = await res.json();
      setSending(false);

      if (res.ok) {
        setMessages((prev) => [...prev, data.message]);
        setMsgText("");
        messagesCountRef.current += 1;
        
        // Elevate shadow to real conversation
        if (activeConv.isShadow) {
          setActiveConv({ 
            ...activeConv, 
            isShadow: false, 
            sender_id: data.message.sender_id, 
            receiver_id: data.message.receiver_id 
          });
          fetchConversations();
        }

        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch (e) {
      setSending(false);
    }
  };

  const getAvatar = (role: string) => {
    return role === "CLIENT" ? <Briefcase className="w-5 h-5 text-slate-400" /> : <User className="w-6 h-6 text-slate-400" />;
  };

  const getDisplayName = (conv: any) => {
    if (!conv) return "Чат";
    if (conv.sender_id === userId) return conv.receiver?.full_name || "Хэрэглэгч";
    return conv.sender?.full_name || "Хэрэглэгч";
  };

  const getRole = (conv: any) => {
    if (conv.sender_id === userId) return conv.receiver?.role;
    return conv.sender?.role;
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium tracking-wide">Зурвасуудыг ачаалж байна...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-md">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-6 opacity-80" />
          <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Нэвтрэх шаардлагатай</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">Зурвас харахын тулд та системд нэвтэрсэн байх ёстой.</p>
          <Link href="/login" className="block w-full">
            <Button variant="primary" className="w-full py-4 font-bold">Нэвтрэх</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 h-[calc(100vh-64px)] w-full">
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200/60 dark:border-slate-800/60 flex h-[calc(100vh-200px)] min-h-[650px] overflow-hidden lg:grid lg:grid-cols-[380px_1fr]">

        {/* Sidebar */}
        <div className="w-full lg:w-auto border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col bg-slate-50/40 dark:bg-slate-950/40 backdrop-blur-xl">
          <div className="p-6 border-b border-slate-200/60 dark:border-slate-800/60">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-5 tracking-tight">Зурвасууд</h2>
            <div className="relative group">
              <Input 
                placeholder="Хайх..." 
                icon={<Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />} 
                className="bg-white dark:bg-slate-900 border-slate-200 h-11 rounded-xl" 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.length === 0 && !activeConv?.isShadow && (
              <div className="text-center p-12">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                  <MessageSquare className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-400 italic">Одоогоор зурвас алга.</p>
              </div>
            )}
            
            {/* Show shadow conversation at top */}
            {activeConv?.isShadow && (
              <div className="flex gap-4 p-5 border-b border-slate-100 dark:border-slate-800/40 cursor-pointer bg-blue-50/60 dark:bg-blue-900/10 border-l-[6px] border-l-blue-600 shadow-sm animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-md border border-slate-100 dark:border-slate-700">
                  {getAvatar(getRole(activeConv) || "")}
                </div>
                <div className="flex-1 overflow-hidden pt-1">
                  <h4 className="font-bold text-slate-900 dark:text-white truncate text-lg mb-1">{getDisplayName(activeConv)}</h4>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" /> Шинэ чат
                  </p>
                </div>
              </div>
            )}

            {conversations.map((conv) => {
              const isActive = activeConv?.job_id === conv.job_id && activeConv?.sender_id === conv.sender_id;
              return (
              <div
                key={`${conv.sender_id}_${conv.receiver_id}_${conv.job_id}`}
                onClick={() => setActiveConv(conv)}
                className={`flex gap-4 p-5 border-b border-slate-100/50 dark:border-slate-800/30 cursor-pointer transition-all hover:bg-white dark:hover:bg-slate-900 ${isActive ? "bg-white dark:bg-slate-900 border-l-[6px] border-l-blue-600 shadow-inner" : "border-l-[6px] border-l-transparent"}`}
              >
                <div className="relative shrink-0">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-md border transition-all ${isActive ? "bg-blue-50 dark:bg-blue-950 border-blue-100" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"}`}>
                    {getAvatar(getRole(conv) || "")}
                  </div>
                  {/* Status dot removed */}
                </div>
                <div className="flex-1 overflow-hidden pt-0.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate text-base">{getDisplayName(conv)}</h4>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                      {conv.createdAt ? new Date(conv.createdAt).toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 truncate leading-relaxed line-clamp-1">{conv.content}</p>
                  {conv.job && <p className="text-[11px] font-bold text-blue-500/80 truncate mt-1.5 flex items-center gap-1"><Briefcase className="w-3 h-3" /> {conv.job.title}</p>}
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex-col hidden lg:flex bg-white dark:bg-slate-900 relative">
          {!activeConv ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center opacity-40">
                <MessageSquare className="w-10 h-10" />
              </div>
              <p className="font-bold tracking-tight text-lg">Харилцан яриагаа сонгоно уу</p>
              <p className="text-sm">Зүүн талын цэснээс сонгох эсвэл шинээр эхлүүлнэ үү.</p>
            </div>
          ) : (
            <>
              <header className="h-20 px-8 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20 sticky top-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shadow-inner text-blue-600 dark:text-blue-400 border border-blue-100/50">
                    {getAvatar(getRole(activeConv) || "")}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-lg tracking-tight leading-none mb-1">{getDisplayName(activeConv)}</h3>
                    <div className="flex items-center gap-2">
                       {/* Status dot removed */}
                       <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{activeConv.job?.title || "Харилцан яриа"}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </button>
                  <button className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto p-8 space-y-6 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.03),transparent)] dark:bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.05),transparent)]">
                {messages.length === 0 && !activeConv.isShadow && (
                  <div className="flex flex-col items-center justify-center py-20 opacity-30 grayscale">
                    <Loader2 className="w-10 h-10 animate-spin mb-4" />
                    <p className="font-bold">Зурвасуудыг ачаалж байна...</p>
                  </div>
                )}
                {messages.map((m: any) => {
                  const isMe = m.sender_id === userId;
                  return (
                    <div key={m.id} className={`flex items-end gap-3 ${isMe ? "justify-end" : "justify-start animate-in slide-in-from-left-4 duration-300"}`}>
                      {!isMe && (
                        <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center shadow-sm">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                      )}
                      <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1.5`}>
                        <div className={`px-4 py-3 rounded-2xl text-sm shadow-md transition-all ${isMe ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-br-none hover:shadow-lg" : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none hover:shadow-lg"}`}>
                          {m.content}
                        </div>
                        <span className={`text-[9px] font-black text-slate-400 uppercase tracking-tighter px-1 ${isMe ? "text-right" : ""}`}>
                          {m.createdAt ? new Date(m.createdAt).toLocaleTimeString("mn-MN", { hour: "2-digit", minute: "2-digit" }) : ""}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} className="h-4" />
              </main>

              <footer className="p-6 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md relative z-20">
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-2 rounded-[1.25rem] border border-slate-200/50 dark:border-slate-800/50 focus-within:border-blue-500/50 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
                  <button className="w-11 h-11 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-white dark:hover:bg-slate-900 transition-all flex items-center justify-center shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Зурвас бичих..."
                    className="flex-1 bg-transparent border-none focus:ring-0 px-2 py-3 text-sm font-medium placeholder:text-slate-400"
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                  />
                  <button
                    className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-30 disabled:hover:scale-100 shrink-0"
                    onClick={handleSend}
                    disabled={sending || !msgText.trim()}
                  >
                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
                  </button>
                </div>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const MessageSquare = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">Ачаалж байна</p>
      </div>
    }>
      <MessagesContent />
    </Suspense>
  );
}
