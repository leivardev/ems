"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Button from "../buttons/Button";
import api, { CreateUserPayload } from "@/lib/axios";

export function CreateNewUserForm() {
  const { data: session } = useSession();
  const currentUser = session?.user;

  const isEMS =
    currentUser?.isGlobalAdmin === true || currentUser?.role === "EMS_USER";
  const isCompanyAdmin = currentUser?.role === "COMPANY_ADMIN";

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    role: "COMPANY_USER" | "COMPANY_ADMIN" | "EMS_USER";
    companyId?: string | null; // only used by EMS when creating company users
  }>({
    name: "",
    email: "",
    password: "",
    role: isEMS ? "EMS_USER" : "COMPANY_USER",
    companyId: null,
  });

  const [error, setError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "companyId" && value.trim() === "" ? null : (value as any),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    };

    // Build payload respecting the visibility rules:
    const payload: CreateUserPayload = {
      email: formData.email,
      password: formData.password,
      name: formData.name || null,
      role: formData.role,
    };

    // Only EMS may pass companyId, and only when creating a company role.
    if (
      isEMS &&
      (formData.role === "COMPANY_USER" || formData.role === "COMPANY_ADMIN")
    ){
      if (!formData.companyId) {
        setError("Please provide a company ID for the new company user.");
        return;
      };
      payload.companyId = formData.companyId;
    };

    // Company admins never send companyId; server infers it from the requester.

    try {
      await api.createUser(payload);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: isEMS ? "EMS_USER" : "COMPANY_USER",
        companyId: null,
      });
      alert("User created successfully.");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create user.";
      setError(msg);
    };
  };

  if (!isEMS && !isCompanyAdmin) {
    return <p className="text-red-600">You are not authorized to create users.</p>;
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      {error ? <p className="text-red-600">{error}</p> : null}

      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="border p-2 w-full"
        required
      />

      <label className="block text-sm font-medium">Role</label>
      {isEMS ? (
        <>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border p-2 w-60"
          >
            <option value="EMS_USER">EMS_USER</option>
            <option value="COMPANY_USER">COMPANY_USER</option>
            <option value="COMPANY_ADMIN">COMPANY_ADMIN</option>
          </select>

          {(formData.role === "COMPANY_USER" ||
            formData.role === "COMPANY_ADMIN") && (
            <input
              name="companyId"
              placeholder="Company ID"
              value={formData.companyId ?? ""}
              onChange={handleChange}
              className="border p-2 w-full mt-2"
              required
            />
          )}
        </>
      ) : (
        // Company admin: only company roles, no companyId field at all
        <select
          name="role"
          value={
            formData.role === "COMPANY_ADMIN" ? "COMPANY_ADMIN" : "COMPANY_USER"
          }
          onChange={handleChange}
          className="border p-2 w-60"
        >
          <option value="COMPANY_USER">COMPANY_USER</option>
          <option value="COMPANY_ADMIN">COMPANY_ADMIN</option>
        </select>
      )}

      <Button type="submit" label="Register" className="mt-2" />
    </form>
  );
};