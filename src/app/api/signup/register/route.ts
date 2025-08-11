import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password, key } = await req.json();

  if (!name || !email || !password || !key) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  };

  // Check signup key
  const signupKey = await prisma.signupKey.findUnique({
    where: { key },
  });

  if (
    !signupKey ||
    signupKey.used ||
    signupKey.expiresAt < new Date()
  ) {
    return NextResponse.json({ error: "Invalid or expired signup key" }, { status: 400 });
  };

  // Check if user already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
  };

  // Create user
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: signupKey.roleToAssign,
      companyId: signupKey.companyId,
      isGlobalAdmin: false, // All signup key users are company-level
    },
  });

  // Mark key as used
  await prisma.signupKey.update({
    where: { key },
    data: {
      used: true,
      usedById: newUser.id,
    },
  });

  return NextResponse.json({ success: true });
}