"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface Event {
  id: string;
  title: string;
  startTime: string;
}

export default function EventList({ events }: { events: Event[] }) {
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const res = await fetch(`/api/events?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete the event.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Events</h2>
      <Link href="/dashboard/events/new" className="text-blue-600 underline">
        Create New Event
      </Link>
      <ul className="mt-4 space-y-2">
        {events.map((event) => (
          <li key={event.id} className="border p-4 rounded">
            <div className="font-medium">{event.title}</div>
            <div className="text-sm text-gray-500">
              {new Date(event.startTime).toLocaleString()}
            </div>
            <div className="mt-2 flex gap-4 items-center">
              <Link
                href={`/dashboard/events/${event.id}`}
                className="text-blue-600 underline text-sm"
              >
                Manage
              </Link>
              <button
                onClick={() => handleDelete(event.id)}
                className="text-red-600 underline text-sm hover:cursor-pointer"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}