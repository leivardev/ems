import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser, isEmsAdmin } from "@/lib/auth";
import { randomUUID } from "crypto";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const requestId = params.id;  // Ingore warning from Turbopack, this is only relevant for older version NextJS
  const user = await getSessionUser();
  if (!user || !isEmsAdmin(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  };

  const request = await prisma.signupRequest.findUnique({
    where: { id: requestId },
  });

  if (!request || request.status !== "PENDING") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  };

  // Check if company already exists to prevent unique constraint error
  const existingCompany = await prisma.company.findUnique({
    where: { name: request.companyName },
  });

  const company = existingCompany || await prisma.company.create({
    data: { name: request.companyName },
  });

  await prisma.signupKey.create({
    data: {
      key: randomUUID(),
      companyId: company.id,
      createdById: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
      roleToAssign: "COMPANY_ADMIN",
    },
  });

  await prisma.signupRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED" },
  });

  return NextResponse.redirect(new URL("/dashboard/requests", req.url));
}