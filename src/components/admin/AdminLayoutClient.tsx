"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminMobileNavbar } from "./AdminMobileNavbar";

interface AdminLayoutClientProps {
    children: React.ReactNode;
    userRole: string;
}

export function AdminLayoutClient({ children, userRole }: AdminLayoutClientProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900 overflow-x-hidden">
            {/* Sidebar - Handles its own mobile visibility */}
            <AdminSidebar
                role={userRole}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 flex flex-col md:ml-64 min-h-screen w-full">
                {/* Mobile Navbar */}
                <AdminMobileNavbar
                    isOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                <main className="flex-1 p-4 md:p-8 w-full max-w-[100vw] overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
