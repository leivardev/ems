import { getSessionUser, isCompanyAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function UsersPage() {
  const user = await getSessionUser();
  if (!user || !isCompanyAdmin(user)) return null;

  const users = await prisma.user.findMany({
    where: { companyId: user.companyId },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Company Users</h2>
      <ul className="space-y-2">
        {users.map(u => (
          <li key={u.id} className="border p-4 rounded">
            <div className="font-medium">{u.name} ({u.email})</div>
            <div className="text-sm text-gray-500">{u.role}</div>
            {u.role !== "COMPANY_ADMIN" && (
              <Link
                href={`/api/admin/users/${u.id}/promote`}
                className="text-sm text-blue-600 underline"
              >
                Promote to Admin
              </Link>
            )}
            <form
              action={`/api/admin/users/${u.id}/delete`}
              method="post"
              className="inline-block ml-4"
            >
              <button type="submit" className="text-sm text-red-600 underline">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}