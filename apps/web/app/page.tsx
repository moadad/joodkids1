import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border border-zinc-200 p-6 md:p-10 bg-gradient-to-b from-zinc-50 to-white">
        <h1 className="text-2xl md:text-4xl font-extrabold">جود كيدز — بيع بالجملة فقط</h1>
        <p className="mt-3 text-zinc-600 max-w-2xl">
          كتالوج احترافي لملابس الأطفال. يمكنك تصفح المنتجات وتصنيفها حسب الكود والموسم، والتواصل معنا مباشرة عبر واتساب ومواقع التواصل.
        </p>
        <div className="mt-6 flex gap-3 flex-wrap">
          <Link href="/catalog" className="rounded-2xl bg-zinc-900 text-white px-5 py-3 text-sm font-semibold">
            عرض الكتالوج
          </Link>
          <Link href="/contact" className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold">
            تواصل معنا
          </Link>
        </div>
        <p className="mt-6 text-xs text-zinc-500">
          للدخول إلى لوحة التحكم: اضغط على اللوجو 3 مرات بسرعة.
        </p>
      </div>
    </div>
  );
}
