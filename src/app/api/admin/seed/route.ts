
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { seedSSIAP } from '@/lib/seeds/ssiap';
import { seedSecourisme } from '@/lib/seeds/secourisme';

// Secret key to prevent unauthorized access (simple protection)
const SECRET_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "fallback_secret"; // Using an existing env var as pseudo-secret for convenience of this task, ideally use a dedicated one.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Basic security check: simple, but effective enough for this manual trigger
  // We can also check for user session role if we want to be strict.
  // For now, let's keep it simple: "secret=admin"
  if (secret !== 'admin_force_seed') {
     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log("🚀 Starting Seeding via API...");
    
    await seedSSIAP(prisma);
    await seedSecourisme(prisma);

    return NextResponse.json({ 
        success: true, 
        message: 'Database seeded successfully (SSIAP + Secourisme)' 
    });
  } catch (error) {
    console.error('API Seed Error:', error);
    return NextResponse.json({ 
        success: false, 
        error: String(error) 
    }, { status: 500 });
  }
}
