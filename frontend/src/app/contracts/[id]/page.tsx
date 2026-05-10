"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { FileText, CheckCircle2, AlertCircle, Calendar, DollarSign, User, ShieldCheck, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function ContractDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/contracts/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.contract) setContract(data.contract);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleStatusUpdate = async (newStatus: "ACTIVE" | "COMPLETED") => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/contracts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const data = await res.json();
        setContract(data.contract);
        alert(newStatus === "ACTIVE" ? "Гэрээг баталгаажууллаа!" : "Ажлыг дуусгалаа!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Гэрээний мэдээллийг ачаалж байна...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold">Гэрээ олдсонгүй</h2>
        <Link href="/contracts" className="mt-4 inline-block text-blue-600">Буцах</Link>
      </div>
    );
  }

  const isClient = session?.user?.id === contract.client?.user?.id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/contracts" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Гэрээнүүд рүү буцах
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{contract.job?.title}</h1>
                <p className="text-sm text-slate-500">Гэрээний дугаар: {contract.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                contract.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 
                contract.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {contract.status === 'COMPLETED' ? 'ДУУССАН' : 
                 contract.status === 'ACTIVE' ? 'ИДЭВХТЭЙ' : contract.status}
              </span>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <h3 className="text-lg font-bold mb-4">Гэрээний нөхцөл</h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mb-8 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                <p className="mb-4 font-bold text-slate-900 dark:text-white">1. Гүйцэтгэх ажил:</p>
                <p className="mb-6">{contract.job?.description}</p>
                
                <p className="mb-4 font-bold text-slate-900 dark:text-white">2. Төлбөр тооцоо:</p>
                <p className="mb-6">Гүйцэтгэгч тал ажлыг чанартай гүйцэтгэж хүлээлгэн өгсний дараа захиалагч тал тохиролцсон ₮{contract.agreed_amount.toLocaleString()} төлбөрийг шилжүүлнэ.</p>
                
                <p className="mb-4 font-bold text-slate-900 dark:text-white">3. Талуудын үүрэг:</p>
                <p>Захиалагч нь ажлын даалгаврыг тодорхой өгөх, Гүйцэтгэгч нь тогтоосон хугацаанд ажлыг дуусгах үүрэгтэй.</p>
              </div>
            </div>

            {/* Actions Section */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              {contract.status === 'PENDING' ? (
                <Button 
                  onClick={() => handleStatusUpdate("ACTIVE")} 
                  disabled={submitting}
                  className="w-full py-6 h-auto text-lg font-bold shadow-xl shadow-blue-500/20"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                  Гэрээг батлах
                </Button>
              ) : contract.status === 'ACTIVE' && isClient ? (
                <Button 
                  onClick={() => handleStatusUpdate("COMPLETED")} 
                  disabled={submitting}
                  variant="primary"
                  className="w-full py-6 h-auto text-lg font-bold bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-500/20"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <CheckCircle2 className="w-5 h-5 mr-2" />}
                  Ажлыг дууссан гэж тэмдэглэх
                </Button>
              ) : contract.status === 'COMPLETED' ? (
                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex flex-col items-center text-center">
                  <FileText className="w-10 h-10 text-blue-500 mb-2" />
                  <p className="font-bold text-blue-900 dark:text-blue-200">Энэхүү төсөл амжилттай дууссан байна.</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Төслийг амжилттай гүйцэтгэсэнд баярлалаа!</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Дэлгэрэнгүй</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Төсөв</p>
                  <p className="font-black text-slate-900 dark:text-white">₮{contract.agreed_amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Эхэлсэн огноо</p>
                  <p className="font-black text-slate-900 dark:text-white">{new Date(contract.start_date || contract.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-4">Талууд</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">C</div>
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 dark:text-white">{contract.client.user.full_name}</p>
                      <p className="text-slate-500">Захиалагч</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">F</div>
                    <div className="text-xs">
                      <p className="font-bold text-slate-900 dark:text-white">{contract.freelancer.user.full_name}</p>
                      <p className="text-slate-500">Гүйцэтгэгч</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
