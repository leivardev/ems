"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import Button from "@/app/components/buttons/Button";
import { useState } from "react";
import { CreateNewUserForm } from "@/app/components/forms/CreateNewUserForm";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "COMPANY_USER" | "COMPANY_ADMIN" | "EMS_USER";
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [createMode, setCreateMode] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: api.getUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    onError: () => alert("Failed to delete user."),
  });

  const promoteMutation = useMutation({
    mutationFn: (id: string) => api.promoteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
    onError: (err: any) =>
      alert(err?.response?.data?.error ?? "Failed to promote user."),
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const handlePromote = (id: string) => {
    if (confirm("Promote this user to COMPANY_ADMIN?")) {
      promoteMutation.mutate(id);
    }
  };

  const toggleCreate = () => setCreateMode((v) => !v);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  const { users, currentUserId } = data;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Company Users</h2>

      {!createMode && (
        <Button label="Create new user" type="button" onClick={toggleCreate} />
      )}

      {createMode && (
        <section>
          <Button
            label="Cancel user registration"
            type="button"
            onClick={toggleCreate}
            className="bg-red-500 hover:bg-red-400"
          />
          <CreateNewUserForm />
        </section>
      )}

      <ul className="space-y-2 mt-4">
        {users.map((u: User) => (
          <li key={u.id} className="border p-4 rounded">
            <div className="font-medium">
              {u.name ?? "(no name)"} ({u.email})
            </div>
            <div className="text-sm text-gray-500">{u.role}</div>

            {u.role !== "COMPANY_ADMIN" && (
              <Button
                label={promoteMutation.isPending ? "Promoting..." : "Promote to Admin"}
                onClick={() => handlePromote(u.id)}
                className=""
                disabled={promoteMutation.isPending}
              />
            )}

            {u.id !== currentUserId && (
              <Button
                label={deleteMutation.isPending ? "Deleting..." : "Delete"}
                className="bg-red-500 hover:bg-red-400 ml-4"
                onClick={() => handleDelete(u.id)}
                disabled={deleteMutation.isPending}
              />
            )}

            {u.id === currentUserId && (
              <p className="text-sm text-gray-400 italic">
                (You can't delete yourself)
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
