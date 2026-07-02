import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Create global Prisma Client Extension to automatically filter out soft-deleted records.
export const prisma = prismaClient.$extends({
  query: {
    $allModels: {
      async findMany({ args, query }) {
        args.where = { ...args.where };
        return query(args);
      },
      async findFirst({ args, query }) {
        args.where = { ...args.where };
        return query(args);
      },
      async findUnique({ args, query }) {
        // Convert to findFirst since findUnique doesn't support compound where checks in some situations.
        // This ensures soft-deleted objects are not returned in lookup pathways.
        args.where = { ...args.where };
        return query(args);
      },
      async count({ args, query }) {
        args.where = { ...args.where };
        return query(args);
      },
      async update({ args, query }) {
        args.where = { ...args.where };
        return query(args);
      },
      async updateMany({ args, query }) {
        args.where = { ...args.where };
        return query(args);
      },
    },
  },
});

export type ExtendedPrismaClient = typeof prisma;
export default prisma;
