"use client";

import { updateUserRoleAction } from "@/app/admin/users/actions";
import { useTransition } from "react";

interface UserRoleSelectorProps {
  userId: string;
  currentRole: string;
}

export function UserRoleSelector({ userId, currentRole }: UserRoleSelectorProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    startTransition(async () => {
        // We call the server action manually to handle the transition
        // But since the server action expects FormData, we can simulate it or update the action signature.
        // Actually, the simplest way to keep using the existing action which expects FormData:
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("role", newRole);
        await updateUserRoleAction(formData);
    });
  };

  return (
    <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
        <select
            name="role"
            defaultValue={currentRole}
            className="text-xs border-slate-300 rounded focus:ring-gold-500 focus:border-gold-500"
            onChange={handleChange}
            disabled={isPending}
        >
            <option value="STUDENT">STUDENT</option>
            <option value="ADMIN">ADMIN</option>
            <option value="INSTRUCTOR">INSTRUCTOR</option>
        </select>
    </div>
  );
}

