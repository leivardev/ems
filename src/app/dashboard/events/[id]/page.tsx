"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { EventDetail, UpdateEventPayload } from "@/lib/axios";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: eventData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["events", id],
    queryFn: () => api.getEvent(id),
    enabled: !!id,
  });

  const [form, setForm] = useState<EventDetail | null>(null);

  useEffect(() => {
    if (eventData) setForm(eventData);
  }, [eventData]);

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: (payload: UpdateEventPayload) => api.updateEvent(payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["events", id] });
      router.push("/dashboard/events");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    const payload: UpdateEventPayload = {
      id: form.id,
      title: form.title,
      description: form.description,
      location: form.location,
      startTime: form.startTime,
      endTime: form.endTime,
    };

    save(payload);
  };

  if (isLoading || !form) return <div>Loading…</div>;
  if (isError) return <div className="text-red-600">Error: {(error as Error)?.message}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Edit Event</h2>

      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="border p-2 w-full"
        required
      />

      <textarea
        value={form.description ?? ""}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="border p-2 w-full"
      />

      <DatePicker
        selected={new Date(form.startTime)}
        onChange={(date) =>
          date &&
          setForm({
            ...form,
            startTime: (date as Date).toISOString(),
          })
        }
        showTimeSelect
        dateFormat="dd/MM/yyyy HH:mm"
        className="border p-2 w-full"
      />

      <DatePicker
        selected={new Date(form.endTime)}
        onChange={(date) =>
          date &&
          setForm({
            ...form,
            endTime: (date as Date).toISOString(),
          })
        }
        showTimeSelect
        dateFormat="dd/MM/yyyy HH:mm"
        className="border p-2 w-full"
      />

      <input
        type="text"
        value={form.location ?? ""}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
        className="border p-2 w-full"
      />

      <button
        type="submit"
        disabled={isSaving}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isSaving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
