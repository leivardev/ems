import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { companyName, contactEmail, contactName, message } = await req.json();

  if (!companyName || !contactEmail || !contactName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  };

  // Optional: store in a request table or just email an admin
  await prisma.signupRequest.create({
    data: {
      companyName,
      contactEmail,
      contactName,
      message,
      status: "PENDING",
    },
  });

  return NextResponse.json({ success: true, message: "Request received" });
};