import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Song, Prisma } from "@prisma/client";

@Injectable()
export class SongService {
    constructor(private prisma: PrismaService) {}

    async song(
        songWhereUniqueInput: Prisma.SongWhereUniqueInput,
    ): Promise<Song | null> {
        return this.prisma.song.findUnique({
            where: songWhereUniqueInput,
        })
    }

    async songs(): Promise<Song[]> {
        return this.prisma.song.findMany()
    }

    async createSong(data: Prisma.SongCreateInput): Promise<Song> {
        return this.prisma.song.create({
            data,
        })
    }

    async updateSong(params: {
        where: Prisma.SongWhereUniqueInput
        data: Prisma.SongUpdateInput
    }): Promise<Song> {
        const { data, where } = params
        return this.prisma.song.update({
            data,
            where,
        })
    }

    async deleteSong(where: Prisma.SongWhereUniqueInput): Promise<Song> {
        return this.prisma.song.delete({
            where,
        })
    }
}
