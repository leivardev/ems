import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getSessionUser, isCompanyAdmin, isEmsAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewEventPage() {
  const user = await getSessionUser();
  if (!user || (!isEmsAdmin(user) && !isCompanyAdmin(user))) redirect("/dashboard");

  const safeUser = user!;

  async function createEvent(formData: FormData) {
    "use server";

    const title = formData.get("title") as string;
    const startTime = new Date(formData.get("startTime") as string);
    const endTime = new Date(formData.get("endTime") as string);
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;

    await prisma.event.create({
      data: {
        title,
        startTime,
        endTime,
        description,
        location,
        companyId: safeUser.companyId!,
      },
    });

    revalidatePath("/dashboard/events");
    redirect("/dashboard/events");
  }

  return (
    <form action={createEvent} className="space-y-4">
      <h2 className="text-xl font-semibold">Create Event</h2>
      <input name="title" placeholder="Title" className="border p-2 w-full" required />
      <textarea name="description" placeholder="Description" className="border p-2 w-full" />
      <input type="datetime-local" name="startTime" className="border p-2 w-full" required />
      <input type="datetime-local" name="endTime" className="border p-2 w-full" required />
      <input name="location" placeholder="Location" className="border p-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
    </form>
  );
}