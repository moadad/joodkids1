import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export type OrderStatus = "new" | "confirmed" | "shipped" | "cancelled";
export type PaymentMethod = "cash" | "shipping_policy";

export type OrderItem = {
  code: number;
  name: string;
  seriesQty: 6 | 9 | 12;
  seriesCount: number;
  promo: "عادي" | "عرض" | "خصم";
  imageUrl?: string;
};

export type OrderDoc = {
  createdAt: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  customer: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
  note?: string;
  items: OrderItem[];
};

export async function createOrder(order: OrderDoc) {
  const ref = await addDoc(collection(db, "orders"), order);
  return ref.id;
}

export async function listOrders(): Promise<(OrderDoc & { id: string })[]> {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snaps = await getDocs(q);
  return snaps.docs.map(d => ({ id: d.id, ...(d.data() as OrderDoc) }));
}

export async function getOrder(id: string): Promise<(OrderDoc & { id: string }) | null> {
  const snap = await getDoc(doc(db, "orders", id));
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as OrderDoc) }) : null;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  await updateDoc(doc(db, "orders", id), { status });
}
