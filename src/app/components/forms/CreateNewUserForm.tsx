"use client";
import { useState } from "react";
import Button from "../buttons/Button";
import { isEmsAdmin, isCompanyAdmin } from "@/lib/auth";
import { useSession } from "next-auth/react";
import api from "@/lib/axios";

export function CreateNewUserForm() {

  const user = useSession().data?.user;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    companyId: user?.companyId,
    isGlobalAdmin: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    api.createUser(formData);
  };

  if(isEmsAdmin(user)){
    setFormData({
      ...formData,
      role: 'EMS_USER',
      isGlobalAdmin: true,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full" required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} className="border p-2 w-full" required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} className="border p-2 w-full" required />
      {isCompanyAdmin(user) ? 
        <select>
          <option defaultValue={"COMPANY_USER"}>COMPANY_USER</option>
          <option>COMPANY_ADMIN</option>
        </select> 
        : <p>{isCompanyAdmin(user)}</p>
      }
      <Button type="submit" label="Register" className="mt-2" />
    </form>
  );
}