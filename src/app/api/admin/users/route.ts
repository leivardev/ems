import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser, isCompanyAdmin } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user || !isCompanyAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  };

  const users = await prisma.user.findMany({
    where: { companyId: user.companyId },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ users, currentUserId: user.id });
};

export async function DELETE(req: Request) {
  const user = await getSessionUser();
  if (!user || !isCompanyAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await req.json();

  if (id === user.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true }, {status: 200});
}