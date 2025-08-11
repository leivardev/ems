"use client";
import { useState } from "react";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full" required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full" required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full" required />
      <input name="key" placeholder="Signup Key" onChange={handleChange} className="border p-2 w-full" required />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
    </form>
  );
}