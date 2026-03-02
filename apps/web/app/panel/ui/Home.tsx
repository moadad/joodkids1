"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PanelHomeClient() {
  const router = useRouter();
  const onLogout = async () => {
    await fetch("/api/panel-logout", { method: "POST" });
    router.replace("/");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 grid gap-5">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">لوحة التحكم</h1>
          <p className="text-sm text-zinc-600 mt-1">إدارة المنتجات والطلبات وبيانات الشركة.</p>
        </div>
        <button onClick={onLogout} className="jk-btn jk-btn-outline">تسجيل خروج</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link className="rounded-3xl border border-zinc-200 p-6 hover:bg-zinc-50" href="/panel/products">
          <div className="font-extrabold">المنتجات</div>
          <div className="text-sm text-zinc-600 mt-1">إضافة/تعديل/حذف الأصناف</div>
        </Link>
        <Link className="rounded-3xl border border-zinc-200 p-6 hover:bg-zinc-50" href="/panel/orders">
          <div className="font-extrabold">الطلبات</div>
          <div className="text-sm text-zinc-600 mt-1">متابعة وإدارة الطلبات</div>
        </Link>
        <Link className="rounded-3xl border border-zinc-200 p-6 hover:bg-zinc-50" href="/panel/company">
          <div className="font-extrabold">بيانات الشركة</div>
          <div className="text-sm text-zinc-600 mt-1">روابط التواصل والمواقع</div>
        </Link>
        <Link className="rounded-3xl border border-zinc-200 p-6 hover:bg-zinc-50" href="/panel/import-export">
          <div className="font-extrabold">استيراد/تصدير Excel</div>
          <div className="text-sm text-zinc-600 mt-1">رفع ملف وتحديث حسب العمود الأساسي</div>
        </Link>
      </div>
    </div>
  );
}
