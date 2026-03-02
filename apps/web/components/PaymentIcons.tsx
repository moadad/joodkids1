"use client";

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center justify-center h-10 w-10 rounded-2xl border border-zinc-200 bg-white">
    {children}
  </span>
);

export default function PaymentIcons() {
  const Item = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="flex items-center gap-2">
      <Icon>{children}</Icon>
      <span className="text-xs font-bold text-zinc-600">{label}</span>
    </div>
  );

  // Minimal, clean icons (no brand infringement): simple glyphs
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <Item label="فودافون كاش">
        <span className="text-[rgb(var(--jk-red))] font-extrabold">V</span>
      </Item>
      <Item label="اتصالات كاش">
        <span className="text-[rgb(var(--jk-sky))] font-extrabold">E</span>
      </Item>
      <Item label="أورنج كاش">
        <span className="text-orange-500 font-extrabold">O</span>
      </Item>
      <Item label="إنستا باي">
        <span className="text-[rgb(var(--jk-navy))] font-extrabold">IP</span>
      </Item>
      <Item label="كاش">
        <span className="text-emerald-600 font-extrabold">£</span>
      </Item>
      <Item label="بوليصة شحن">
        <span className="text-zinc-700 font-extrabold">📦</span>
      </Item>
    </div>
  );
}
