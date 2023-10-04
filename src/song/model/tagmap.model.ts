import { Prisma } from "@prisma/client";

export class TagMap implements Prisma.TagMapCreateInput {
    songId: number;
    tagId: number;
}