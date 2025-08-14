"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Button from "../buttons/Button";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow">
      <Link href="/" className="font-semibold text-lg">EMS</Link>
      <div className="space-x-4">
        {session?.user ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Button label="Sign Out" onClick={() => signOut()} className="bg-red-500 hover:bg-red-400" />
          </>
        ) : (
          <>
            <Link href="/signin">Sign in</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}