import { SongService } from './song.service';
import { TagService } from './tag.service';
import { TagMapService } from './tagmap.service';
import { Song, Tag, TagMap } from '@prisma/client';
import { CreateSong, DecryptedSongOnId, DecryptedTagOnId, GetDecryptedResult, GetResult } from './types';
export declare class SongController {
    private readonly songService;
    private readonly tagService;
    private readonly tagMapService;
    constructor(songService: SongService, tagService: TagService, tagMapService: TagMapService);
    getAll(): Promise<GetResult>;
    getDecryptedAll(): Promise<GetDecryptedResult>;
    crypto(): Promise<{
        title: string;
        artist: string;
        rank: string;
        key: string;
        memo: string;
    }>;
    getSongs(): Promise<DecryptedSongOnId[]>;
    getTags(): Promise<string[]>;
    getTagOnIds(): Promise<Tag[]>;
    getSongIds(): Promise<number[]>;
    getTagIds(): Promise<number[]>;
    getTagMapIds(): Promise<number[]>;
    getTagMap(): Promise<TagMap[]>;
    createSong(params: CreateSong): Promise<string>;
    createTag(param: {
        name: string;
    }): Promise<{
        id: number;
        name: string;
    }>;
    updateSong(params: {
        data: DecryptedSongOnId;
        tagIds: number[];
    }): Promise<{
        id: number;
        title: string;
        artist: string;
        rank: string;
        key: string;
        memo: string;
    }>;
    updateTag(params: {
        data: DecryptedTagOnId;
    }): Promise<{
        id: number;
        name: string;
    }>;
    deleteSong(param: {
        id: number;
    }): Promise<Song>;
    deleteTag(param: {
        id: number;
    }): Promise<Tag>;
    deleteSongs(): Promise<string>;
    deleteTagSongs(param: {
        slug: string;
    }): Promise<string>;
    deleteAll(): Promise<string>;
}
