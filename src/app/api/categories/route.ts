import { NextResponse } from "next/server";
import { getCategoriesWithCourses } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await getCategoriesWithCourses();
    
    // Flatten the response for easier consumption in the frontend
    const formattedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      courses: cat.courses
        .map(cc => cc.course)
        .filter(c => c !== null) // Safety check
    }));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
