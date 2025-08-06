import prisma from "@/lib/prisma";
import { getSessionUser, isEmsAdmin } from "@/lib/auth";
import Link from "next/link";

export default async function EventsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const events = await prisma.event.findMany({
    where: isEmsAdmin(user) ? undefined : { companyId: user.companyId ?? undefined },
    orderBy: { startTime: "asc" },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Events</h2>
      <Link href="/dashboard/events/new" className="text-blue-600 underline">
        Create New Event
      </Link>
      <ul className="mt-4 space-y-2">
        {events.map(event => (
          <li key={event.id} className="border p-4 rounded">
            <div className="font-medium">{event.title}</div>
            <div className="text-sm text-gray-500">{new Date(event.startTime).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}