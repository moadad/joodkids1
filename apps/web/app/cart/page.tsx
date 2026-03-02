import CartClient from "./ui";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-extrabold">السلة</h1>
      <p className="text-sm text-zinc-600 mt-1">
        البيع بالجملة فقط — تتم إضافة المنتجات بالسيري (6/9/12) وليس بالمقاس أو القطعة.
      </p>
      <div className="mt-6">
        <CartClient />
      </div>
    </div>
  );
}
