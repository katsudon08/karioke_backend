import { Prisma, TagMap } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
export declare class TagMapService {
    private prisma;
    constructor(prisma: PrismaService);
    tagMap(tagMapWhereUniqueInput: Prisma.TagMapWhereUniqueInput): Promise<TagMap | null>;
    tagMaps(): Promise<TagMap[]>;
    createTagMap(data: Prisma.TagMapCreateInput): Promise<TagMap>;
    updateTagMap(params: {
        where: Prisma.TagMapWhereUniqueInput;
        data: Prisma.TagMapUpdateInput;
    }): Promise<TagMap>;
    deleteTagMap(where: Prisma.TagMapWhereUniqueInput): Promise<TagMap>;
    deleteTagMaps(): Promise<Prisma.BatchPayload>;
}
