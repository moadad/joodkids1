"use client";

import Image from "next/image";
import { useEffect } from "react";

export default function Lightbox({
  src,
  alt,
  onClose
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 p-4 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
        <Image src={src} alt={alt} fill className="object-contain" sizes="(max-width: 768px) 100vw, 900px" />
      </div>
      <button
        className="absolute top-4 left-4 rounded-xl bg-white/90 px-3 py-2 text-sm"
        onClick={onClose}
      >
        إغلاق
      </button>
    </div>
  );
}
