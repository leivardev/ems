import NextAuth from "next-auth";
import { UserRole } from "@prisma/client"; // import your role enum if needed

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: UserRole;
      companyId?: string | null;
      isGlobalAdmin?: boolean;
    },
  };

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: UserRole;
    companyId?: string | null;
    isGlobalAdmin: boolean;
  };
};

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    companyId: string | null;
    isGlobalAdmin: boolean;
  };
};