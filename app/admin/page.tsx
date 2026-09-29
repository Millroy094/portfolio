import { Loader2 } from "lucide-react";
import { Suspense } from "react";

import AdminForm from "@/app/admin/AdminForm";
import { getProfileData } from "@/app/admin/AdminForm/actions/getProfileData";
import type { ProfileSchemaType } from "@/app/admin/AdminForm/schema";

export const dynamic = "force-dynamic";

async function AdminFormWrapper() {
  let profileId: string | null = null;
  let data: ProfileSchemaType | null = null;
  let error: Error | null = null;

  try {
    const result = await getProfileData();
    profileId = result.profileId;
    data = result.data;
  } catch (err) {
    console.error("Failed to load admin form:", err);
    error = err instanceof Error ? err : new Error("Unknown error");
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Failed to load profile</h2>
          <p className="text-gray-600 mb-4">Please refresh the page to try again</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return <AdminForm profileId={profileId} data={data} />;
}

function AdminFormFallback() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
    </div>
  );
}

export default function AdminPage() {
  return (
    <main className="pt-3">
      <h1 className="font-bold ml-3 mb-3">Admin Dashboard</h1>
      <Suspense fallback={<AdminFormFallback />}>
        <AdminFormWrapper />
      </Suspense>
    </main>
  );
}
