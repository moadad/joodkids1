"use client";

import { useEffect, useState } from "react";
import { listOrders, updateOrderStatus, type OrderDoc, type OrderStatus } from "@/lib/orders";

const statuses: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "جديد" },
  { value: "confirmed", label: "تم التأكيد" },
  { value: "shipped", label: "تم الشحن" },
  { value: "cancelled", label: "ملغي" },
];

function badgeClass(s: OrderStatus) {
  switch (s) {
    case "new": return "bg-blue-50 border-blue-200 text-blue-700";
    case "confirmed": return "bg-emerald-50 border-emerald-200 text-emerald-700";
    case "shipped": return "bg-purple-50 border-purple-200 text-purple-700";
    case "cancelled": return "bg-red-50 border-red-200 text-red-700";
  }
}

export default function OrdersClient() {
  const [orders, setOrders] = useState<(OrderDoc & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      setOrders(await listOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onChangeStatus = async (id: string, status: OrderStatus) => {
    setMsg(null);
    try {
      await updateOrderStatus(id, status);
      await refresh();
      setMsg("تم تحديث الحالة ✅");
    } catch (e: any) {
      setMsg(e?.message ?? "خطأ أثناء تحديث الحالة");
    }
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold">الطلبات</h1>
          <p className="text-sm text-zinc-600 mt-1">عرض وإدارة الطلبات الواردة من السلة.</p>
        </div>
        <button onClick={refresh} className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50">
          تحديث
        </button>
      </div>

      {msg && <div className="text-sm">{msg}</div>}

      <div className="rounded-3xl border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 font-semibold text-sm">قائمة الطلبات</div>
        {loading ? (
          <div className="p-6 text-sm text-zinc-600">جار التحميل…</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-sm text-zinc-600">لا توجد طلبات.</div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {orders.map((o) => (
              <div key={o.id} className="p-6 grid gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-zinc-500">ID: {o.id}</div>
                    <div className="font-bold">
                      {o.customer.name} • {o.customer.phone}
                    </div>
                    <div className="text-sm text-zinc-600">
                      {o.customer.city} — {o.customer.address}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">
                      الدفع: {o.paymentMethod === "cash" ? "كاش" : "بوليصة شحن"} • عناصر: {o.items.length}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(o.status)}`}>
                      {statuses.find(s => s.value === o.status)?.label}
                    </span>
                    <select
                      value={o.status}
                      onChange={(e) => onChangeStatus(o.id, e.target.value as OrderStatus)}
                      className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm"
                    >
                      {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 p-4 bg-zinc-50">
                  <div className="text-xs text-zinc-500 mb-2">تفاصيل المنتجات</div>
                  <div className="grid gap-2 text-sm">
                    {o.items.map((it, idx) => (
                      <div key={idx} className="flex flex-wrap gap-2 justify-between">
                        <span>
                          <b>{it.name}</b> (كود {it.code}) — {it.promo} — سيري {it.seriesQty} — عدد السيري: {it.seriesCount}
                        </span>
                        <span className="text-zinc-600">إجمالي القطع: {it.seriesCount * it.seriesQty}</span>
                      </div>
                    ))}
                  </div>
                  {o.note && <div className="mt-3 text-sm text-zinc-700"><b>ملاحظات:</b> {o.note}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
