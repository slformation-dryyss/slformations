import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProfilePageClient } from "@/components/dashboard/ProfilePageClient";

export const metadata = {
  title: "Mon profil | SL Formations",
};

export default async function DashboardProfilePage(props: {
  searchParams: Promise<{ onboarding?: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex">
          <ProfilePageClient searchParams={searchParams} />
        </div>
      </div>
    </>
  );
}

