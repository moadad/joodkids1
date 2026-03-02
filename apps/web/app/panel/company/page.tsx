import AdminGate from "../ui/AdminGate";
import CompanyClient from "./ui";

export default function CompanyPage() {
  return (
    <AdminGate>
      <CompanyClient />
    </AdminGate>
  );
}
