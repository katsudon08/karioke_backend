import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { Folder, Prisma } from "@prisma/client";

@Injectable()
export class FolderService {
    constructor(private readonly prisma: PrismaService) {}

    async folder(
        folderWhereUniqueInput: Prisma.FolderWhereUniqueInput
    ): Promise<Folder> {
        return this.prisma.folder.findUnique({
            where: folderWhereUniqueInput,
        })
    }

    async folders(): Promise<Folder[]> {
        return this.prisma.folder.findMany()
    }

    async createFolder(data: Prisma.FolderCreateInput): Promise<Folder> {
        return this.prisma.folder.create({
            data,
        })
    }

    async updateFolder(params: {
        where: Prisma.FolderWhereUniqueInput,
        data: Prisma.FolderUpdateInput
    }): Promise<Folder> {
        const { data, where } = params
        return this.prisma.folder.update({
            data,
            where,
        })
    }

    async delete(where: Prisma.FolderWhereUniqueInput): Promise<Folder> {
        return this.prisma.folder.delete({
            where,
        })
    }
}