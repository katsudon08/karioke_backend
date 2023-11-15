import { Song, Tag } from "@prisma/client";
export declare const encryptSong: (params: {
    title: string;
    artist: string;
    rank: number;
    key: number;
    memo: string;
}) => {
    title: string;
    artist: string;
    rank: string;
    key: string;
    memo: string;
};
export declare const encryptTag: (param: {
    name: string;
}) => {
    name: string;
};
export declare const decryptSong: (params: Song) => {
    id: number;
    title: string;
    artist: string;
    rank: number;
    key: number;
    memo: string;
};
export declare const decryptTag: (param: Tag) => {
    id: number;
    name: string;
};
