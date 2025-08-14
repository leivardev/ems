"use client";
import { useState } from "react";
import Button from "../buttons/Button";

export function RequestSignupKeyForm() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactEmail: "",
    contactName: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/signup/request-key", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) alert("Request submitted");
    else alert("Failed to submit request");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input name="companyName" placeholder="Company Name" onChange={handleChange} className="border p-2 w-full" required />
      <input type="email" name="contactEmail" placeholder="Contact Email" onChange={handleChange} className="border p-2 w-full" required />
      <input name="contactName" placeholder="Your Name" onChange={handleChange} className="border p-2 w-full" required />
      <textarea name="message" placeholder="Message (optional)" onChange={handleChange} className="border p-2 w-full" />
      <Button type="submit" className="" label="Submit Request" />
    </form>
  );
}