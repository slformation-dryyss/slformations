"use client";

import { Info } from "lucide-react";

interface UserRoleSelectorProps {
  userId: string;
  currentRoles: string[];
  currentRole?: string;
}

const AVAILABLE_ROLES = [
  { value: "STUDENT", label: "Élève", color: "bg-slate-100 text-slate-800" },
  { value: "INSTRUCTOR", label: "Moniteur Auto", color: "bg-blue-100 text-blue-800" },
  { value: "TEACHER", label: "Formateur Pro", color: "bg-emerald-100 text-emerald-800" },
  { value: "SECRETARY", label: "Secrétaire", color: "bg-pink-100 text-pink-800" },
  { value: "ADMIN", label: "Admin", color: "bg-gold-100 text-gold-800" },
  { value: "OWNER", label: "Owner", color: "bg-purple-100 text-purple-800" },
];

export function UserRoleSelector({ userId, currentRoles = [], currentRole }: UserRoleSelectorProps) {
  // Normalize roles
  const displayRoles = currentRoles.length > 0 ? currentRoles : (currentRole ? [currentRole] : ["STUDENT"]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1">
        {displayRoles.map((role) => {
          const roleInfo = AVAILABLE_ROLES.find((r) => r.value === role) || {
            label: role,
            color: "bg-gray-100 text-gray-800",
          };
          return (
            <span
              key={role}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${roleInfo.color} border-opacity-20`}
            >
              {roleInfo.label}
            </span>
          );
        })}
      </div>

      <div
        title="Les rôles sont gérés via Auth0. Modifiez-les dans le dashboard Auth0."
        className="cursor-help"
      >
        <Info className="w-3 h-3 text-slate-400 hover:text-slate-600" />
      </div>
    </div>
  );
}
