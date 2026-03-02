"use client";

import { useEffect, useState } from "react";
import { CompanyProfile, getCompanyProfile, saveCompanyProfile } from "@/lib/company";

export default function CompanyClient() {
  const [profile, setProfile] = useState<CompanyProfile>({
    name: "جود كيدز",
    phones: [],
    whatsapp: "",
    social: { instagram: "", facebook: "", telegram: "" },
    locations: { factoryMapUrl: "", shopMapUrl: "" }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    getCompanyProfile().then((p) => {
      if (p) setProfile({
        name: p.name ?? "جود كيدز",
        phones: p.phones ?? [],
        whatsapp: p.whatsapp ?? "",
        social: p.social ?? {},
        locations: p.locations ?? {}
      } as any);
    }).finally(() => setLoading(false));
  }, []);

  const onSave = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await saveCompanyProfile(profile);
      setMsg("تم الحفظ ✅");
    } catch (e: any) {
      setMsg(e?.message ?? "خطأ أثناء الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-sm text-zinc-600">جار التحميل…</div>;

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold">بيانات الشركة</h1>
          <p className="text-sm text-zinc-600 mt-1">روابط التواصل + مواقع خرائط المصنع/المحل.</p>
        </div>
        <button onClick={onSave} disabled={saving}
          className="rounded-2xl bg-zinc-900 text-white px-5 py-3 text-sm font-semibold disabled:opacity-60">
          {saving ? "جار الحفظ…" : "حفظ"}
        </button>
      </div>

      {msg && <div className="text-sm">{msg}</div>}

      <div className="rounded-3xl border border-zinc-200 p-6 grid gap-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-zinc-500 mb-1">اسم الشركة</div>
            <input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
              value={profile.name} onChange={(e)=>setProfile({...profile, name: e.target.value})}/>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">واتساب (مثال: 2010xxxxxxx)</div>
            <input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
              value={profile.whatsapp ?? ""} onChange={(e)=>setProfile({...profile, whatsapp: e.target.value})}/>
          </div>
        </div>

        <div>
          <div className="text-xs text-zinc-500 mb-1">أرقام الهاتف (افصل بفواصل)</div>
          <input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
            value={(profile.phones ?? []).join(", ")}
            onChange={(e)=>setProfile({...profile, phones: e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})}/>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-zinc-500 mb-1">Instagram</div>
            <input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
              value={profile.social?.instagram ?? ""} onChange={(e)=>setProfile({...profile, social: {...profile.social, instagram: e.target.value}})}/>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">Facebook</div>
            <input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
              value={profile.social?.facebook ?? ""} onChange={(e)=>setProfile({...profile, social: {...profile.social, facebook: e.target.value}})}/>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">Telegram</div>
            <input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
              value={profile.social?.telegram ?? ""} onChange={(e)=>setProfile({...profile, social: {...profile.social, telegram: e.target.value}})}/>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-zinc-500 mb-1">موقع المصنع (Google Maps URL)</div>
            <input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
              value={profile.locations?.factoryMapUrl ?? ""} onChange={(e)=>setProfile({...profile, locations: {...profile.locations, factoryMapUrl: e.target.value}})}/>
          </div>
          <div>
            <div className="text-xs text-zinc-500 mb-1">موقع المحل (Google Maps URL)</div>
            <input className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
              value={profile.locations?.shopMapUrl ?? ""} onChange={(e)=>setProfile({...profile, locations: {...profile.locations, shopMapUrl: e.target.value}})}/>
          </div>
        </div>
      </div>
    </div>
  );
}
