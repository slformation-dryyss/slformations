"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { updateUserRolesAction } from "@/app/admin/users/actions";
import { Check, ChevronDown, Loader2, X } from "lucide-react";

interface UserRoleSelectorProps {
  userId: string;
  currentRoles: string[];
  // Fallback for legacy calls
  currentRole?: string;
}

const AVAILABLE_ROLES = [
  { value: "STUDENT", label: "Élève", color: "bg-slate-100 text-slate-800" },
  { value: "INSTRUCTOR", label: "Moniteur Auto", color: "bg-blue-100 text-blue-800" },
  { value: "TEACHER", label: "Formateur Pro", color: "bg-emerald-100 text-emerald-800" },
  { value: "SECRETARY", label: "Secrétaire", color: "bg-pink-100 text-pink-800" },
  { value: "ADMIN", label: "Admin", color: "bg-gold-100 text-gold-800" },
];

export function UserRoleSelector({ userId, currentRoles = [], currentRole }: UserRoleSelectorProps) {
  // Normalize roles: use currentRoles array, or fallback to [currentRole]
  const initialRoles = currentRoles.length > 0 ? currentRoles : (currentRole ? [currentRole] : ["STUDENT"]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialRoles);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleRole = (roleValue: string) => {
    let newRoles: string[];

    if (selectedRoles.includes(roleValue)) {
      // Cannot remove the last role? Optional constraint. 
      // Keeping at least STUDENT is safer but maybe not required.
      newRoles = selectedRoles.filter(r => r !== roleValue);
      if (newRoles.length === 0) newRoles = ["STUDENT"];
    } else {
      newRoles = [...selectedRoles, roleValue];
    }

    setSelectedRoles(newRoles);
  };

  const handleSave = () => {
    startTransition(async () => {
      try {
        await updateUserRolesAction(userId, selectedRoles);
        setIsOpen(false);
      } catch (e) {
        console.error("Failed to update roles", e);
        // Reset on error
        setSelectedRoles(initialRoles);
      }
    });
  };

  const handleCancel = () => {
    setSelectedRoles(initialRoles);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button - Shows badges */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex flex-wrap gap-1 items-center min-w-[120px] p-1.5 border border-slate-200 rounded hover:border-gold-500 transition-colors bg-white text-left text-xs"
      >
        {initialRoles.length > 0 ? (
          initialRoles.map(role => {
            const roleInfo = AVAILABLE_ROLES.find(r => r.value === role) || { label: role, color: "bg-gray-100 text-gray-800" };
            return (
              <span key={role} className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${roleInfo.color}`}>
                {roleInfo.label}
              </span>
            );
          })
        ) : (
          <span className="text-slate-400 italic">Aucun rôle</span>
        )}
        <div className="ml-auto pl-1">
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
        </div>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-2">
          <div className="space-y-1 mb-3">
            {AVAILABLE_ROLES.map((role) => {
              const isSelected = selectedRoles.includes(role.value);
              return (
                <button
                  key={role.value}
                  onClick={() => toggleRole(role.value)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${isSelected ? "bg-slate-50 text-slate-900 font-medium" : "text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${role.color.split(" ")[0]}`}></span>
                    {role.label}
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-gold-500" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleCancel}
              className="flex-1 py-1 text-xs text-slate-500 hover:text-slate-700 bg-slate-50 rounded hover:bg-slate-100"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="flex-1 py-1 text-xs text-white bg-gold-500 rounded hover:bg-gold-600 font-medium disabled:opacity-50"
            >
              {isPending ? "..." : "Enregistrer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
