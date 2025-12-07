import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CourseType, VehicleType, VehicleStatus } from '@prisma/client';

export async function GET() {
  try {
    // Clean up existing data
    await prisma.booking.deleteMany();
    await prisma.course.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.user.deleteMany();

    // Seed Courses
    const courses = [
      {
        title: 'Permis Moto A2',
        description: 'Formation complète pour obtenir votre permis moto A2. Théorie et pratique avec moniteurs certifiés.',
        price: 890,
        duration: 20,
        type: 'PERMIS_MOTO' as CourseType,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/fc6207cbc0-64789b144a16ff4f1f8d.png',
      },
      {
        title: 'Permis Voiture B',
        description: 'Formation permis B avec code et conduite. Véhicules récents et pédagogie moderne.',
        price: 1200,
        duration: 35,
        type: 'PERMIS_AUTO' as CourseType,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2c2b07b86f-caef7f9e7b84aa8117b4.png',
      },
      {
        title: 'Formation VTC Complète',
        description: 'Devenez chauffeur VTC professionnel. Formation théorique et pratique certifiante.',
        price: 1800,
        duration: 50,
        type: 'VTC' as CourseType,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/3eeb01f1b1-24bc748e251ee386a5d3.png',
      },
      {
        title: 'SSIAP 1 - Agent de Sécurité',
        description: 'Formation agent de sécurité incendie et d\'assistance à personnes. Diplôme SSIAP 1.',
        price: 950,
        duration: 67,
        type: 'SSIAP' as CourseType,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/af9a0550ea-7c4efe01cf88d0747eea.png',
      },
      {
        title: 'Formation Chauffeur Taxi',
        description: 'Formation complète pour obtenir votre carte professionnelle de chauffeur de taxi.',
        price: 1650,
        duration: 45,
        type: 'TAXI' as CourseType,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/b83e3e70c9-0d1cd687f14b60ecde2d.png',
      },
      {
        title: 'Permis Poids Lourd C',
        description: 'Formation permis C pour conduire des véhicules de transport de marchandises.',
        price: 2200,
        duration: 105,
        type: 'PERMIS_POIDS_LOURD' as CourseType,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/3665ad5540-77ae61ea5dddd6121294.png',
      },
    ];

    for (const course of courses) {
      await prisma.course.create({
        data: course,
      });
    }

    // Seed Vehicles
    const vehicles = [
      {
        model: 'Tesla Model 3',
        brand: 'Tesla',
        type: 'ELECTRIC' as VehicleType,
        pricePerDay: 49,
        status: 'AVAILABLE' as VehicleStatus,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/7432e9d0d4-891813ec552ad6192df3.png',
        features: JSON.stringify(['5 places', 'Auto', 'Électrique', 'GPS', 'Autopilot']),
      },
      {
        model: 'Lexus UX',
        brand: 'Lexus',
        type: 'HYBRID' as VehicleType,
        pricePerDay: 55,
        status: 'AVAILABLE' as VehicleStatus,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/21c3465555-390ef9af48a20786749e.png',
        features: JSON.stringify(['5 places', 'Auto', 'Hybride', 'Cuir', 'Toit ouvrant']),
      },
      {
        model: 'Mercedes Classe E',
        brand: 'Mercedes',
        type: 'DIESEL' as VehicleType,
        pricePerDay: 65,
        status: 'MAINTENANCE' as VehicleStatus,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/bf0a23550a-2676c17a7cba185d017e.png',
        features: JSON.stringify(['5 places', 'Auto', 'Diesel', 'Luxe', 'Sièges chauffants']),
      },
      {
        model: 'BMW Série 3',
        brand: 'BMW',
        type: 'SEDAN' as VehicleType,
        pricePerDay: 52,
        status: 'AVAILABLE' as VehicleStatus,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e716ab0f84-d501dd14f4b9786422a0.png',
        features: JSON.stringify(['5 places', 'Auto', 'Essence', 'Sport']),
      },
      {
        model: 'Toyota Camry',
        brand: 'Toyota',
        type: 'HYBRID' as VehicleType,
        pricePerDay: 42,
        status: 'AVAILABLE' as VehicleStatus,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/6909e2bc13-3a83ab9a9b829340107c.png',
        features: JSON.stringify(['5 places', 'Auto', 'Hybride', 'Eco']),
      },
      {
        model: 'Audi A4',
        brand: 'Audi',
        type: 'DIESEL' as VehicleType,
        pricePerDay: 58,
        status: 'AVAILABLE' as VehicleStatus,
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/66fa540a7f-12e99d82d3f711bd8602.png',
        features: JSON.stringify(['5 places', 'Auto', 'Diesel', 'Virtual Cockpit']),
      },
    ];

    for (const vehicle of vehicles) {
      await prisma.vehicle.create({
        data: vehicle,
      });
    }

    return NextResponse.json({ message: 'Seeding finished successfully' });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ 
      error: 'Error seeding database', 
      message: error.message,
      stack: error.stack,
      details: JSON.stringify(error)
    }, { status: 500 });
  }
}
