'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Briefcase,
  Mail,
  Star,
  CheckCircle2,
  ShieldCheck,
  Send,
  AlertCircle,
  X,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSession } from 'next-auth/react';

// Job type тодорхойлно
interface Job {
  id: string;
  title: string;
  clientId: string;
  budgetMax?: number;
  status?: string;
}

export default function FreelancerPublicProfile({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  
  const [freelancer, setFreelancer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Comment Form State
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);

  // Verification State
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyType, setVerifyType] = useState<'phone' | 'email'>('phone');
  const [verifyStep, setVerifyStep] = useState<'request' | 'code' | 'success'>(
    'request'
  );

  // Invitation State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [clientJobs, setClientJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/freelancers/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setFreelancer(data.freelancer);
        setLoading(false);
      })
      .catch(() => {
        setError('Freelancer profile not found');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (
      showInviteModal &&
      session &&
      (session.user as any).role === 'CLIENT'
    ) {
      fetch('/api/jobs')
        .then((res) => res.json())
        .then((data: { jobs: any[] }) => {
          if (data.jobs) {
            const myJobs = data.jobs.filter(
              (j) => j.client?.user_id === (session.user as any).id
            );
            setClientJobs(myJobs);
            if (myJobs.length > 0) setSelectedJobId(myJobs[0].id);
          }
        });
    }
  }, [showInviteModal, session]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setNewComment('');
  };

  const handleVerifyRequest = () => {
    setVerifyStep('code');
  };

  const handleVerifyConfirm = () => {
    setVerifyStep('success');
    setTimeout(() => {
      setShowVerifyModal(false);
      setVerifyStep('request');
    }, 2000);
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError('');
    setInviteLoading(true);

    try {
      const res = await fetch('/api/proposals/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId: id,
          jobId: selectedJobId,
          coverLetter: inviteMessage
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setInviteSuccess(true);
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess(false);
      }, 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setInviteError(message);
    } finally {
      setInviteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-slate-500 animate-pulse">Уншиж байна...</p>
      </div>
    );
  }

  if (error || !freelancer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 gap-4">
        <AlertCircle className="w-12 h-12 text-slate-300" />
        <p className="text-slate-500">{error || 'Freelancer profile not found'}</p>
        <Link href="/freelancers">
          <Button variant="outline">Буцах</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 flex-1 min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden">
              <div className="w-32 h-32 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-4 border-4 border-white dark:border-slate-950 shadow-md flex items-center justify-center overflow-hidden">
                <User className="w-16 h-16 text-slate-400" />
              </div>

              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {freelancer.user?.full_name}
              </h1>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-1">
                {freelancer.title}
              </p>
              <div className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 mb-4">
                Expert (Мэргэжилтэн)
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4 mb-6 text-left">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase mb-1">Үнэлгээ</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {freelancer.ai_score?.toFixed(1) || '5.0'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase mb-1">Цагийн хөлс</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">
                    ₮{(freelancer.hourly_rate || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {session?.user && (session.user as any).role === 'CLIENT' && (
                <Button
                  variant="primary"
                  className="w-full font-bold mb-3 shadow-blue-500/20 shadow-lg"
                  onClick={() => setShowInviteModal(true)}
                >
                  Ажилд авах санал илгээх
                </Button>
              )}
            </div>

            {/* Statistics */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Статистик</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500"><Briefcase className="w-4 h-4" /> Хийсэн ажлууд</span>
                  <span className="font-bold text-slate-900 dark:text-white">{freelancer.contracts?.length || 0} ажил</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-500"><MapPin className="w-4 h-4" /> Байршил</span>
                  <span className="font-bold text-slate-900 dark:text-white">{freelancer.location || 'Зайнаас'}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Миний тухай</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{freelancer.bio}</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Ур чадварууд</h2>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills?.map((sk: any) => (
                  <span key={sk.skill.id} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium border border-slate-200 dark:border-slate-700">
                    {sk.skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg dark:text-white">Ажилд урих</h3>
              <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {inviteSuccess ? (
                <div className="text-center py-4">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="font-bold text-xl mb-2 text-emerald-600">Санал илгээгдлээ!</h4>
                  <p className="text-slate-500">Фрилансер руу таны ажлын урилга амжилттай очлоо.</p>
                </div>
              ) : (
                <form onSubmit={handleSendInvite} className="space-y-4">
                  {inviteError && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{inviteError}</div>}
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Ажлаа сонгоно уу</label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                      required
                    >
                      <option value="">Сонгох...</option>
                      {clientJobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1">Зурвас (Заавал биш)</label>
                    <textarea
                      value={inviteMessage}
                      onChange={(e) => setInviteMessage(e.target.value)}
                      className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 min-h-[100px]"
                      placeholder="Хамтран ажиллах хүсэлтэй байна..."
                    />
                  </div>
                  <Button variant="primary" type="submit" disabled={inviteLoading || clientJobs.length === 0} className="w-full">
                    {inviteLoading ? 'Илгээж байна...' : 'Урилга илгээх'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
