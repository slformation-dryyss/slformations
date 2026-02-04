import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const user = await requireUser();
        const { action } = await req.json();

        if (action === "skip") {
            // User chose to skip password change permanently
            await prisma.user.update({
                where: { id: user.id },
                data: { mustChangePassword: false }
            });

            return NextResponse.json({ 
                success: true, 
                message: "Password change requirement removed" 
            });
        }

        // For "later" action, we don't update the database
        // The modal will show again on next login
        return NextResponse.json({ 
            success: true, 
            message: "Reminder postponed" 
        });

    } catch (error: any) {
        console.error("Skip password change error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
