import AdminGate from "../ui/AdminGate";
import DangerClient from "./ui";

export default function DangerZonePage() {
  return (
    <AdminGate>
      <DangerClient />
    </AdminGate>
  );
}
