import AdminForm from "@/app/admin/AdminForm";
import { getProfileData } from "@/app/admin/AdminForm/actions/getProfileData";

export default async function AdminPage() {
  const { profileId, data } = await getProfileData();
  return (
    <main style={{ padding: 24 }}>
      <h1 className="font-bold mb-3">Admin Dashboard</h1>
      <AdminForm profileId={profileId} data={data} />
    </main>
  );
}
