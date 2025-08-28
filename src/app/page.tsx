"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "./components/buttons/Button";

export default function Home() {

  const router = useRouter();

  return (
    <section className="flex flex-col mt-20">
      <section className="flex flex-col gap-4 self-center text-center">
        <h1 className="text-2xl">EMS</h1>
        <h2 className="text-xl">Your local event management site</h2>
        <Button
          label="Sign In"
          onClick={() => router.push('/signin')}
          className="bg-blue-500 p-2 text-white rounded-full hover:bg-blue-400"
        />
        <p className="text-sm">Don't have a account yet? Sign up <Link href="/register" className="underline">here</Link></p>
      </section>

    </section>
  );
};