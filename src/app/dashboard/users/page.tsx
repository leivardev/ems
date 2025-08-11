'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '@/lib/axios';
import Button from '@/app/components/buttons/Button';
import { useState } from 'react';
import { CreateNewUserForm } from '@/app/components/forms/CreateNewUserForm';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [createMode, setCreateMode] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axios.getUsers();
      return res;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.deleteUser(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      alert('Failed to delete user.');
    },
  });

  const handleDelete = (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (confirmed) deleteMutation.mutate(id);
  };

  const toggleCreate = () => {
    if(createMode === true){
      setCreateMode(false);
    } else {
      setCreateMode(true);
    };
  };

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>No data</div>;

  const { users, currentUserId } = data;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Company Users</h2>
      {createMode === false ?
      <Button label='Create new user' type='button' onClick={toggleCreate} />
      :null}
      {createMode === true ?
      <section><Button label='Cancel user registration' type='button' onClick={toggleCreate} className='bg-red-500 hover:bg-red-400'/><CreateNewUserForm /></section>
      :null}
      <ul className="space-y-2 mt-4">
        {users.map((u: User) => (
          <li key={u.id} className="border p-4 rounded">
            <div className="font-medium">{u.name} ({u.email})</div>
            <div className="text-sm text-gray-500">{u.role}</div>

            {u.role !== 'COMPANY_ADMIN' && (
              <a
                href={`/api/admin/users/${u.id}/promote`}
                className="text-sm text-blue-600 underline"
              >
                Promote to Admin
              </a>
            )}

            {u.id !== currentUserId && (
              <Button
                label={deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                className="bg-red-500 hover:bg-red-400 ml-4"
                onClick={() => handleDelete(u.id)}
              />
            )}

            {u.id === currentUserId && (
              <p className="text-sm text-gray-400 italic">(You can't delete yourself)</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
