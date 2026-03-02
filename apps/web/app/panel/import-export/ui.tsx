"use client";

import { useState } from "react";
import { listProducts, upsertProduct } from "@/lib/products";
import { exportProductsToExcel, parseExcel } from "@/lib/excel";

export default function ImportExportClient() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const onExport = async () => {
    setMsg(null);
    setBusy(true);
    try {
      const products = await listProducts();
      exportProductsToExcel(products);
      setMsg("تم تصدير ملف products.xlsx ✅");
    } catch (e: any) {
      setMsg(e?.message ?? "خطأ أثناء التصدير");
    } finally {
      setBusy(false);
    }
  };

  const onImport = async (file: File) => {
    setMsg(null);
    setBusy(true);
    try {
      const { rows, errors } = await parseExcel(file);
      if (errors.length) {
        setMsg("أخطاء في الملف:\n" + errors.slice(0, 50).join("\n"));
        return;
      }

      for (const r of rows) {
        await upsertProduct({
          code: r.code,
          name: r.name,
          season: r.season,
          promo: r.promo,
          seriesQty: r.seriesQty,
          description: r.description,
          images: [] // images via upload UI or via imageUrls column (optional)
        } as any);
      }

      setMsg(`تم الاستيراد ✅ عدد الصفوف: ${rows.length}`);
    } catch (e: any) {
      setMsg(e?.message ?? "خطأ أثناء الاستيراد");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-extrabold">استيراد / تصدير Excel</h1>
        <p className="text-sm text-zinc-600 mt-1">
          الاستيراد يعمل Upsert حسب <b>code</b>. الأعمدة المقترحة:
          <span className="font-semibold"> code, name, season, promo, seriesQty, description</span>.
        </p>
      </div>

      {msg && (
        <pre className="text-sm whitespace-pre-wrap rounded-2xl border border-zinc-200 p-4 bg-zinc-50">
          {msg}
        </pre>
      )}

      <div className="rounded-3xl border border-zinc-200 p-6 grid gap-4">
        <button
          disabled={busy}
          onClick={onExport}
          className="rounded-2xl bg-zinc-900 text-white px-5 py-3 text-sm font-semibold disabled:opacity-60 w-fit"
        >
          {busy ? "جار التنفيذ…" : "تصدير المنتجات إلى Excel"}
        </button>

        <div>
          <div className="text-xs text-zinc-500 mb-1">استيراد ملف .xlsx</div>
          <input
            disabled={busy}
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onImport(f);
            }}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm bg-white disabled:opacity-60"
          />
        </div>
      </div>
    </div>
  );
}
