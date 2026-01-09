"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useCallback } from "react";
// import { useDebouncedCallback } from "use-debounce"; 

function useDebounce(callback: (...args: any[]) => void, delay: number) {
  const debounce = (func: (...args: any[]) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };
  return useCallback(debounce(callback, delay), [callback, delay]);
}

export function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = useDebounce((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  }, 300);

  const handleSort = (sort: string) => {
    const params = new URLSearchParams(searchParams);
    if (sort) {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`);
    });
  };

  const handleType = (type: string) => {
    const params = new URLSearchParams(searchParams);
    if (type && type !== "ALL") {
      params.set("type", type);
    } else {
      params.delete("type");
    }
    startTransition(() => {
        router.replace(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Rechercher une formation..."
          defaultValue={searchParams.get("q")?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-gold-500 focus:border-gold-500"
        />
        <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
      </div>
      <div className="flex gap-2">
        <select
          defaultValue={searchParams.get("type")?.toString() || "ALL"}
          onChange={(e) => handleType(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-gold-500 focus:border-gold-500 bg-white"
        >
          <option value="ALL">Tous les types</option>
          <option value="PERMIS">Permis</option>
          <option value="VTC">VTC</option>
          <option value="TAXI">Taxi</option>
          <option value="TECH">Tech / Dev</option>
          <option value="CMS">CMS</option>
          <option value="CYBER">Cybersécurité</option>
          <option value="FIMO">FIMO / Poids Lourd</option>
          <option value="TRANSPORT">Transport</option>
          <option value="AUTRE">Autre</option>
        </select>

        <select
          defaultValue={searchParams.get("sort")?.toString() || "category"}
          onChange={(e) => handleSort(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-gold-500 focus:border-gold-500 bg-white"
        >
          <option value="category">Par Catégorie/Type</option>
          <option value="recent">Plus récents</option>
          <option value="oldest">Plus anciens</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </select>
      </div>
    </div>
  );
}

