import AdminGate from "../ui/AdminGate";
import ImportExportClient from "./ui";

export default function ImportExportPage() {
  return (
    <AdminGate>
      <ImportExportClient />
    </AdminGate>
  );
}
