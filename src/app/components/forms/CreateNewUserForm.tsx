"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Button from "../buttons/Button";
import api, { CreateUserPayload } from "@/lib/axios";

export function CreateNewUserForm() {
  const { data: session } = useSession();
  const currentUser = session?.user;

  // Derive roles on the client from session fields
  const isEMS =
    currentUser?.isGlobalAdmin === true || currentUser?.role === "EMS_USER";
  const isCompanyAdmin = currentUser?.role === "COMPANY_ADMIN";

  const [formData, setFormData] = useState<CreateUserPayload>({
    name: "",
    email: "",
    password: "",
    role: isEMS ? "EMS_USER" : "COMPANY_USER", // sensible default
    companyId: null, // will be set below if company admin
  });

  const [error, setError] = useState<string>("");

  // When session/user loads, set companyId for company admins
  useEffect(() => {
    if (isCompanyAdmin && currentUser?.companyId) {
      setFormData((prev) => ({
        ...prev,
        companyId: currentUser.companyId!,
        // ensure role is a company role by default
        role:
          prev.role === "EMS_USER" || !prev.role
            ? "COMPANY_USER"
            : (prev.role as CreateUserPayload["role"]),
      }));
    }
    if (isEMS) {
      // EMS users can default to EMS_USER; keep companyId null unless chosen
      setFormData((prev) => ({
        ...prev,
        companyId: prev.companyId ?? null,
        role: prev.role || "EMS_USER",
      }));
    }
  }, [isCompanyAdmin, isEMS, currentUser?.companyId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      // normalize empty strings to undefined/null only where it makes sense
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic client-side checks
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    // For EMS creating company users/admins, require companyId
    if (
      isEMS &&
      (formData.role === "COMPANY_USER" || formData.role === "COMPANY_ADMIN") &&
      !formData.companyId
    ) {
      setError("Please select a company for the new user.");
      return;
    }

    try {
      await api.createUser({
        email: formData.email,
        password: formData.password,
        name: formData.name || null,
        role: formData.role as CreateUserPayload["role"],
        companyId:
          formData.role === "EMS_USER" ? null : (formData.companyId ?? null),
      });
      // Clear form or show success UI
      setFormData({
        name: "",
        email: "",
        password: "",
        role: isEMS ? "EMS_USER" : "COMPANY_USER",
        companyId: isCompanyAdmin ? currentUser?.companyId ?? null : null,
      });
      alert("User created successfully.");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create user.";
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      {error ? <p className="text-red-600">{error}</p> : null}

      <input
        name="name"
        placeholder="Name"
        value={formData.name ?? ""}
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

      {/* Role selection */}
      {isEMS ? (
        <>
          <label className="block text-sm font-medium">Role</label>
          <select
            name="role"
            value={formData.role || "EMS_USER"}
            onChange={handleChange}
            className="border p-2 w-60"
          >
            <option value="EMS_USER">EMS_USER</option>
            <option value="COMPANY_USER">COMPANY_USER</option>
            <option value="COMPANY_ADMIN">COMPANY_ADMIN</option>
          </select>

          {/* For EMS choosing a company role, show a companyId input/select.
              Replace this input with a real company selector in your UI. */}
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
      ) : isCompanyAdmin ? (
        <>
          <label className="block text-sm font-medium">Role</label>
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

          {/* Company admins are locked to their companyId */}
          <input
            name="companyId"
            value={currentUser?.companyId ?? ""}
            readOnly
            className="border p-2 w-full opacity-70"
          />
        </>
      ) : (
        <p className="text-red-600">You are not authorized to create users.</p>
      )}

      <Button type="submit" label="Register" className="mt-2" />
    </form>
  );
}
