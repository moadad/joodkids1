import CatalogClient from "./ui";

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-extrabold">الكتالوج</h1>
      <p className="text-sm text-zinc-600 mt-1">فلترة حسب التصنيف التلقائي والموسم.</p>
      <div className="mt-6">
        <CatalogClient />
      </div>
    </div>
  );
}
