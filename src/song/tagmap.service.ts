import { Injectable } from "@nestjs/common";
import { Prisma, TagMap } from "@prisma/client";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class TagMapService {
    constructor(private prisma: PrismaService) {}

    async tagMap(
        tagMapWhereUniqueInput: Prisma.TagMapWhereUniqueInput
    ): Promise<TagMap | null> {
        return this.prisma.tagMap.findUnique({
            where: tagMapWhereUniqueInput
        })
    }

    async tagMaps(): Promise<TagMap[]> {
        return this.prisma.tagMap.findMany()
    }

    async createTagMap(data: Prisma.TagMapCreateInput): Promise<TagMap> {
        return this.prisma.tagMap.create({
            data
        })
    }

    async updateTagMap(params: {
        where: Prisma.TagMapWhereUniqueInput,
        data: Prisma.TagMapUpdateInput
    }): Promise<TagMap> {
        const { data, where } = params
        return this.prisma.tagMap.update({
            data,
            where
        })
    }

    async deleteTagMap(where: Prisma.TagMapWhereUniqueInput): Promise<TagMap> {
        return this.prisma.tagMap.delete({
            where
        })
    }

    async deleteTagMaps() {
        return this.prisma.tagMap.deleteMany()
    }
}