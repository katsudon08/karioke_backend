import { Prisma } from "@prisma/client";
export declare class TagMap implements Prisma.TagMapCreateInput {
    songId: number;
    tagId: number;
}
