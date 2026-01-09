import { StudentSidebar } from "@/components/dashboard/StudentSidebar";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  
  // Default role
  let userRole = "STUDENT";

  if (session?.user) {
    // Try to get role from DB for more accuracy/updates
    // Using sub (Auth0 ID) to find user
    const dbUser = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub },
        select: { role: true }
    });
    
    if (dbUser) {
        userRole = dbUser.role;
    }
  }
  
  // Check Maintenance Mode
  const maintenanceSetting = await prisma.systemSetting.findUnique({
      where: { key: "MAINTENANCE_MODE" }
  });
  const maintenanceActive = maintenanceSetting?.value === "true";

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Sidebar Fixe */}
      <StudentSidebar role={userRole} />

      <div className="flex-1 flex flex-col ml-64 min-h-screen">
        <main className="flex-1 p-8">
           {maintenanceActive && userRole === "STUDENT" ? (
             <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="bg-orange-100 p-6 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Maintenance en cours</h2>
                <p className="text-slate-600 max-w-md">
                    L&apos;espace élève est actuellement en maintenance pour amélioration.<br/>
                    Veuillez revenir dans quelques instants.
                </p>
             </div>
           ) : (
             children
           )}
        </main>
      </div>
    </div>
  );
}

