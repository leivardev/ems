import { getSessionUser } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await getSessionUser();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <p>Email: {user?.email}</p>
      <p>Company: {user?.company?.name || "—"}</p>
      <p>Role: {user?.isGlobalAdmin ? "EMS Admin" : user?.role}</p>
    </div>
  );
}