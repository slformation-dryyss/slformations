
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("DB URL from process.env:", process.env.DATABASE_URL);
  try {
    // List tables in public schema
    const tables: any[] = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Tables in public schema:", tables.map(t => t.table_name));

    const count = await prisma.user.count();
    console.log("User count via Prisma:", count);
    
    if (count > 0) {
      const users = await prisma.user.findMany({ take: 5 });
      console.log("First 5 users:", JSON.stringify(users, null, 2));
    } else {
        console.log("No users found via Prisma.");
    }

  } catch (e) {
    console.error("Error connecting or querying:", e);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
