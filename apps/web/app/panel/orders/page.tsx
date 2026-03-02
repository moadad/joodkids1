import AdminGate from "../ui/AdminGate";
import OrdersClient from "./ui";

export default function OrdersPage() {
  return (
    <AdminGate>
      <OrdersClient />
    </AdminGate>
  );
}
