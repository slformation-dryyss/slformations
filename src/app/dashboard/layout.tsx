import { StudentSidebar } from "@/components/dashboard/StudentSidebar";
import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let redirectPath: string | null = null;

  try {
    const session = await auth0.getSession();

    // Default role
    let userRole = "STUDENT";
    let userRoles: string[] = ["STUDENT"];

    if (session?.user) {
      // Try to get role from DB for more accuracy/updates
      try {
        const dbUser = await prisma.user.findUnique({
          where: { auth0Id: session.user.sub },
          select: { role: true, roles: true }
        });

        if (dbUser) {
          userRole = dbUser.role;
          userRoles = dbUser.roles || [dbUser.role];
          // CRITICAL: Force redirect for ADMIN/OWNER
          if (userRole === "ADMIN" || userRole === "OWNER" || userRoles.includes("ADMIN") || userRoles.includes("OWNER")) {
            redirectPath = "/admin";
          }
        }
      } catch (dbError) {
        console.error("Database Error (User):", dbError);
        // Fallback to session roles if DB fails but don't crash
      }
    }

    if (redirectPath) {
      redirect(redirectPath);
    }

    // Check Maintenance Mode
    let maintenanceActive = false;
    try {
      const maintenanceSetting = await prisma.systemSetting.findUnique({
        where: { key: "MAINTENANCE_MODE" }
      });
      maintenanceActive = maintenanceSetting?.value === "true";
    } catch (dbError) {
      console.error("Database Error (Settings):", dbError);
    }

    // Get social links for sidebar
    let socialLinks: Record<string, string> = {};
    try {
      const socialSettings = await prisma.systemSetting.findMany({
        where: { key: { startsWith: "SOCIAL_" } }
      });
      socialLinks = socialSettings.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);
    } catch (dbError) {
      console.error("Database Error (Social):", dbError);
    }

    return (
      <div className="flex bg-slate-50 min-h-screen font-sans text-slate-900">
        {/* Sidebar Fixe */}
        <StudentSidebar role={userRole} roles={userRoles} socialLinks={socialLinks} />

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
                  L&apos;espace élève est actuellement en maintenance pour amélioration.<br />
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
  } catch (error) {
    // If it's already a redirect path, we don't want to show error UI
    // But since redirect() throws, it might end up here if we called it inside try
    // We moved it out, so it should be fine. 
    // Just in case anything else redirects:
    if (String(error).includes("NEXT_REDIRECT")) {
      throw error;
    }

    console.error("Critical Dashboard Layout Error:", error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100 max-w-lg w-full">
          <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Une erreur est survenue</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Impossible de charger le tableau de bord. Veuillez réessayer ou contacter le support si le problème persiste.
          </p>
          <div className="bg-slate-900 text-slate-300 p-4 rounded-lg text-xs font-mono overflow-auto mb-6 max-h-40">
            {error instanceof Error ? error.message : String(error)}
          </div>
          <a
            href="/api/auth/logout"
            className="block w-full text-center py-2.5 px-4 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition"
          >
            Se déconnecter et réessayer
          </a>
        </div>
      </div>
    );
  }
}

