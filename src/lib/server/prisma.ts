import { type Prisma, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export type Id = string;

export type Board = Prisma.BoardGetPayload<{
  include: {
    columns: {
      include: {
        cards: {
          include: { votes: true };
        };
      };
    };
  };
}>;

export type Column = Prisma.ColumnGetPayload<{
  include: {
    cards: {
      include: { votes: true };
    };
  };
}>;

export type Card = Prisma.CardGetPayload<{
  include: { votes: true };
}>;
