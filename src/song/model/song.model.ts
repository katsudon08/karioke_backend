import { Prisma } from "@prisma/client";

export class Song implements Prisma.SongCreateInput {
    id: number;
    title: string;
    artist: string;
    rank: number;
    key: number;
    memo?: string;
}