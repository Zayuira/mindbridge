import Link from "next/link";
import { 
  ShieldCheck, Zap, BrainCircuit, ArrowRight, Briefcase, User, Star,
  Code, Palette, Smartphone, FileText, TrendingUp, Video, Bot,
  PlusCircle, FileSearch, ListChecks, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';
import { getPlatformStats } from "@/lib/stats";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const stats = await getPlatformStats();

  if (session) {
    const role = (session.user as any)?.role;
    
    return (
      <div className="flex flex-col flex-1 bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 mt-4">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Тавтай морилно уу, {session.user?.name}!
            </h1>
            <p className="text-slate-500">
              Таны {role === "CLIENT" ? "хөлслөгч" : "фрилансер"} профайлын хураангуй мэдээлэл.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                {role === "CLIENT" ? <Briefcase className="w-6 h-6" /> : <FileSearch className="w-6 h-6" />}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{role === "CLIENT" ? "Нийт зарласан ажил" : "Хайх боломжтой ажлууд"}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalJobs}</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center">
                <ListChecks className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{role === "CLIENT" ? "Ажиллаж буй гэрээнүүд" : "Илгээсэн саналууд"}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">0</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Үнэлгээ</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">0.0</p>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Хурдан холбоосууд</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {role === "CLIENT" ? (
              <>
                <Link href="/jobs/create" className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">Шинээр ажил оруулах</span>
                </Link>
                <Link href="/freelancers" className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">Фрилансер хайх</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/jobs" className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                     <FileSearch className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">Ажил хайх</span>
                </Link>
                <Link href="/profile" className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                     <User className="w-5 h-5" />
                  </div>
                  <span className="font-semibold text-slate-900 dark:text-white">Профайлаа шинэчлэх</span>
                </Link>
              </>
            )}
          </div>

          {/* Ongoing and History Jobs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Одоо явагдаж буй ажлууд</h2>
              <div className="text-sm text-slate-500 py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-lg flex flex-col items-center justify-center gap-2">
                <Briefcase className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                <p>Одоогоор идэвхтэй явагдаж буй ажил алга байна.</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Түүх</h2>
              <div className="text-sm text-slate-500 py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-lg flex flex-col items-center justify-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                <p>Түүх хоосон байна.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-slate-950">
      
      {/* Hero Section */}
      <section className="relative w-full pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left Content */}
            <div className="flex flex-col items-start text-left z-10 w-full lg:max-w-xl">

              <h1 className="text-4xl lg:text-5xl lg:leading-tight font-bold text-slate-900 dark:text-white mb-6">
                Future starts here.
              </h1>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed text-balance">
                Mind Bridge нь хиймэл оюун ухааныг ашиглан таны төсөлд хамгийн их тохирох мэргэжилтэнг цаг алдалгүй олж өгөх болно. Ажлаа хялбарчилж, эрсдэлгүй хамтран ажилла.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link href="/freelancers" className="w-full sm:w-auto">
                  <Button variant="primary" className="w-full sm:w-auto h-12 px-6 font-medium text-base rounded-lg shadow-sm">
                    Фрилансер хөлслөх
                  </Button>
                </Link>
                <Link href="/jobs" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto h-12 px-6 font-medium text-base bg-white dark:bg-slate-900 rounded-lg">
                    Ажил олох
                  </Button>
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs shadow-sm text-slate-400 font-bold">1</div>
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs shadow-sm text-slate-400 font-bold">2</div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs shadow-sm text-slate-400 font-bold">3</div>
                </div>
                <p><strong>{stats.totalUsers.toLocaleString()}+</strong> харилцагчид итгэж нэгдсэн</p>
              </div>
            </div>

            {/* Right Graphic Mockup */}
            <div className="relative hidden lg:block h-[500px] w-full z-10 selection:bg-transparent">
              {/* Decorative subtle background element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-tr from-blue-50 to-slate-50 dark:from-blue-900/10 dark:to-slate-900/10 rounded-full blur-3xl -z-10"></div>
              
              {/* Floating UI Card 1: Freelancer Profile */}
              <div className="absolute top-10 right-8 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 p-5 transform rotate-2 hover:rotate-0 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center border border-blue-100 dark:border-slate-700"><User className="w-6 h-6 text-blue-600" /></div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Бат-Эрдэнэ Д.</h4>
                      <p className="text-xs text-slate-500">Senior React Хөгжүүлэгч</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">4.9</span>
                  <span className="text-xs text-slate-500">(24 үнэлгээ)</span>
                </div>
                <div className="flex gap-2 mb-4">
                  <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-md border border-slate-100 dark:border-slate-700/50">Next.js</span>
                  <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-md border border-slate-100 dark:border-slate-700/50">Tailwind</span>
                </div>
                <Button variant="outline" className="w-full h-8 text-xs rounded-md font-medium">Сонгох</Button>
              </div>

              {/* Floating UI Card 2: AI Match Alert */}
              <div className="absolute bottom-16 left-0 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 p-5 transform -rotate-3 hover:rotate-0 hover:-translate-y-1 transition-all duration-300 z-20">
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/50">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">98% AI Таарц</h4>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">Систем одоогоор таны төсөлд хамгийн их тохирох 3 хүнийг шүүж гаргалаа.</p>
                  </div>
                </div>
              </div>

              {/* Floating UI Card 3: Job Progress */}
              <div className="absolute top-48 -left-4 w-44 bg-white dark:bg-slate-900 rounded-xl shadow-lg shadow-slate-200/50 dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-slate-800 p-4 z-10 hover:-translate-y-1 transition-transform duration-300">
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mb-1">Гүйцэтгэл</p>
                <h4 className="font-bold text-2xl text-slate-900 dark:text-white mb-2">100%</h4>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-1.5 w-full"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Trusted By / Stats Area */}
      <section className="w-full py-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-sm font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{stats.totalProjects.toLocaleString()}+</span>
              <span>Амжилттай төслүүд</span>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">₮{(stats.totalFunding / 1000000000).toFixed(1)}тэрбум+</span>
              <span>Олгосон санхүүжилт</span>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">{stats.satisfaction}%</span>
              <span>Сэтгэл ханамж</span>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Features Section */}
      <section className="w-full py-20 lg:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 md:order-1 relative">
               <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl w-full aspect-square md:aspect-[4/3] flex items-center justify-center relative border border-slate-200 dark:border-slate-800 overflow-hidden group">
                 
                 <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 
                 {/* Internal Fake UI Representation */}
                 <div className="flex gap-6 items-center w-full max-w-md px-6 z-10">
                   {/* Chat list fake card */}
                   <div className="w-full h-80 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 flex flex-col transform -translate-y-4 group-hover:-translate-y-6 transition-transform duration-500">
                     <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50 rounded-t-xl">
                       <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                       <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                     </div>
                     <div className="p-4 space-y-4">
                       {[1, 2, 3].map(i => (
                         <div key={i} className="flex gap-3 items-center">
                           <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0"></div>
                           <div className="flex-1 space-y-2">
                             <div className="w-24 h-3 bg-slate-100 dark:bg-slate-800 rounded"></div>
                             <div className={`h-2 bg-slate-50 dark:bg-slate-800/50 rounded ${i === 1 ? 'w-full' : 'w-3/4'}`}></div>
                           </div>
                         </div>
                       ))}
                     </div>
                     <div className="mt-auto p-4 border-t border-slate-100 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-b-xl flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Төлбөр багцлагдсан</span>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">Үйл явцыг хялбарчилж,<br />үр дүнг хурдасгана</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed text-balance">
                Олон мянган анкет унших шаардлагагүй. Бидний шийдэл таны цагийг хэмнэж, шууд хийгдэх ёстой ажил руугаа төвлөрөх боломжийг олгоно.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800/50">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Ухаалаг эрэмбэлэлт</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-md">Ажлын хуудсанд ирсэн саналуудыг таны шаардлагатай харьцуулан хамгийн чадвартай хүмүүсийг эхэнд байрлуулна.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-800/50">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Баталгаажсан төлбөр</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-md">Монголын бүх банк болон QPay системээр дамжуулан найдвартай, аюулгүй дотоод гүйлгээ хийх боломжтой.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 border border-purple-100 dark:border-purple-800/50">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Шууд хамтын ажиллагаа</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-md">Дундын зуучлагчгүйгээр фрилансертэй шууд холбогдож, чатлан, файлаа хуваалцаж ажлаа явуулаарай.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Grid (Clean) */}
      <section className="w-full py-20 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Түгээмэл салбарууд</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md leading-relaxed">Таны хайж буй салбараас шалтгаалан тусгайлсан туршлагатай мэргэжилтнүүдийг санал болгож байна.</p>
            </div>
            <Link href="/jobs" className="hidden md:inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm mt-4 md:mt-0 transition-colors group">
              Бүгдийг үзэх <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: <Code className="w-5 h-5" />, title: "Веб хөгжүүлэлт", count: "320 ажил" },
              { icon: <Palette className="w-5 h-5" />, title: "График дизайн", count: "215 ажил" },
              { icon: <Smartphone className="w-5 h-5" />, title: "Мобайл апп", count: "148 ажил" },
              { icon: <FileText className="w-5 h-5" />, title: "Контент, Орчуулга", count: "95 ажил" },
              { icon: <TrendingUp className="w-5 h-5" />, title: "Маркетинг", count: "112 ажил" },
              { icon: <Video className="w-5 h-5" />, title: "Анимейшн & Видео", count: "86 ажил" },
              { icon: <Bot className="w-5 h-5" />, title: "AI & Дата", count: "54 ажил" },
              { icon: <Briefcase className="w-5 h-5" />, title: "Бизнес зөвлөх", count: "72 ажил" },
            ].map((cat, i) => (
              <Link key={i} href="/jobs" className="group p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all flex flex-col items-start gap-4">
                <div className="text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cat.icon}</div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">{cat.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{cat.count}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <Link href="/jobs" className="md:hidden mt-8 w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg py-3 font-medium flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Бүх салбарыг үзэх <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Modern Minimal CTA Section */}
      <section className="w-full py-20 border-t border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Шинэ төслөө өнөөдөр эхлүүл</h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Платформд бүртгүүлснээр ажлын заруудад хандах, шинээр ажил оруулах болон мэргэжилтнүүдтэй шууд холбогдох боломжтой болно.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto px-8 h-12 font-medium rounded-lg">
                Одоо бүртгүүлэх
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
