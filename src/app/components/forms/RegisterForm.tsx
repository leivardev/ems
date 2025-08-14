"use client";
import { useState } from "react";
import Button from "../buttons/Button";

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    key: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/signup/register", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) window.location.href = "/signin";
    else alert("Failed to register");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
      <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full" required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full" required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full" required />
      <input name="key" placeholder="Signup Key" onChange={handleChange} className="border p-2 w-full" required />
      <Button type="submit" label="Register" className="" />
    </form>
  );
}