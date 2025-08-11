import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser, isEmsAdmin } from "@/lib/auth";

// TBI - Validation schema

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user || !user.companyId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  };

  const { title, description, location, startTime, endTime } = await req.json();

  try {
    await prisma.event.create({
      data: {
        title,
        description,
        location,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        companyId: user.companyId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  };
};

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");

  // If id is provided, return a single event (with access check)
  if (id) {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ error: "Not Found" }, { status: 404 });

    // Only EMS or same-company can view the single event
    if (!isEmsAdmin(user) && event.companyId !== user.companyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    };

    return NextResponse.json(event);
  };

  // Otherwise, return a list scoped by role
  const events = await prisma.event.findMany({
    where: isEmsAdmin(user) ? undefined : { companyId: user.companyId ?? undefined },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(events);
}

export async function PATCH(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  };

  const body = await req.json();
  const { id, title, description, location, startTime, endTime } = body;

  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  };

  if (event.companyId !== user.companyId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  };

  const updated = await prisma.event.update({
    where: { id },
    data: {
      title,
      description,
      location,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    },
  });

  return NextResponse.json(updated);
};

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  };

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  };

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  };

  // Only EMS admins or company admins from same company as the event can delete
  if (user.companyId !== event.companyId && user.role !== 'COMPANY_ADMIN') {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  };

  await prisma.event.delete({ where: { id } });

  return NextResponse.json({ success: true });
}