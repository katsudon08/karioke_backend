import { Song, Tag, TagMap } from "@prisma/client";
export interface GetResult {
    songs: Song[];
    tags: Tag[];
    tagMaps: TagMap[];
}
export interface GetDecryptedResult {
    songs: DecryptedSong[];
    tags: DecryptedTag[];
    tagMaps: TagMap[];
}
export interface DecryptedSong {
    title: string;
    artist: string;
    rank: number;
    key: number;
    memo: string;
}
export interface DecryptedSongOnId extends DecryptedSong {
    id: number;
}
export interface DecryptedTag {
    name: string;
}
export interface DecryptedTagOnId extends DecryptedTag {
    id: number;
}
export interface CreateSong extends DecryptedSong {
    tags: string[];
}
