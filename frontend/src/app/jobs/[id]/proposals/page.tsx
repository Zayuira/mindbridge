"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";
import { 
  ArrowLeft, BrainCircuit, CheckCircle, MessageSquare, 
  ExternalLink, User, XCircle, Loader2, Sparkles, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSession } from "next-auth/react";

export default function ProposalsDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchProposals();
  }, [id]);

  const fetchProposals = async () => {
    try {
      const response = await fetch(`/api/proposals?jobId=${id}`);
      const data = await response.json();
      if (data.proposals) {
        setProposals(data.proposals);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (proposalId: string, status: "ACCEPTED" | "REJECTED") => {
    if (!confirm(`Энэ саналыг ${status === 'ACCEPTED' ? 'зөвшөөрөх' : 'татгалзах'}даа итгэлтэй байна уу?`)) return;
    
    setActionLoading(proposalId);
    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        alert(status === 'ACCEPTED' ? "Амжилттай баталгаажлаа. Гэрээ үүслээ." : "Татгалзлаа.");
        fetchProposals();
      } else {
        const error = await response.json();
        alert(`Алдаа: ${error.error}`);
      }
    } catch (error) {
      alert("Сервертэй холбогдоход алдаа гарлаа.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500">Уншиж байна...</p>
      </div>
    );
  }

  const jobTitle = proposals.length > 0 ? proposals[0].job?.title : "Ажил";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href={`/jobs/${id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Ажлын дэлгэрэнгүй рүү буцах
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ирсэн саналууд</h1>
          <p className="text-slate-500 mt-2">
            "{jobTitle}" ажилд нийт {proposals.length} хүн санал илгээсэн байна.
          </p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800/30 px-4 py-3 rounded-xl flex items-center gap-3">
          <BrainCircuit className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <div className="text-sm">
            <span className="block font-bold text-indigo-900 dark:text-indigo-100">Mind Bridge Smart Sort</span>
            <span className="text-indigo-600 dark:text-indigo-300">Таарцаар нь эрэмбэлсэн байна</span>
          </div>
        </div>
      </div>

      {proposals.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Санал ирээгүй байна</h2>
          <p className="text-slate-500">Одоогоор энэ ажилд хэн нэгэн санал илгээгээгүй байна.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {proposals.sort((a, b) => (b.ai_relevance_score || 0) - (a.ai_relevance_score || 0)).map((proposal) => (
            <div 
              key={proposal.id} 
              className={`bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border ${proposal.status === 'ACCEPTED' ? 'border-green-500 shadow-green-100' : 'border-slate-200 dark:border-slate-800'} transition-all hover:shadow-md relative overflow-hidden group`}
            >
              {proposal.status === 'ACCEPTED' && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 rounded-bl-xl text-[10px] font-semibold tracking-wider">
                  БАТАЛГААЖСАН
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Freelancer Summary */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-xl border border-slate-200 dark:border-slate-700">
                        <User className="w-6 h-6 text-slate-400" />
                      </div>
                      <div>
                        <Link href={`/freelancers/${proposal.freelancer?.id}`} className="hover:text-blue-600 transition-colors">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {proposal.freelancer?.user?.full_name || "Нэр тодорхойгүй"} 
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <ExternalLink className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </h3>
                        </Link>
                        <p className="text-sm text-slate-500">{proposal.freelancer?.title || "Freelancer"}</p>
                      </div>
                    </div>
                    
                    {/* AI Score Badge */}
                    <div className="flex flex-col items-end">
                      <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                        {Math.round((proposal.ai_relevance_score || 0.8) * 100)}%
                      </div>
                      <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">AI ТААРЦ</span>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold block mb-1">Нүүр захиа:</span>
                    "{proposal.cover_letter}"
                  </div>
                </div>

                {/* Action Column */}
                <div className="lg:w-64 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-slate-500">Үнийн санал:</span>
                      <span className="font-bold text-slate-900 dark:text-white">₮{proposal.bid_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Огноо:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{new Date(proposal.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3 mt-6">
                    {proposal.status === 'PENDING' ? (
                      <>
                        <Button 
                          variant="primary" 
                          className="w-full h-11 font-bold shadow-md"
                          onClick={() => handleStatusUpdate(proposal.id, 'ACCEPTED')}
                          disabled={!!actionLoading}
                        >
                          {actionLoading === proposal.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Баталгаажуулах"}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full text-red-600 border-red-100 hover:bg-red-50"
                          onClick={() => handleStatusUpdate(proposal.id, 'REJECTED')}
                          disabled={!!actionLoading}
                        >
                          Татгалзах
                        </Button>
                      </>
                    ) : (
                      <div className={`text-center py-2 rounded-xl text-[10px] font-semibold uppercase tracking-wider ${proposal.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {proposal.status === 'ACCEPTED' ? 'Гэрээ байгуулагдсан' : 'Татгалзсан'}
                      </div>
                    )}
                    
                    <Link href={`/messages?partnerId=${proposal.freelancer?.user?.id}&jobId=${id}`} className="block w-full">
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Чат бичих
                      </Button>
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
