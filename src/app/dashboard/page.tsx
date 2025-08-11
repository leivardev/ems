import { getSessionUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getSessionUser();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name || "User"}!</h1>
      <p className="text-muted-foreground">
        You are logged in as {user?.isGlobalAdmin ? "EMS Admin" : user?.role?.toLowerCase().replace("_", " ")}
      </p>
    </div>
  );
};