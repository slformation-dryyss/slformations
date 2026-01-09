import { NextResponse } from "next/server";

export async function GET() {
    const vars = {
        AUTH0_SECRET: !!process.env.AUTH0_SECRET,
        AUTH0_BASE_URL: process.env.AUTH0_BASE_URL,
        AUTH0_ISSUER_BASE_URL: process.env.AUTH0_ISSUER_BASE_URL,
        AUTH0_CLIENT_ID: !!process.env.AUTH0_CLIENT_ID,
        AUTH0_CLIENT_SECRET: !!process.env.AUTH0_CLIENT_SECRET,
        DATABASE_URL: !!process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
    };

    return NextResponse.json(vars);
}
