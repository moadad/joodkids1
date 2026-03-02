"use client";

import { useEffect, useState } from "react";
import { CompanyProfile, getCompanyProfile } from "@/lib/company";

function IconButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-semibold hover:bg-zinc-50"
    >
      {label}
    </a>
  );
}

export default function ContactClient() {
  const [c, setC] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    getCompanyProfile().then(setC);
  }, []);

  const whatsapp = c?.whatsapp ? `https://wa.me/${c.whatsapp.replace(/\D/g, "")}` : null;

  return (
    <div className="rounded-3xl border border-zinc-200 p-6 grid gap-4">
      <div className="text-sm">
        <div className="font-semibold">بيانات الشركة</div>
        <div className="text-zinc-600 mt-1">{c?.name ?? "—"}</div>
      </div>

      <div className="flex flex-wrap gap-3">
        {c?.social?.instagram && <IconButton href={c.social.instagram} label="Instagram" />}
        {c?.social?.facebook && <IconButton href={c.social.facebook} label="Facebook" />}
        {c?.social?.telegram && <IconButton href={c.social.telegram} label="Telegram" />}
        {whatsapp && <IconButton href={whatsapp} label="WhatsApp" />}
      </div>

      <div className="grid md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl border border-zinc-200 p-4">
          <div className="font-semibold">موقع المصنع</div>
          {c?.locations?.factoryMapUrl ? (
            <a className="text-zinc-600 hover:underline" href={c.locations.factoryMapUrl} target="_blank" rel="noreferrer">
              فتح على الخرائط
            </a>
          ) : <div className="text-zinc-500">غير متوفر</div>}
        </div>
        <div className="rounded-2xl border border-zinc-200 p-4">
          <div className="font-semibold">موقع المحل</div>
          {c?.locations?.shopMapUrl ? (
            <a className="text-zinc-600 hover:underline" href={c.locations.shopMapUrl} target="_blank" rel="noreferrer">
              فتح على الخرائط
            </a>
          ) : <div className="text-zinc-500">غير متوفر</div>}
        </div>
      </div>
    </div>
  );
}
