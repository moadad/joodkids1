"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { listProducts } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

type Model = string;

export default function MobileMenu() {
  const { totalSeries } = useCart();
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    // build models list from product mainCategory
    listProducts()
      .then((ps) => {
        const set = new Set(ps.map((p) => p.mainCategory).filter(Boolean));
        setModels(Array.from(set).sort((a, b) => a.localeCompare(b)));
      })
      .catch(() => setModels([]));
  }, []);

  const seasons = useMemo(() => ([
    { label: "الكل", value: "الكل" },
    { label: "صيفي", value: "صيفي" },
    { label: "شتوي", value: "شتوي" },
    { label: "خريفي", value: "خريفي" },
  ]), []);

  const promos = useMemo(() => ([
    { label: "الكل", value: "الكل" },
    { label: "عادي", value: "عادي" },
    { label: "عرض", value: "عرض" },
    { label: "خصم", value: "خصم" },
  ]), []);

  const pill = "jk-badge inline-flex items-center gap-2 px-3 py-2 hover:opacity-90";

  return (
    <div className="relative">
      <button
        aria-label="Open menu"
        className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 hover:bg-zinc-50"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="w-6 grid gap-1">
          <span className="h-0.5 rounded bg-[rgb(var(--jk-navy))]" />
          <span className="h-0.5 rounded bg-[rgb(var(--jk-navy))]" />
          <span className="h-0.5 rounded bg-[rgb(var(--jk-navy))]" />
        </div>
      </button>

      {open && (
        <div
          className="absolute left-0 mt-2 w-[320px] max-w-[85vw] rounded-3xl border border-zinc-200 bg-white shadow-lg overflow-hidden"
          dir="rtl"
        >
          <div className="jk-gradient px-5 py-4">
            <div className="font-extrabold text-white drop-shadow-sm">القائمة</div>
            <div className="text-xs text-white/90 mt-1">بيع بالجملة فقط — بالسيري (6/9/12)</div>
          </div>

          <div className="p-5 grid gap-5">
            <div className="grid gap-2">
              <div className="text-xs font-extrabold text-zinc-500">الأزرار</div>
              <div className="flex flex-wrap gap-2">
                <Link onClick={() => setOpen(false)} className={pill} href="/catalog">الكتالوج</Link>
                <Link onClick={() => setOpen(false)} className={pill} href="/cart">
                  السلة
                  {totalSeries > 0 && <span className="jk-badge-red">{totalSeries}</span>}
                </Link>
                <Link onClick={() => setOpen(false)} className={pill} href="/contact">تواصل معنا</Link>
                <Link onClick={() => setOpen(false)} className={pill} href="/policy">السياسة</Link>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-xs font-extrabold text-zinc-500">التصنيفات</div>
              <div className="flex flex-wrap gap-2">
                {seasons.map((s) => (
                  <Link
                    key={s.value}
                    onClick={() => setOpen(false)}
                    className={pill}
                    href={`/catalog?season=${encodeURIComponent(s.value)}`}
                  >
                    موسم: {s.label}
                  </Link>
                ))}
                {promos.map((p) => (
                  <Link
                    key={p.value}
                    onClick={() => setOpen(false)}
                    className={pill}
                    href={`/catalog?promo=${encodeURIComponent(p.value)}`}
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-xs font-extrabold text-zinc-500">الموديلات</div>
              {models.length === 0 ? (
                <div className="text-sm text-zinc-500">سيظهر هنا بعد إضافة منتجات.</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {models.slice(0, 18).map((m) => (
                    <Link
                      key={m}
                      onClick={() => setOpen(false)}
                      className={pill}
                      href={`/catalog?category=${encodeURIComponent(m)}`}
                    >
                      موديل {m}
                    </Link>
                  ))}
                  {models.length > 18 && (
                    <Link onClick={() => setOpen(false)} className={pill} href="/catalog">
                      المزيد…
                    </Link>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setOpen(false)}
              className="jk-btn jk-btn-outline w-full"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
