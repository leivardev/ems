import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser, isEmsAdmin } from "@/lib/auth";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser();
  if (!user || !isEmsAdmin(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  await prisma.signupRequest.update({
    where: { id: params.id },
    data: { status: "REJECTED" },
  });

  return NextResponse.redirect("/dashboard/requests");
}