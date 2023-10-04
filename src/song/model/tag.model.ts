import { Prisma } from "@prisma/client";

export class Tag implements Prisma.TagCreateInput {
    name: string;
}