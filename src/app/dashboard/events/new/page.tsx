"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api, { CreateEventPayload } from "@/lib/axios";
import Button from "@/app/components/buttons/Button";

export default function NewEventPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [error, setError] = useState("");

  const { mutate: createEvent, isPending: isCreating } = useMutation({
    mutationFn: (payload: CreateEventPayload) => api.createEvent(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push("/dashboard/events");
    },
    onError: async (err: any) => {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Something went wrong creating the event.";
      setError(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!startTime || !endTime) {
      setError("Start time and end time are required.");
      return;
    };

    createEvent({
      title,
      description: description || null,
      location: location || null,
      startTime,
      endTime,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">Create Event</h2>

      {error && <p className="text-red-600">{error}</p>}

      <input
        name="title"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 w-full"
      />

      <div>
        <label className="block text-sm font-medium mb-1">Start Time</label>
        <DatePicker
          selected={startTime}
          onChange={(date) => setStartTime(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy HH:mm"
          className="border p-2 w-full"
          placeholderText="DD/MM/YYYY HH:mm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">End Time</label>
        <DatePicker
          selected={endTime}
          onChange={(date) => setEndTime(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="dd/MM/yyyy HH:mm"
          className="border p-2 w-full"
          placeholderText="DD/MM/YYYY HH:mm"
        />
      </div>

      <input
        name="location"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2 w-full"
      />
      {isCreating ? 
        <Button
        type="button"
        label="Creating..."
        className="bg-green-500"
        /> 
        : 
        <Button 
        type="submit"
        label="Create"
        />
      }
    </form>
  );
}
