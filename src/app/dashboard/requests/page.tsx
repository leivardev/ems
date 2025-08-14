import Button from "@/app/components/buttons/Button";
import { getSessionUser, isEmsAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function SignupRequestsPage() {
  const user = await getSessionUser();
  if (!user || !isEmsAdmin(user)) redirect("/dashboard");

  const requests = await prisma.signupRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Signup Requests</h2>
      <ul className="space-y-4">
        {requests.map((req) => (
          <li key={req.id} className="border p-4 rounded shadow-sm">
            <div className="font-medium">{req.companyName}</div>
            <div className="text-sm text-gray-600">
              {req.contactName} ({req.contactEmail})
            </div>
            {req.message && <p className="mt-1 text-sm">{req.message}</p>}
            <div className="mt-2 flex gap-4">
              <form action={`/api/requests/${req.id}/approve`} method="post">
                <Button type="submit" label="Approve" className="bg-green-500 hover:bg-green-400" />
              </form>
              <form action={`/api/requests/${req.id}/reject`} method="post">
                <Button type="submit" label="Reject" className="bg-red-500 hover:bg-red-400"/>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};