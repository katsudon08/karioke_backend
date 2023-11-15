import { Prisma, Tag } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
export declare class TagService {
    private prisma;
    constructor(prisma: PrismaService);
    tag(tagWhereUniqueInput: Prisma.TagWhereUniqueInput): Promise<Tag | null>;
    tags(): Promise<Tag[]>;
    createTag(data: Prisma.TagCreateInput): Promise<Tag>;
    updateTag(params: {
        where: Prisma.TagWhereUniqueInput;
        data: Prisma.TagUpdateInput;
    }): Promise<Tag>;
    deleteTag(where: Prisma.TagWhereUniqueInput): Promise<Tag>;
    deleteTags(): Promise<Prisma.BatchPayload>;
}
