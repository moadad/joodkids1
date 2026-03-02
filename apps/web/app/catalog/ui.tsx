"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { listProducts, ProductDoc } from "@/lib/products";
import AddToCartButton from "@/components/AddToCartButton";
import { useSearchParams } from "next/navigation";

const seasons = ["الكل", "صيفي", "شتوي", "خريفي"] as const;
const promos = ["الكل", "عادي", "عرض", "خصم"] as const;

function Badge({ children, tone }: { children: React.ReactNode; tone?: "red" }) {
  const cls = tone === "red" ? "jk-badge jk-badge-red" : "jk-badge";
  return <span className={cls}>{children}</span>;
}

export default function CatalogClient() {
  const sp = useSearchParams();

  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const [season, setSeason] = useState<(typeof seasons)[number]>("الكل");
  const [promo, setPromo] = useState<(typeof promos)[number]>("الكل");
  const [category, setCategory] = useState<string>("الكل");
  const [q, setQ] = useState("");

  useEffect(() => {
    // apply query params
    const s = sp.get("season");
    const pr = sp.get("promo");
    const cat = sp.get("category");
    if (s && (seasons as readonly string[]).includes(s)) setSeason(s as any);
    if (pr && (promos as readonly string[]).includes(pr)) setPromo(pr as any);
    if (cat) setCategory(cat);
  }, [sp]);

  useEffect(() => {
    listProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.mainCategory).filter(Boolean));
    return ["الكل", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (season !== "الكل" && p.season !== season) return false;
      if (promo !== "الكل" && p.promo !== promo) return false;
      if (category !== "الكل" && p.mainCategory !== category) return false;
      if (q.trim()) {
        const t = q.trim().toLowerCase();
        return String(p.code).includes(t) || p.name.toLowerCase().includes(t);
      }
      return true;
    });
  }, [products, season, promo, category, q]);

  if (loading) return <div className="text-sm text-zinc-600">جار التحميل…</div>;

  return (
    <div className="grid gap-5">
      <div className="rounded-3xl border border-zinc-200 bg-white p-4 sm:p-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[220px]">
            <div className="text-xs font-bold text-zinc-500 mb-1">بحث</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-2 text-sm"
              placeholder="ابحث بالكود أو الاسم"
            />
          </div>

          <div>
            <div className="text-xs font-bold text-zinc-500 mb-1">الموسم</div>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value as any)}
              className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm bg-white"
            >
              {seasons.map((s) => (
                <option key={`season-${s}`} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-xs font-bold text-zinc-500 mb-1">العروض</div>
            <select
              value={promo}
              onChange={(e) => setPromo(e.target.value as any)}
              className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm bg-white"
            >
              {promos.map((p) => (
                <option key={`promo-${p}`} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="text-xs font-bold text-zinc-500 mb-1">الموديل</div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm bg-white"
            >
              {categories.map((c, idx) => (
                <option key={`${c}-${idx}`} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Link href="/cart" className="jk-btn jk-btn-primary">
            الذهاب للسلة
          </Link>
        </div>

        <div className="mt-3 text-xs text-zinc-600">
          يتم البيع بالسيري (6 / 9 / 12).
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-sm text-zinc-600">لا توجد منتجات مطابقة.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p, index) => (
            <div
              key={p.code ? `${p.code}-${index}` : `item-${index}`}
              className="rounded-3xl border border-zinc-200 overflow-hidden bg-white hover:shadow-sm transition"
            >
              <Link href={`/product/${String(p.code)}`} className="block">
                <div className="relative aspect-[4/3] bg-zinc-50">
                  {p.images?.[0]?.url ? (
                    <Image
                      src={p.images[0].url}
                      alt={p.name || "منتج جود كيدز"}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400">
                      لا توجد صورة
                    </div>
                  )}

                  <div className="absolute top-3 right-3 flex gap-2">
                    {p.promo !== "عادي" && <Badge tone="red">{p.promo}</Badge>}
                    <Badge>سيري {p.seriesQty}</Badge>
                  </div>
                </div>

                <div className="p-4">
                  <div className="text-xs text-zinc-500">
                    كود: {p.code} • موديل: {p.mainCategory} • {p.season}
                  </div>
                  <div className="font-extrabold mt-1">{p.name}</div>
                </div>
              </Link>

              <div className="px-4 pb-4 flex items-center justify-between gap-2">
                <AddToCartButton product={p} />
                <Link className="text-sm font-bold text-[rgb(var(--jk-navy))] hover:underline" href="/cart">
                  عرض السلة
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
