import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const dbUrl = process.env.DATABASE_URL || "";
  
  if (dbUrl.startsWith("file:") || dbUrl.includes(".db") || !dbUrl) {
    try {
      const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
      const adapter = new PrismaBetterSqlite3({ url: dbUrl || "file:dev.db" });
      return new PrismaClient({ adapter });
    } catch (e) {
      console.warn("Failing back to standard PrismaClient:", e);
    }
  }
  
  // PostgreSQL configuration using Prisma 7 Pg adapter
  try {
    const { Pool } = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const pool = new Pool({ 
      connectionString: dbUrl,
      max: 10,                  // Maximum number of connections in the pool
      idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
      connectionTimeoutMillis: 2000 // Abort if connection takes longer than 2 seconds
    });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } catch (e) {
    console.error("Failed to load PostgreSQL adapter:", e);
    return new PrismaClient();
  }
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
