import AdminGate from "../ui/AdminGate";
import ProductsClient from "./ui";

export default function ProductsPage() {
  return (
    <AdminGate>
      <ProductsClient />
    </AdminGate>
  );
}
