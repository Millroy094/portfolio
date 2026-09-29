import AdminForm from "@/app/admin/AdminForm";
import { getProfileData } from "@/app/admin/AdminForm/actions/getProfileData";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let profileId: string | null = null;
  let data = null;

  try {
    const result = await getProfileData();
    profileId = result.profileId;
    data = result.data;
  } catch (error) {
    console.error("Failed to load profile data on admin page:", error);
  }

  return (
    <main className="pt-3">
      <h1 className="font-bold ml-3 mb-3">Admin Dashboard</h1>
      <AdminForm profileId={profileId} data={data} />
    </main>
  );
}
