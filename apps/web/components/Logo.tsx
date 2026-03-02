"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function Logo() {
  const router = useRouter();
  const taps = useRef<number[]>([]);

  const handleTap = () => {
    const now = Date.now();
    taps.current = [...taps.current.filter((t) => now - t < 1200), now];
    if (taps.current.length >= 5) {
      taps.current = [];
      router.push("/control-login-9847");
    }
  };

  return (
    <div className="flex items-center gap-3 select-none">
      <button
        onClick={handleTap}
        className="relative h-10 w-10 rounded-2xl overflow-hidden border border-zinc-200 bg-white"
        aria-label="logo"
      >
        <Image src="/logo.png" alt="Jood Kids" fill className="object-contain" />
      </button>
      <Link href="/" className="font-extrabold text-[rgb(var(--jk-navy))]">
        جود كيدز
      </Link>
    </div>
  );
}
