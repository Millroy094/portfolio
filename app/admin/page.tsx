import AdminForm from "@/app/admin/AdminForm";
import { getProfileData } from "@/app/admin/AdminForm/actions/getProfileData";

export default async function AdminPage() {
  const { profileId, data } = await getProfileData();
  return (
    <main className="pt-3">
      <h1 className="font-bold ml-3 mb-3">Admin Dashboard</h1>
      <AdminForm profileId={profileId} data={data} />
    </main>
  );
}
