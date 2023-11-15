import { Prisma } from "@prisma/client";
export declare class Song implements Prisma.SongCreateInput {
    id: number;
    title: string;
    artist: string;
    rank: string;
    key: string;
    memo?: string;
}
