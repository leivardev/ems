import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { key } = await req.json();

  if (!key) {
    return NextResponse.json({ error: "Signup key is required" }, { status: 400 });
  }

  const signupKey = await prisma.signupKey.findUnique({
    where: { key },
    include: { company: true },
  });

  if (
    !signupKey ||
    signupKey.used ||
    signupKey.expiresAt < new Date()
  ) {
    return NextResponse.json({ valid: false, message: "Invalid or expired signup key" });
  }

  return NextResponse.json({
    valid: true,
    companyName: signupKey.company.name,
    roleToAssign: signupKey.roleToAssign,
  });
}