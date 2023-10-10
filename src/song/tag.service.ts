import { Injectable } from "@nestjs/common";
import { Prisma, Tag } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class TagService {
    constructor(private prisma: PrismaService) {}

    async tag(
        tagWhereUniqueInput: Prisma.TagWhereUniqueInput
    ): Promise<Tag | null> {
        return this.prisma.tag.findUnique({
            where: tagWhereUniqueInput
        })
    }

    async tags(): Promise<Tag[]> {
        return this.prisma.tag.findMany()
    }

    async createTag(data: Prisma.TagCreateInput): Promise<Tag> {
        return this.prisma.tag.create({
            data
        })
    }

    async updateTag(params: {
        where: Prisma.TagWhereUniqueInput,
        data: Prisma.TagUpdateInput
    }): Promise<Tag> {
        const { data, where } = params
        return this.prisma.tag.update({
            data,
            where
        })
    }

    async deleteTag(where: Prisma.TagWhereUniqueInput): Promise<Tag> {
        return this.prisma.tag.delete({
            where
        })
    }

    async deleteTags() {
        return this.prisma.tag.deleteMany()
    }
}