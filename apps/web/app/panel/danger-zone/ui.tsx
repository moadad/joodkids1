"use client";

import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useState } from "react";

export default function DangerClient() {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const deleteAllProducts = async () => {
    setMsg(null);
    if (text !== "DELETE ALL") {
      setMsg('اكتب "DELETE ALL" للتأكيد.');
      return;
    }
    if (!confirm("تأكيد أخير: سيتم حذف جميع المنتجات من قاعدة البيانات.")) return;

    setBusy(true);
    try {
      const snaps = await getDocs(collection(db, "products"));
      const batch = writeBatch(db);
      snaps.docs.forEach(d => batch.delete(doc(db, "products", d.id)));
      await batch.commit();
      setMsg(`تم حذف جميع المنتجات ✅ العدد: ${snaps.size}`);
    } catch (e: any) {
      setMsg(e?.message ?? "خطأ أثناء الحذف");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-red-700">منطقة خطرة</h1>
        <p className="text-sm text-red-700 mt-1">حذف جميع البيانات (المنتجات) من Firestore.</p>
      </div>

      {msg && <div className="text-sm">{msg}</div>}

      <div className="rounded-3xl border border-red-200 p-6 grid gap-4 bg-red-50/40">
        <div className="text-sm text-red-800">
          لتفعيل زر الحذف، اكتب: <b>DELETE ALL</b>
        </div>
        <input value={text} onChange={(e)=>setText(e.target.value)}
          className="rounded-2xl border border-red-200 px-4 py-3 text-sm bg-white"/>
        <button disabled={busy} onClick={deleteAllProducts}
          className="rounded-2xl bg-red-700 text-white px-5 py-3 text-sm font-semibold disabled:opacity-60 w-fit">
          {busy ? "جار الحذف…" : "حذف جميع المنتجات"}
        </button>
      </div>
    </div>
  );
}
