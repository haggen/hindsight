import { type Prisma, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export type Board = Prisma.BoardGetPayload<{
  include: { columns: { include: { cards: true } } };
}>;

export type Column = Prisma.ColumnGetPayload<{
  include: { cards: true };
}>;

export { type Card } from "@prisma/client";
