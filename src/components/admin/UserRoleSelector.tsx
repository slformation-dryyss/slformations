"use client";

import { Info } from "lucide-react";

interface UserRoleSelectorProps {
  userId: string;
  currentRoles: string[];
  currentRole?: string;
}

const AVAILABLE_ROLES = [
  { value: "OWNER", label: "Owner", color: "bg-purple-100 text-purple-800 border-purple-300", icon: "👑" },
  { value: "ADMIN", label: "Admin", color: "bg-blue-100 text-blue-800 border-blue-300", icon: "🛡️" },
  { value: "SECRETARY", label: "Secrétaire", color: "bg-pink-100 text-pink-800 border-pink-300", icon: "📋" },
  { value: "INSTRUCTOR", label: "Moniteur Auto", color: "bg-green-100 text-green-800 border-green-300", icon: "🚗" },
  { value: "TEACHER", label: "Formateur Pro", color: "bg-amber-100 text-amber-800 border-amber-300", icon: "👨‍🏫" },
  { value: "STUDENT", label: "Élève", color: "bg-slate-100 text-slate-700 border-slate-300", icon: "🎓" },
];

export function UserRoleSelector({ userId, currentRoles = [], currentRole }: UserRoleSelectorProps) {
  // Normalize roles
  const displayRoles = currentRoles.length > 0 ? currentRoles : (currentRole ? [currentRole] : ["STUDENT"]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap gap-1.5">
        {displayRoles.map((role) => {
          const roleInfo = AVAILABLE_ROLES.find((r) => r.value === role) || {
            label: role,
            color: "bg-slate-100 text-slate-700 border-slate-300",
            icon: "👤"
          };
          return (
            <span
              key={role}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${roleInfo.color}`}
            >
              <span className="text-sm">{roleInfo.icon}</span>
              {roleInfo.label}
            </span>
          );
        })}
      </div>

      <div
        title="Les rôles sont gérés via Auth0. Modifiez-les dans le dashboard Auth0."
        className="cursor-help"
      >
        <Info className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
      </div>
    </div>
  );
}
