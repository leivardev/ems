"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // ✅ Unwrap the promise with `use`

  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);

  // Fetch event data
  useEffect(() => {
    fetch(`/api/events?id=${id}`)
      .then((res) => res.json())
      .then((data) => setEvent(data));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    const res = await fetch("/api/events", {
      method: "PATCH",
      body: JSON.stringify(event),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      router.push("/dashboard/events");
    } else {
      const error = await res.json();
      alert(error.error || "Something went wrong.");
    }
  };

  if (!event) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Edit Event</h2>

      <input
        type="text"
        value={event.title}
        onChange={(e) => setEvent({ ...event, title: e.target.value })}
        className="border p-2 w-full"
        required
      />

      <textarea
        value={event.description || ""}
        onChange={(e) => setEvent({ ...event, description: e.target.value })}
        className="border p-2 w-full"
      />

      <DatePicker
        selected={new Date(event.startTime)}
        onChange={(date) =>
          setEvent({ ...event, startTime: (date as Date).toISOString() })
        }
        showTimeSelect
        dateFormat="dd/MM/yyyy HH:mm"
        className="border p-2 w-full"
      />

      <DatePicker
        selected={new Date(event.endTime)}
        onChange={(date) =>
          setEvent({ ...event, endTime: (date as Date).toISOString() })
        }
        showTimeSelect
        dateFormat="dd/MM/yyyy HH:mm"
        className="border p-2 w-full"
      />

      <input
        type="text"
        value={event.location || ""}
        onChange={(e) => setEvent({ ...event, location: e.target.value })}
        className="border p-2 w-full"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Save Changes
      </button>
    </form>
  );
}
