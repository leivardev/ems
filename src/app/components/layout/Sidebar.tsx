import Link from "next/link";
import { User } from "@/generated/prisma";

export function Sidebar({ user }: { user: User }) {
  const isAdmin = user.isGlobalAdmin || user.role === "COMPANY_ADMIN";

  return (
    <aside className="w-64 bg-gray-500 border-r p-4 space-y-4">
      <h2 className="text-xl font-semibold">Menu</h2>
      <ul className="space-y-2">
        <li><Link href="/dashboard" className="hover:font-bold">Home</Link></li>
        <li><Link href="/dashboard/events" className="hover:font-bold">Events</Link></li>
        {isAdmin && <li><Link href="/dashboard/users" className="hover:font-bold">Users</Link></li>}
        <li><Link href="/dashboard/settings" className="hover:font-bold">Settings</Link></li>
      </ul>
    </aside>
  );
}
