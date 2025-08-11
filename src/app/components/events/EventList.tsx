"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../buttons/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export default function EventList() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: events = [], isLoading, isError, error } = useQuery({
    queryKey: ["events"],
    queryFn: api.getEvents,
  });

  const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
    mutationFn: api.removeEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const handleNewEvent = () => router.push("/dashboard/events/new");

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    deleteEvent(id);
  };

  if (isLoading) return <div>Loading events…</div>;
  if (isError) return <div className="text-red-600">Error: {(error as Error).message}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Events</h2>
      <Button label="Create New Event" onClick={handleNewEvent} />
      <ul className="mt-4 space-y-2">
        {events.length === 0 ? <div>No events.</div> : null}
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
                disabled={isDeleting}
                className="text-red-600 underline text-sm hover:cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}