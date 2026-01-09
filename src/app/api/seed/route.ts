import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Clean up existing data
    await prisma.booking.deleteMany();
    await prisma.course.deleteMany();
    // await prisma.vehicle.deleteMany(); // Vehicle model missing from schema
    await prisma.user.deleteMany();

    // Seed Courses
    const courses = [
      {
        title: 'Permis Moto A2',
        slug: 'permis-moto',
        description: 'Formation complète pour obtenir votre permis moto A2. Théorie et pratique avec moniteurs certifiés.',
        price: 890,
        type: 'PERMIS_MOTO',
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/fc6207cbc0-64789b144a16ff4f1f8d.png',
        isPublished: true,
      },
      {
        title: 'Permis Voiture B',
        slug: 'permis-auto',
        description: 'Formation permis B avec code et conduite. Véhicules récents et pédagogie moderne.',
        price: 1200,
        type: 'PERMIS_AUTO',
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2c2b07b86f-caef7f9e7b84aa8117b4.png',
        isPublished: true,
      },
      {
        title: 'Formation VTC Complète',
        slug: 'vtc',
        description: 'Devenez chauffeur VTC professionnel. Formation théorique et pratique certifiante.',
        price: 1800,
        type: 'VTC',
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/3eeb01f1b1-24bc748e251ee386a5d3.png',
        isPublished: true,
      },
      {
        title: 'SSIAP 1 - Agent de Sécurité',
        slug: 'ssiap-1',
        description: 'Formation agent de sécurité incendie et d\'assistance à personnes. Diplôme SSIAP 1.',
        price: 950,
        type: 'SSIAP',
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/af9a0550ea-7c4efe01cf88d0747eea.png',
        isPublished: true,
      },
      {
        title: 'Formation Chauffeur Taxi',
        slug: 'taxi',
        description: 'Formation complète pour obtenir votre carte professionnelle de chauffeur de taxi.',
        price: 1650,
        type: 'TAXI',
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/b83e3e70c9-0d1cd687f14b60ecde2d.png',
        isPublished: true,
      },
      {
        title: 'Permis Poids Lourd C',
        slug: 'permis-poids-lourd-c',
        description: 'Formation permis C pour conduire des véhicules de transport de marchandises.',
        price: 2200,
        type: 'PERMIS_POIDS_LOURD',
        imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/3665ad5540-77ae61ea5dddd6121294.png',
        isPublished: true,
      },
    ];

    for (const course of courses) {
      await prisma.course.create({
        data: course,
      });
    }

    // Seed Vehicles (Vehicle model missing from schema)
    /*
    const vehicles = [
      {
        model: 'Tesla Model 3',
        brand: 'Tesla',
        type: 'ELECTRIC',
        pricePerDay: 49,
        status: 'AVAILABLE',
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/7432e9d0d4-891813ec552ad6192df3.png',
        features: JSON.stringify(['5 places', 'Auto', 'Électrique', 'GPS', 'Autopilot']),
      },
      {
        model: 'Lexus UX',
        brand: 'Lexus',
        type: 'HYBRID',
        pricePerDay: 55,
        status: 'AVAILABLE',
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/21c3465555-390ef9af48a20786749e.png',
        features: JSON.stringify(['5 places', 'Auto', 'Hybride', 'Cuir', 'Toit ouvrant']),
      },
      {
        model: 'Mercedes Classe E',
        brand: 'Mercedes',
        type: 'DIESEL',
        pricePerDay: 65,
        status: 'MAINTENANCE',
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/bf0a23550a-2676c17a7cba185d017e.png',
        features: JSON.stringify(['5 places', 'Auto', 'Diesel', 'Luxe', 'Sièges chauffants']),
      },
      {
        model: 'BMW Série 3',
        brand: 'BMW',
        type: 'SEDAN',
        pricePerDay: 52,
        status: 'AVAILABLE',
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/e716ab0f84-d501dd14f4b9786422a0.png',
        features: JSON.stringify(['5 places', 'Auto', 'Essence', 'Sport']),
      },
      {
        model: 'Toyota Camry',
        brand: 'Toyota',
        type: 'HYBRID',
        pricePerDay: 42,
        status: 'AVAILABLE',
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/6909e2bc13-3a83ab9a9b829340107c.png',
        features: JSON.stringify(['5 places', 'Auto', 'Hybride', 'Eco']),
      },
      {
        model: 'Audi A4',
        brand: 'Audi',
        type: 'DIESEL',
        pricePerDay: 58,
        status: 'AVAILABLE',
        image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/66fa540a7f-12e99d82d3f711bd8602.png',
        features: JSON.stringify(['5 places', 'Auto', 'Diesel', 'Virtual Cockpit']),
      },
    ];

    for (const vehicle of vehicles) {
      await prisma.vehicle.create({
        data: vehicle,
      });
    }
    */

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

