import { NextResponse } from 'next/server';
import { getVehicles } from '@/lib/vehicles-store';

export async function GET() {
  try {
    const vehicles = await getVehicles();
    return NextResponse.json(vehicles);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json({ error: 'Error fetching vehicles' }, { status: 500 });
  }
}

