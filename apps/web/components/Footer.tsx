"use client";

import PaymentIcons from "@/components/PaymentIcons";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 grid gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-zinc-600">
            <b className="text-[rgb(var(--jk-navy))]">جود كيدز</b> — يتم البيع بالسيري فقط.
          </div>
          <div className="text-xs text-zinc-500">
            © {new Date().getFullYear()} JoodKids
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 p-5 bg-[rgb(var(--jk-bg))]">
          <div className="text-xs font-extrabold text-zinc-600 mb-3">طرق الدفع</div>
          <PaymentIcons />
        </div>
      </div>
    </footer>
  );
}
