import { PrismaService } from 'src/prisma.service';
import { Song, Prisma } from "@prisma/client";
export declare class SongService {
    private prisma;
    constructor(prisma: PrismaService);
    song(songWhereUniqueInput: Prisma.SongWhereUniqueInput): Promise<Song | null>;
    songs(where?: Prisma.SongWhereInput): Promise<Song[]>;
    createSong(data: Prisma.SongCreateInput): Promise<Song>;
    updateSong(params: {
        where: Prisma.SongWhereUniqueInput;
        data: Prisma.SongUpdateInput;
    }): Promise<Song>;
    deleteSong(where: Prisma.SongWhereUniqueInput): Promise<Song>;
    deleteSongs(): Promise<Prisma.BatchPayload>;
}
