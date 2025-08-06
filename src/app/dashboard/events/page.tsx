import { getSessionUser, isEmsAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import EventList from "@/app/components/events/EventList";

export default async function EventsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const events = await prisma.event.findMany({
    where: isEmsAdmin(user) ? undefined : { companyId: user.companyId ?? undefined },
    orderBy: { startTime: "asc" },
  });

  const serializedEvents = events.map((event) => ({
    ...event,
    startTime: event.startTime.toISOString(),
    endTime: event.endTime.toISOString(),
  }));

  return <EventList events={serializedEvents} />;
}