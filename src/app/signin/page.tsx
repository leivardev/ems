"use client";

import { useSearchParams } from "next/navigation";
import { SigninForm } from "@/app/components/forms/SigninForm";

export default function SigninPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage = {
    CredentialsSignin: "Invalid email or password",
    default: "Something went wrong. Please try again.",
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>



      <SigninForm />

      {error && (
        <div className="mt-4 p-3 bg-red-500 text-white rounded">
          {errorMessage[error as keyof typeof errorMessage] ?? errorMessage.default}
        </div>
      )}
    </div>
  );
}