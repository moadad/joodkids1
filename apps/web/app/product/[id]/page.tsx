import ProductClient from "./ui";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <ProductClient id={id} />
    </div>
  );
}
