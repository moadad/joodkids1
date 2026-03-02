import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export type CompanyProfile = {
  name: string;
  phones: string[];
  whatsapp?: string;
  social: { instagram?: string; facebook?: string; telegram?: string };
  locations: { factoryMapUrl?: string; shopMapUrl?: string };
};

export async function getCompanyProfile(): Promise<CompanyProfile | null> {
  const ref = doc(db, "company", "profile");
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as CompanyProfile) : null;
}

export async function saveCompanyProfile(profile: CompanyProfile) {
  const ref = doc(db, "company", "profile");
  await setDoc(ref, profile, { merge: true });
}
