"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { deleteProductByCode, listProducts, ProductDoc, upsertProduct, SeriesQty } from "@/lib/products";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Season, Promo } from "@/lib/categories";

const SEASONS: Season[] = ["صيفي", "شتوي", "خريفي"];
const PROMOS: Promo[] = ["عادي", "عرض", "خصم"];
const SERIES: SeriesQty[] = [6, 9, 12];

export default function ProductsClient() {
  const [items, setItems] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // form state
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [season, setSeason] = useState<Season>("صيفي");
  const [promo, setPromo] = useState<Promo>("عادي");
  const [seriesQty, setSeriesQty] = useState<SeriesQty>(12);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const p = await listProducts();
      setItems(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const onAddOrUpdate = async () => {
    setMsg(null);
    const c = Number(code);
    if (!Number.isFinite(c) || c <= 0) { setMsg("كود غير صحيح"); return; }
    if (!name.trim()) { setMsg("الاسم مطلوب"); return; }

    setBusy(true);
    try {
      let images: any[] = [];

      if (files && files.length) {
        for (const f of Array.from(files)) {
          const r = await uploadToCloudinary(f);
          images.push({ url: r.secure_url, publicId: r.public_id, width: r.width, height: r.height });
        }
      }

      await upsertProduct({
        code: c,
        name: name.trim(),
        season,
        promo,
        seriesQty,
        description: description.trim() || undefined,
        images
      } as any);

      setMsg("تم الحفظ ✅");
      setCode(""); setName(""); setDescription(""); setFiles(null);
      setPromo("عادي"); setSeason("صيفي"); setSeriesQty(12);
      await refresh();
    } catch (e: any) {
      setMsg(e?.message ?? "خطأ أثناء الحفظ");
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async (c: number) => {
    if (!confirm(`حذف المنتج ${c}?`)) return;
    setBusy(true);
    setMsg(null);
    try {
      await deleteProductByCode(c);
      await refresh();
      setMsg("تم الحذف ✅");
    } catch (e: any) {
      setMsg(e?.message ?? "خطأ أثناء الحذف");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-2xl font-extrabold">إدارة المنتجات</h1>
        <p className="text-sm text-zinc-600 mt-1">
          إضافة/تعديل حسب الكود + رفع صور Cloudinary. <b>البيع بالسيري فقط</b> (6/9/12).
        </p>
      </div>

      {msg && <div className="text-sm">{msg}</div>}

      <div className="rounded-3xl border border-zinc-200 p-6 grid gap-4">
        <div className="grid md:grid-cols-6 gap-3">
          <div className="md:col-span-1">
            <div className="text-xs text-zinc-500 mb-1">الكود</div>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
              placeholder="1450"
            />
          </div>

          <div className="md:col-span-3">
            <div className="text-xs text-zinc-500 mb-1">اسم المنتج</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
              placeholder="طقم ولادي"
            />
          </div>

          <div className="md:col-span-1">
            <div className="text-xs text-zinc-500 mb-1">الموسم</div>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value as any)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
            >
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <div className="text-xs text-zinc-500 mb-1">سيري</div>
            <select
              value={seriesQty}
              onChange={(e) => setSeriesQty(Number(e.target.value) as SeriesQty)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
            >
              {SERIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-zinc-500 mb-1">تصنيف عروض/خصومات</div>
            <select
              value={promo}
              onChange={(e) => setPromo(e.target.value as any)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
            >
              {PROMOS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <div className="text-xs text-zinc-500 mb-1">الوصف</div>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
              placeholder="تفاصيل المنتج..."
            />
          </div>
        </div>

        <div>
          <div className="text-xs text-zinc-500 mb-1">الصور (عدة صور)</div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm bg-white"
          />
          <div className="text-xs text-zinc-500 mt-1">
            ستظهر الصور بالحجم الكامل، ويمكن تكبيرها في صفحة المنتج.
          </div>
        </div>

        <div className="flex gap-3">
          <button
            disabled={busy}
            onClick={onAddOrUpdate}
            className="rounded-2xl bg-zinc-900 text-white px-5 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {busy ? "جار التنفيذ…" : "حفظ المنتج"}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 font-semibold text-sm">
          المنتجات
        </div>
        {loading ? (
          <div className="p-6 text-sm text-zinc-600">جار التحميل…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-zinc-600">لا توجد منتجات.</div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {items.map((p) => (
              <div
                key={p.code}
                className="p-6 grid md:grid-cols-[120px,1fr,auto] gap-4 items-center"
              >
                <div className="relative h-24 w-28 rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50">
                  {p.images?.[0]?.url ? (
                    <Image src={p.images[0].url} alt={p.name} fill className="object-contain" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400">
                      لا صورة
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-zinc-500">
                    كود: {p.code} • تصنيف: {p.mainCategory} • {p.season} • سيري {p.seriesQty}
                    {p.promo !== "عادي" ? ` • ${p.promo}` : ""}
                  </div>
                  <div className="font-bold">{p.name}</div>
                </div>
                <button
                  onClick={() => onDelete(p.code)}
                  className="rounded-2xl border border-red-200 text-red-700 px-4 py-2 text-sm hover:bg-red-50"
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
