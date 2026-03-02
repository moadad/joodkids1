"use client";

import Link from "next/link";
import Logo from "./Logo";
import { useCart } from "./CartProvider";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const { totalSeries } = useCart();

  return (
    <header className="sticky top-0 z-20 bg-white/85 backdrop-blur border-b border-zinc-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <MobileMenu />
          <Link
            className="hidden sm:inline-flex rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold hover:bg-zinc-50"
            href="/catalog"
          >
            الكتالوج
          </Link>
        </div>

        <div className="flex-1 flex justify-center">
          <Logo />
        </div>

        <div className="flex items-center gap-2">
          <Link
            className="relative rounded-2xl bg-[rgb(var(--jk-navy))] text-white px-4 py-2 text-sm font-extrabold hover:opacity-95"
            href="/cart"
          >
            السلة
            {totalSeries > 0 && (
              <span className="absolute -top-2 -left-2 bg-[rgb(var(--jk-red))] text-white text-xs rounded-full px-2 py-0.5">
                {totalSeries}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
