"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { createOrder, PaymentMethod } from "@/lib/orders";
import { getCompanyProfile } from "@/lib/company";
import PaymentIcons from "@/components/PaymentIcons";

function sanitizePhone(s: string) {
  return s.replace(/\D/g, "");
}

function buildWhatsappMessage(orderId: string, payload: {
  customerName: string;
  customerPhone: string;
  city: string;
  address: string;
  paymentMethod: PaymentMethod;
  note?: string;
  items: { code: number; name: string; seriesQty: number; seriesCount: number; promo: string }[];
}) {
  const lines: string[] = [];
  lines.push("طلب جديد (جود كيدز)");
  lines.push(`رقم الطلب: ${orderId}`);
  lines.push(`الاسم: ${payload.customerName}`);
  lines.push(`الهاتف: ${payload.customerPhone}`);
  lines.push(`المحافظة/المدينة: ${payload.city}`);
  lines.push(`العنوان: ${payload.address}`);
  lines.push(`طريقة الدفع: ${payload.paymentMethod === "cash" ? "كاش" : "بوليصة شحن"}`);
  if (payload.note) lines.push(`ملاحظات: ${payload.note}`);
  lines.push("— المنتجات —");
  payload.items.forEach((it) => {
    lines.push(`- ${it.name} (كود ${it.code}) | سيري ${it.seriesQty} | عدد السيري: ${it.seriesCount} | ${it.promo}`);
  });
  return encodeURIComponent(lines.join("\n"));
}

export default function CartClient() {
  const router = useRouter();
  const { items, totalSeries, setSeriesCount, remove, clear } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (items.length === 0) return false;
    if (!customerName.trim()) return false;
    if (sanitizePhone(customerPhone).length < 8) return false;
    if (!city.trim()) return false;
    if (!address.trim()) return false; // العنوان يظهر بكل الحالات
    return true;
  }, [items.length, customerName, customerPhone, city, address]);

  const onSubmit = async () => {
    setMsg(null);
    if (!canSubmit) {
      setMsg("يرجى إدخال جميع البيانات المطلوبة.");
      return;
    }
    setBusy(true);
    try {
      const orderDoc = {
        createdAt: Date.now(),
        status: "new" as const,
        paymentMethod,
        customer: {
          name: customerName.trim(),
          phone: sanitizePhone(customerPhone),
          city: city.trim(),
          address: address.trim(),
        },
        note: note.trim() || undefined,
        items: items.map((i) => ({
          code: i.code,
          name: i.name,
          seriesQty: i.seriesQty,
          seriesCount: i.seriesCount,
          promo: i.promo,
          imageUrl: i.imageUrl,
        })),
      };

      // 1) سجل الطلب في Firestore
      const orderId = await createOrder(orderDoc);

      // 2) افتح واتساب برسالة جاهزة (اختياري/افتراضي)
      const profile = await getCompanyProfile();
      const wa = profile?.whatsapp ? sanitizePhone(profile.whatsapp) : "";
      if (wa) {
        const message = buildWhatsappMessage(orderId, {
          customerName: orderDoc.customer.name,
          customerPhone: orderDoc.customer.phone,
          city: orderDoc.customer.city,
          address: orderDoc.customer.address,
          paymentMethod: orderDoc.paymentMethod,
          note: orderDoc.note,
          items: orderDoc.items.map((it) => ({
            code: it.code,
            name: it.name,
            seriesQty: it.seriesQty,
            seriesCount: it.seriesCount,
            promo: it.promo,
          })),
        });
        const url = `https://wa.me/${wa}?text=${message}`;
        window.open(url, "_blank");
      }

      clear();
      router.push(`/order/success?id=${orderId}`);
    } catch (e: any) {
      setMsg(e?.message ?? "حدث خطأ أثناء إرسال الطلب.");
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-zinc-200 p-6">
        <div className="text-sm text-zinc-600">السلة فارغة.</div>
        <Link href="/catalog" className="inline-block mt-4 rounded-2xl bg-zinc-900 text-white px-5 py-3 text-sm font-semibold">
          الذهاب للكتالوج
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,380px]">
      <div className="rounded-3xl border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 font-semibold text-sm">المنتجات ({totalSeries} سيري)</div>
        <div className="divide-y divide-zinc-200">
          {items.map((it, index) => (
            <div key={it.code ? `${it.code}-${index}` : `cart-${index}`} className="p-6 grid gap-4 md:grid-cols-[90px,1fr,160px,auto] items-center">
              <div className="relative h-20 w-24 rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50">
                {it.imageUrl ? (
                  <Image src={it.imageUrl} alt={it.name || "منتج جود كيدز"} fill className="object-contain" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-400">—</div>
                )}
              </div>

              <div>
                <div className="text-xs text-zinc-500">كود: {it.code} • {it.promo} • سيري {it.seriesQty}</div>
                <div className="font-bold">{it.name}</div>
                <div className="text-xs text-zinc-600 mt-1">
                  الكمية = {it.seriesCount} سيري (إجمالي القطع: {it.seriesCount * it.seriesQty})
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
                  onClick={() => setSeriesCount(it.code, Math.max(1, it.seriesCount - 1))}
                >
                  -
                </button>
                <input
                  value={it.seriesCount}
                  onChange={(e) => setSeriesCount(it.code, Number(e.target.value))}
                  className="w-16 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-center"
                  inputMode="numeric"
                />
                <button
                  className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
                  onClick={() => setSeriesCount(it.code, it.seriesCount + 1)}
                >
                  +
                </button>
              </div>

              <button
                onClick={() => remove(it.code)}
                className="rounded-2xl border border-red-200 text-red-700 px-4 py-2 text-sm hover:bg-red-50"
              >
                حذف
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-zinc-200 p-6">
        <div className="font-extrabold text-lg">إرسال الطلب</div>
        <p className="text-xs text-zinc-600 mt-1">سيتم تسجيل الطلب لدينا، كما سيتم فتح واتساب برسالة جاهزة (إن توفر رقم واتساب).</p>

        {msg && <div className="mt-3 text-sm text-red-700">{msg}</div>}

        <div className="mt-4 grid gap-3">
          <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm" placeholder="الاسم"
            value={customerName} onChange={(e)=>setCustomerName(e.target.value)} />
          <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm" placeholder="رقم الهاتف"
            value={customerPhone} onChange={(e)=>setCustomerPhone(e.target.value)} inputMode="tel" />
          <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm" placeholder="المحافظة / المدينة"
            value={city} onChange={(e)=>setCity(e.target.value)} />
          <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm" placeholder="العنوان"
            value={address} onChange={(e)=>setAddress(e.target.value)} />

          <div>
            <div className="text-xs text-zinc-500 mb-1">طريقة الدفع</div>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
            >
              <option value="cash">كاش</option>
              <option value="shipping_policy">بوليصة شحن</option>
            </select>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-xs font-extrabold text-zinc-600 mb-2">طرق الدفع</div>
            <PaymentIcons />
          </div>

          <textarea className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm min-h-[90px]"
            placeholder="ملاحظات (اختياري)" value={note} onChange={(e)=>setNote(e.target.value)} />

          <button
            disabled={!canSubmit || busy}
            onClick={onSubmit}
            className="rounded-2xl bg-zinc-900 text-white px-5 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {busy ? "جار الإرسال…" : "إرسال الطلب"}
          </button>

          <button
            onClick={clear}
            className="rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold hover:bg-zinc-50"
          >
            تفريغ السلة
          </button>
        </div>
      </div>
    </div>
  );
}
