"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getProductById, ProductDoc } from "@/lib/products";
import Lightbox from "@/components/Lightbox";
import AddToCartButton from "@/components/AddToCartButton";
import Link from "next/link";

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="jk-badge">
      {children}
    </span>
  );
}

export default function ProductClient({ id }: { id: string }) {
  const [p, setP] = useState<ProductDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useEffect(() => {
    getProductById(id).then(setP).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-sm text-zinc-600">جار التحميل…</div>;
  if (!p) return <div className="text-sm text-zinc-600">المنتج غير موجود.</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="grid gap-3">
        <div className="rounded-3xl border border-zinc-200 overflow-hidden bg-zinc-50">
          <div className="relative aspect-[4/3]">
            {p.images?.[0]?.url ? (
              <button className="absolute inset-0" onClick={() => setLightboxSrc(p.images[0].url)} aria-label="Open image">
                <Image src={p.images[0].url} alt={p.name} fill className="object-contain" />
              </button>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-400">لا توجد صورة</div>
            )}
          </div>
        </div>

        {p.images?.length > 1 && (
          <div className="flex gap-2 overflow-auto">
            {p.images.map((img, idx) => (
              <button
                key={idx}
                className="relative h-20 w-28 rounded-2xl border border-zinc-200 bg-white overflow-hidden shrink-0"
                onClick={() => setLightboxSrc(img.url)}
              >
                <Image src={img.url} alt={`${p.name} ${idx + 1}`} fill className="object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-zinc-200 p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {p.promo !== "عادي" && <Badge>{p.promo}</Badge>}
          <Badge>سيري {p.seriesQty}</Badge>
          <Badge>{p.season}</Badge>
          <Badge>تصنيف {p.mainCategory}</Badge>
        </div>

        <div className="text-xs text-zinc-500">كود: {p.code}</div>
        <h1 className="text-2xl font-extrabold mt-2">{p.name}</h1>
        {p.description && <p className="text-sm text-zinc-600 mt-3 whitespace-pre-line">{p.description}</p>}

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          <div className="font-semibold mb-1">تنويه</div>
          البيع بالجملة فقط — يتم البيع بالسيري (ليس بالمقاس/القطعة).
        </div>

        <div className="mt-6 flex gap-3 flex-wrap">
          <AddToCartButton product={p} />
          <Link href="/cart" className="jk-btn jk-btn-outline">
            الذهاب للسلة
          </Link>
        </div>
      </div>

      {lightboxSrc && (
        <Lightbox src={lightboxSrc} alt={p.name} onClose={() => setLightboxSrc(null)} />
      )}
    </div>
  );
}
