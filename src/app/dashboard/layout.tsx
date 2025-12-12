import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-slate-900 font-sans">
      <DashboardHeader />
      {children}
    </div>
  );
}
