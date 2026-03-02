"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function SuccessClient() {
  const sp = useSearchParams();
  const id = sp.get("id");

  return (
    <div className="rounded-3xl border border-zinc-200 p-8 bg-zinc-50">
      <h1 className="text-2xl font-extrabold">تم إرسال الطلب ✅</h1>
      <p className="text-sm text-zinc-700 mt-2">
        تم تسجيل طلبك لدينا. {id ? <>رقم الطلب: <b>{id}</b></> : null}
      </p>
      <div className="mt-6 flex gap-3 flex-wrap">
        <Link href="/catalog" className="rounded-2xl bg-zinc-900 text-white px-5 py-3 text-sm font-semibold">
          العودة للكتالوج
        </Link>
        <Link href="/cart" className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold hover:bg-white">
          السلة
        </Link>
      </div>
      <p className="mt-6 text-xs text-zinc-500">
        ملاحظة: إذا لم يفتح واتساب تلقائيًا، تأكد من تفعيل رقم واتساب في بيانات الشركة داخل لوحة التحكم.
      </p>
    </div>
  );
}
