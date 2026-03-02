"use client";

import { useEffect, useState } from "react";

export default function SeriesQtyModal({
  open,
  onClose,
  onConfirm,
  productName,
  seriesQty,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (seriesCount: number) => void;
  productName: string;
  seriesQty: 6 | 9 | 12;
}) {
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    if (open) setCount(1);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <button
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative w-full max-w-md rounded-3xl border border-zinc-200 bg-white shadow-xl overflow-hidden">
        <div className="jk-gradient px-5 py-4">
          <div className="text-white font-extrabold">تحديد كمية السيري</div>
          <div className="text-white/90 text-xs mt-1">{productName}</div>
        </div>

        <div className="p-5 grid gap-4">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[rgb(var(--jk-navy))]">ملاحظة</span>
              <span className="jk-badge">سيري: {seriesQty}</span>
            </div>
            <div className="text-xs text-zinc-600 mt-2">
              اختر عدد السيري المطلوب (مثال: عدد السيري 2 = إجمالي القطع {2 * seriesQty}).
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-extrabold">عدد السيري</div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
                onClick={() => setCount((v) => Math.max(1, v - 1))}
              >
                -
              </button>
              <input
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.floor(Number(e.target.value || 1))))}
                className="w-20 rounded-xl border border-zinc-200 px-3 py-2 text-sm text-center"
                inputMode="numeric"
              />
              <button
                className="rounded-xl border border-zinc-200 px-3 py-2 text-sm hover:bg-zinc-50"
                onClick={() => setCount((v) => v + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="text-xs text-zinc-600">
            الإجمالي المتوقع: <b>{count * seriesQty}</b> قطعة
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="jk-btn jk-btn-outline" onClick={onClose}>
              إلغاء
            </button>
            <button
              className="jk-btn jk-btn-primary"
              onClick={() => onConfirm(count)}
            >
              إضافة للسلة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
