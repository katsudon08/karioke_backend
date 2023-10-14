import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SongService } from './song.service';
import { TagService } from './tag.service';
import { TagMapService } from './tagmap.service';
import { Song, Tag, TagMap } from '@prisma/client';
import { AES } from 'crypto-ts';
import { decryptSong, decryptTag, encryptSong, encryptTag } from './crypt';
import { CreateSong, DecryptedSong, DecryptedSongOnId, DecryptedTag, DecryptedTagOnId, GetDecryptedResult, GetResult } from './types';

@Controller('song')
export class SongController {
    constructor(
        private readonly songService: SongService,
        private readonly tagService: TagService,
        private readonly tagMapService: TagMapService
    ) { }

    // * テスト用(idによる昇順に変更)
    @Get("test")
    async getAll(): Promise<GetResult> {
        const result = {
            songs: (await this.songService.songs()).sort((a, b) => a.id - b.id),
            tags: (await this.tagService.tags()).sort((a, b) => a.id - b.id),
            tagMaps: (await this.tagMapService.tagMaps()).sort((a, b) => a.id - b.id)
        }
        return result
    }

    // * テスト用
    @Get("testDecrypted")
    async getDecryptedAll(): Promise<GetDecryptedResult> {
        const encryptedSongs = (await this.songService.songs()).sort((a, b) => a.id - b.id)
        const encryptedTags = (await this.tagService.tags()).sort((a, b) => a.id - b.id)
        const tagMaps = (await this.tagMapService.tagMaps()).sort((a, b) => a.id - b.id)

        const decryptedSongs = [...encryptedSongs].map(song => decryptSong(song))
        const decryptedTags = [...encryptedTags].map(tag => decryptTag(tag))

        const result = {
            songs: decryptedSongs,
            tags: decryptedTags,
            tagMaps: tagMaps
        }
        return result
    }

    // * テスト用
    @Get("crypto")
    async crypto() {
        const getSong = await this.songService.song({
            id: 8
        })

        const encryptedTitle = AES.encrypt(getSong.title, "title").toString()
        const encryptedArtist = AES.encrypt(getSong.artist, "artist").toString()
        const encryptedRank = AES.encrypt(String(getSong.rank), "rank").toString()
        const encryptedKey = AES.encrypt(String(getSong.key), "key").toString()
        const encryptedMemo = AES.encrypt(getSong.memo, "memo").toString()

        console.log(encryptedTitle)

        return {
            "title": encryptedTitle,
            "artist": encryptedArtist,
            "rank": encryptedRank,
            "key": encryptedKey,
            "memo": encryptedMemo
        }
    }

    // 復号完了
    // テスト完了
    @Get()
    async getSongs(): Promise<DecryptedSong[]> {
        const encryptedSongs = (await this.songService.songs()).sort((a, b) => a.id - b.id)

        const decryptedSongs = [...encryptedSongs].map(song => decryptSong(song))

        return decryptedSongs
    }

    // 復号完了
    // テスト完了
    @Get("tag")
    async getTags(): Promise<DecryptedTag[]> {
        const encryptedTags = (await this.tagService.tags()).sort((a, b) => a.id - b.id)

        const decryptedTags = [...encryptedTags].map(tag => decryptTag(tag))

        return decryptedTags
    }

    // テスト完了
    @Get("id")
    async getSongIds(): Promise<number[]> {
        const ids: number[] = [...await this.songService.songs()].map(song => song.id)
        const sortedIds: number[] = [...ids].sort()
        return sortedIds
    }

    // テスト完了
    @Get("tagId")
    async getTagIds(): Promise<number[]> {
        const ids: number[] = [...await this.tagService.tags()].map(tag => tag.id)
        const sortedIds: number[] = [...ids].sort()
        return sortedIds
    }

    // テスト完了
    @Get("tagmapId")
    async getTagMapIds(): Promise<number[]> {
        const ids: number[] = [...await this.tagMapService.tagMaps()].map(tag => tag.id)
        const sortedIds: number[] = [...ids].sort()
        return sortedIds
    }

    // 暗号化完了
    //  テスト完了
    @Post()
    async createSong(@Body() params: CreateSong): Promise<string> {
        console.log(params)

        const tags: DecryptedTagOnId[] = [...await this.tagService.tags()].map(tag => decryptTag(tag))
        console.log("tags", tags)
        const newTags: DecryptedTagOnId[] = [...tags].filter(tag => params.tags.includes(tag.name))
        console.log("newtags", newTags)
        const tagIds: number[] = [...newTags].map(tag => tag.id)
        console.log("tagids", tagIds)

        const encryptedSong = encryptSong(params)

        const song: Song = await this.songService.createSong(encryptedSong)

        for await (const id of tagIds) {
            await this.tagMapService.createTagMap({
                songId: song.id,
                tagId: id
            })
        }

        return "succeeded"
    }

    // 暗号化完了
    // テスト完了
    @Post("tag")
    async createTag(@Body() param: {
        name: string
    }) {
        console.log(param.name)

        const encryptedName = encryptTag(param)

        return this.tagService.createTag(encryptedName)
    }

    // 暗号化完了
    // テスト完了
    @Put()
    async updateSong(@Body() params: {
        data: DecryptedSongOnId,
        tags: DecryptedTagOnId[]
    }) {
        console.log(params)

        const encryptedSong = encryptSong(params.data)

        const tagmaps: TagMap[] = await this.tagMapService.tagMaps()
        const newTagMaps: TagMap[] = [...tagmaps].filter(tagmap => tagmap.songId === params.data.id)
        const tagIds: number[] = [...newTagMaps].map(tagmap => tagmap.tagId)

        for await (const tag of params.tags) {
            await this.tagService.updateTag({
                where: {
                    id: tag.id
                },
                data: {
                    name: tag.name
                }
            })
            if (tagIds.includes(tag.id)) {
                continue
            }
            await this.deleteTag({
                id: tag.id
            })
        }

        return this.songService.updateSong({
            where: {
                id: params.data.id
            },
            data: encryptedSong
        })
    }

    // 暗号化完了
    // テスト完了
    @Put("tag")
    async updateTag(@Body() params: {
        data: DecryptedTagOnId
    }) {
        console.log(params)

        const encryptedName = encryptTag(params.data)

        return this.tagService.updateTag({
            where: {
                id: params.data.id
            },
            data: encryptedName
        })
    }

    // テスト完了
    @Delete()
    async deleteSong(@Body() param: {
        id: number,
    }): Promise<Song> {
        console.log(param)

        return this.songService.deleteSong({
            id: param.id
        })
    }

    // テスト完了
    @Delete("tag")
    async deleteTag(@Body() param: {
        id: number
    }): Promise<Tag> {
        console.log(param)

        return this.tagService.deleteTag({
            id: param.id
        })
    }

    // * テスト用
    @Delete("test")
    async deleteAll(): Promise<string> {
        await this.songService.deleteSongs()
        await this.tagService.deleteTags()
        await this.tagMapService.deleteTagMaps()

        return "succeeded"
    }
}
