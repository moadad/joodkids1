import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebaseAdmin";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = (await cookies()).get("jk_session")?.value;
  if (!session) redirect("/");

  try {
    const decoded = await adminAuth.verifySessionCookie(session, true);
    if (!decoded.admin) redirect("/");
  } catch {
    redirect("/");
  }

  return <>{children}</>;
}
