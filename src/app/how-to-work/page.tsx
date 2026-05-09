import Link from "next/link";
import { UserPlus, Search, ShieldCheck, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function HowToWorkPage() {
  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-slate-950">
      <div className="bg-blue-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">Хэрхэн фрилансерээр ажиллах вэ?</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Эхлэхэд тун хялбар. Өөрийн ур чадварыг үнэлүүлж, сонирхолтой төслүүд дээр ажиллаж, найдвартай орлоготой болоорой.
          </p>
          <div className="flex justify-center">
            <Link href="/register">
              <Button variant="primary" className="h-12 px-8 font-bold">Эхлэх</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl py-20 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 relative before:absolute before:inset-0 before:ml-[27px] md:before:ml-[50%] before:-translate-x-px md:before:-translate-x-0.5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
          
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active text-left md:text-right">
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-white dark:border-slate-950 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-transform group-hover:scale-110">
              <UserPlus className="w-6 h-6" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm ml-4 md:ml-0 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">1. Профайл үүсгэх</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Өөрийн ур чадвар, өмнө хийж байсан ажлын туршлагаа бусдад харагдахуйц байдлаар дүүрэн бөглөөрэй. Итгэл төрүүлэхүйц профайл нь ажлын санал авах магадлалыг 3 дахин нэмэгдүүлдэг.</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active text-left">
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-white dark:border-slate-950 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-transform group-hover:scale-110">
              <Search className="w-6 h-6" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm ml-4 md:ml-0 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">2. Ажилд санал илгээх</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Систем дээрх хэдэн зуун ажлын зарууд дундаас өөрт тохирохыг олж, хэрхэн хийх төлөвлөгөө болон санал болгох үнийн дүнгээ илгээнэ.</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active text-left md:text-right">
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-white dark:border-slate-950 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-transform group-hover:scale-110">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm ml-4 md:ml-0 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">3. Хамтран ажиллах</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Клиент таныг сонгосон тохиолдолд платформ доторх чат болон файлын системийг ашиглан ажлаа 100% хяналттай хийж гүйцэтгэнэ.</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active text-left">
            <div className="flex items-center justify-center w-14 h-14 rounded-full border-4 border-white dark:border-slate-950 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10 transition-transform group-hover:scale-110">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm ml-4 md:ml-0 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">4. Төлбөрөө авах</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">Ажил амжилттай дууссан тохиолдолд клиентээс таны данс руу шууд төлбөр шилжих бөгөөд санаа зовох зүйлгүй баталгаатай үйлчилгээ.</p>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 py-16 text-center">
        <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Яг одоо эхлэх үү?</h2>
        <div className="flex justify-center gap-4">
          <Link href="/register"><Button variant="primary" className="h-12 px-8 font-medium">Бүртгүүлэх</Button></Link>
          <Link href="/jobs"><Button variant="outline" className="h-12 px-8 bg-white dark:bg-slate-900 font-medium">Ажлын зарууд үзэх</Button></Link>
        </div>
      </div>
    </div>
  );
}
