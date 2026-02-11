import AdminForm from "@/app/admin/AdminForm";

export default function AdminPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 className="font-bold mb-3">Admin Dashboard</h1>
      <AdminForm />
    </main>
  );
}
