"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { watchAdmin } from "@/lib/panel";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const unsub = watchAdmin(
      () => setOk(true),
      () => router.replace("/panel/login")
    );
    return () => unsub();
  }, [router]);

  if (!ok) return <div className="text-sm text-zinc-600">جار التحقق من صلاحيات الأدمن…</div>;
  return <>{children}</>;
}
