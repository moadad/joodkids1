import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { computeMainCategory, Season, Promo } from "./categories";

export type ProductImage = { url: string; publicId: string; width?: number; height?: number };

export type SeriesQty = 6 | 9 | 12;

export type ProductDoc = {
  code: number;
  name: string;
  season: Season;
  promo: Promo;
  seriesQty: SeriesQty;
  mainCategory: string;
  description?: string;
  images: ProductImage[];
  createdAt: number;
  updatedAt: number;
};

export function productIdFromCode(code: number) {
  return String(Math.trunc(code));
}

export async function upsertProduct(
  input: Omit<ProductDoc, "mainCategory" | "createdAt" | "updatedAt">
) {
  const now = Date.now();
  const id = productIdFromCode(input.code);
  const ref = doc(db, "products", id);
  const existing = await getDoc(ref);

  const docData: ProductDoc = {
    ...input,
    mainCategory: computeMainCategory(input.code),
    createdAt: existing.exists() ? (existing.data() as ProductDoc).createdAt : now,
    updatedAt: now,
  };

  await setDoc(ref, docData, { merge: true });
}

export async function deleteProductByCode(code: number) {
  const id = productIdFromCode(code);
  await deleteDoc(doc(db, "products", id));
}

export async function listProducts(): Promise<ProductDoc[]> {
  const q = query(collection(db, "products"), orderBy("updatedAt", "desc"));
  const snaps = await getDocs(q);
  return snaps.docs.map((d) => d.data() as ProductDoc);
}

export async function getProductById(id: string): Promise<ProductDoc | null> {
  const snap = await getDoc(doc(db, "products", id));
  return snap.exists() ? (snap.data() as ProductDoc) : null;
}
