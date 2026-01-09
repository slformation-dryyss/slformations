import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import PlanningClient from "@/components/formations/PlanningClient";

export const metadata = {
  title: "Nos Plannings | SL Formations",
  description: "Consultez le planning de nos prochaines sessions de formation.",
};

export default function NosPlanningsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 pt-32 pb-20">
        <PlanningClient />
      </main>
      <Footer />
    </div>
  );
}

