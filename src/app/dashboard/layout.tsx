import { auth0 } from "@/lib/auth0";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardLayoutClient } from "@/components/dashboard/DashboardLayoutClient";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let redirectPath: string | null = null;
  let userRole = "STUDENT";
  let userRoles: string[] = ["STUDENT"];
  let maintenanceActive = false;
  let socialLinks: Record<string, string> = {};

  try {
    const session = await auth0.getSession();

    if (session?.user) {
      const dbUser = await prisma.user.findUnique({
        where: { auth0Id: session.user.sub },
        select: { role: true, roles: true }
      });

      if (dbUser) {
        userRole = dbUser.role;
        userRoles = dbUser.roles || [dbUser.role];
        if (userRole === "ADMIN" || userRole === "OWNER" || userRoles.includes("ADMIN") || userRoles.includes("OWNER")) {
          redirectPath = "/admin";
        }
      }
    }

    if (redirectPath) {
      redirect(redirectPath);
    }

    const maintenanceSetting = await prisma.systemSetting.findUnique({
      where: { key: "MAINTENANCE_MODE" }
    });
    maintenanceActive = maintenanceSetting?.value === "true";

    const socialSettings = await prisma.systemSetting.findMany({
      where: { key: { startsWith: "SOCIAL_" } }
    });
    socialLinks = socialSettings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return (
      <DashboardLayoutClient 
        userRole={userRole} 
        userRoles={userRoles} 
        socialLinks={socialLinks}
        maintenanceActive={maintenanceActive}
      >
        {children}
      </DashboardLayoutClient>
    );

  } catch (error) {
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

