import { OnboardingForm } from "@/components/dashboard/OnboardingForm";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Finalisation du profil | SL Formations",
};

export default function OnboardingPage() {
  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pt-28 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <OnboardingForm />
        </div>
      </div>
    </>
  );
}

