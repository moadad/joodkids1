"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/panel");
    } catch (e: any) {
      setErr(e?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-extrabold">دخول الأدمن</h1>
      <p className="text-sm text-zinc-600 mt-1">هذه الصفحة خاصة بإدارة الموقع فقط.</p>

      <form onSubmit={onSubmit} className="mt-6 grid gap-3">
        <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
          placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm"
          placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {err && <div className="text-sm text-red-700">{err}</div>}
        <button disabled={loading} className="rounded-2xl bg-zinc-900 text-white px-4 py-3 text-sm font-semibold disabled:opacity-60">
          {loading ? "جار الدخول…" : "دخول"}
        </button>
      </form>
    </div>
  );
}
