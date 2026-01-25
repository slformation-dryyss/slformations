import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  // Ensure connection limit is set to avoid "too many connections" in production
  const url = process.env.DATABASE_URL;
  let datasources = undefined;

  if (url && process.env.NODE_ENV === "production" && !url.includes("connection_limit")) {
     const separator = url.includes("?") ? "&" : "?";
     datasources = {
       db: {
         url: `${url}${separator}connection_limit=3`
       }
     };
  }

  return new PrismaClient({
    datasources
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// ALWAYS save to globalThis in both environments to be absolutely safe against leaks
globalForPrisma.prisma = prisma;

