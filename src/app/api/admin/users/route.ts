import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSessionUser, isCompanyAdmin, isEmsAdmin } from "@/lib/auth";
import { z } from "zod";
import { hash } from "bcryptjs";

const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().optional().nullable(),
  // Requester can ask for a role; we’ll validate allowed values below
  role: z.enum(["COMPANY_USER", "COMPANY_ADMIN", "EMS_USER"]).optional(),
  // Optional: only used if EMS admin wants to create a company user
  companyId: z.string().optional().nullable(),
});

function badRequestFromZod(err: z.ZodError) {
  return NextResponse.json(
    {
      error: "Validation failed",
      issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    },
    { status: 400 }
  );
}

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
  };

  const { id } = await req.json();

  if (id === user.id) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  };

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true }, {status: 200});
};

export async function POST(req: Request) {

  const actingUser = await getSessionUser();
  if (!actingUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const canAct = isEmsAdmin(actingUser) || isCompanyAdmin(actingUser);
  if (!canAct) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let data: z.infer<typeof CreateUserSchema>;
  try {
    data = CreateUserSchema.parse(await req.json());
  } catch (e) {
    if (e instanceof z.ZodError) return badRequestFromZod(e);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const requestedRole = data.role ?? "COMPANY_USER";

  let finalRole: "COMPANY_USER" | "COMPANY_ADMIN" | "EMS_USER";
  let finalCompanyId: string | null = null;

  if (isCompanyAdmin(actingUser)) {
    if (!actingUser.companyId) {
      return NextResponse.json({ error: "Acting admin has no company assigned" }, { status: 400 });
    }
    if (requestedRole === "EMS_USER") {
      return NextResponse.json({ error: "Company admins cannot create EMS users" }, { status: 403 });
    }
    finalRole = requestedRole; // COMPANY_USER or COMPANY_ADMIN
    finalCompanyId = actingUser.companyId;
  } else if (isEmsAdmin(actingUser)) {
    // EMS admins can create EMS_USER (no company)
    if (requestedRole === "EMS_USER") {
      finalRole = "EMS_USER";
      finalCompanyId = null;
    } else {
      if (!data.companyId) {
        return NextResponse.json(
          { error: "companyId is required when creating company users as EMS admin" },
          { status: 400 }
        );
      }
      finalRole = requestedRole; // COMPANY_USER or COMPANY_ADMIN
      finalCompanyId = data.companyId;
    }
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const hashed = await hash(data.password, 10);

  const created = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name ?? undefined,
      role: finalRole,
      isGlobalAdmin: finalRole === "EMS_USER", // EMS users are global admins in your schema
      companyId: finalCompanyId ?? undefined,  // undefined avoids setting null when not needed
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isGlobalAdmin: true,
      companyId: true,
      createdAt: true,
      updatedAt: true,
    },
  });


  return NextResponse.json(created, { status: 201 });
};