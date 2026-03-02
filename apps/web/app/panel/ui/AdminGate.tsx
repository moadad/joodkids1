"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebase";

export default function AdminGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAllowed(true);
      } else {
        window.location.href = "/";
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return null;

  return <>{allowed && children}</>;
}