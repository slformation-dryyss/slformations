import { NextResponse } from "next/server";
import { getCourses } from "@/lib/courses";

export async function GET() {
  try {
    const courses = await getCourses();
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Error fetching courses" },
      { status: 500 }
    );
  }
}

