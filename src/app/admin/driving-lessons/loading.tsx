import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <LoadingSpinner className="w-12 h-12 text-gold-500" />
      <p className="text-slate-500 font-medium animate-pulse">
        Chargement des leçons de conduite...
      </p>
    </div>
  );
}
