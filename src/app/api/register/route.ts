"use server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST ( request: NextRequest) {

  const formData = await request.json();

  if (!formData.username || !formData.email || !formData.company || !formData.password || !formData.key) {
    return NextResponse.json({ message: "You've left empty fields" }, { status: 403 })
  };

  await prisma.user.create({
    data: {
      username: formData.username,
      email: formData.email,
      company_name: formData.company,
    },
  });
  
  return NextResponse.json({ message: "Succesully created post"}, { status: 200 });
};