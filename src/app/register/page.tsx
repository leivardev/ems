import { RegisterForm } from "@/app/components/forms/RegisterForm";
import { RequestSignupKeyForm } from "@/app/components/forms/RequestSignupKeyForm";

export default function RegisterPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Register</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">I have a signup key</h2>
          <RegisterForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Request access for my company</h2>
          <RequestSignupKeyForm />
        </div>
      </div>
    </div>
  );
};