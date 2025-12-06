require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'file:./dev.db',
        },
    },
});

async function main() {
    console.log('Start seeding ...');

    // Clean up existing data
    try {
        await prisma.booking.deleteMany();
        await prisma.course.deleteMany();
        await prisma.vehicle.deleteMany();
        await prisma.user.deleteMany();
    } catch (e) {
        console.log('Error cleaning up data (tables might not exist yet):', e.message);
    }

    // Seed Courses
    const courses = [
        {
            title: 'Permis Moto A2',
            description: 'Formation complète pour obtenir votre permis moto A2. Théorie et pratique avec moniteurs certifiés.',
            price: 890,
            duration: 20,
            type: 'PERMIS_MOTO',
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/fc6207cbc0-64789b144a16ff4f1f8d.png',
        },
        {
            title: 'Permis Voiture B',
            description: 'Formation permis B avec code et conduite. Véhicules récents et pédagogie moderne.',
            price: 1200,
            duration: 35,
            type: 'PERMIS_AUTO',
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2c2b07b86f-caef7f9e7b84aa8117b4.png',
        },
        {
            title: 'Formation VTC Complète',
            description: 'Devenez chauffeur VTC professionnel. Formation théorique et pratique certifiante.',
            price: 1800,
            duration: 50,
            type: 'VTC',
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/3eeb01f1b1-24bc748e251ee386a5d3.png',
        },
        {
            title: 'SSIAP 1 - Agent de Sécurité',
            description: 'Formation agent de sécurité incendie et d\'assistance à personnes. Diplôme SSIAP 1.',
            price: 950,
            duration: 67,
            type: 'SSIAP',
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/af9a0550ea-7c4efe01cf88d0747eea.png',
        },
        {
            title: 'Formation Chauffeur Taxi',
            description: 'Formation complète pour obtenir votre carte professionnelle de chauffeur de taxi.',
            price: 1650,
            duration: 45,
            type: 'TAXI',
            image: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/b83e3e70c9-0d1cd687f14b60ecde2d.png',
        },
        {
            title: 'Permis Poids Lourd C',
            description: 'Formation permis C pour conduire des véhicules de transport de marchandises.',
            price: 2200,
            duration: 105,
            type: 'PERMIS_POIDS_LOURD',
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

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
