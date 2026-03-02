"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "@/lib/firebase";

export default function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onLogin = async () => {
    setMsg(null);
    setBusy(true);
    try {
      const auth = getAuth(app);
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await cred.user.getIdToken(true);

      const res = await fetch("/api/panel-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) {
        setMsg("ليس لديك صلاحية.");
        return;
      }

      router.replace("/panel");
    } catch {
      setMsg("بيانات الدخول غير صحيحة.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden">
      <div className="jk-gradient px-6 py-5">
        <div className="text-white font-extrabold text-lg">تسجيل دخول الإدارة</div>
        <div className="text-white/90 text-xs mt-1">Email / Password</div>
      </div>

      <div className="p-6 grid gap-3">
        {msg && <div className="text-sm text-red-700">{msg}</div>}
        <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm" placeholder="Email"
          value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" />
        <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm" placeholder="Password" type="password"
          value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={onLogin} disabled={busy || !email || !password}
          className="jk-btn jk-btn-primary w-full disabled:opacity-60">
          {busy ? "جارٍ الدخول..." : "دخول"}
        </button>
      </div>
    </div>
  );
}
