import { Controller, Get, Post, Put, Delete, Body } from '@nestjs/common';
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
    // 取得成功
    @Get()
    async getSongs(): Promise<DecryptedSongOnId[]> {
        const encryptedSongs = (await this.songService.songs()).sort((a, b) => a.id - b.id)

        const decryptedSongs = [...encryptedSongs].map(song => decryptSong(song))

        return decryptedSongs
    }

    // 復号完了
    // テスト完了
    @Get("tag")
    async getTags(): Promise<string[]> {
        const encryptedTags = (await this.tagService.tags()).sort((a, b) => a.id - b.id)

        const decryptedTags = [...encryptedTags].map(tag => decryptTag(tag))
        const tags: string[] = [...decryptedTags].map(tag => tag.name)

        return tags
    }

    @Get("tagOnId")
    async getTagOnIds(): Promise<Tag[]> {
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

    @Get("tagmap")
    async getTagMap(): Promise<TagMap[]> {
        const tagmaps: TagMap[] = (await this.tagMapService.tagMaps()).sort((a, b) => a.id - b.id)

        return tagmaps
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

        return "succeed"
    }

    // 暗号化完了
    // テスト完了
    // 送信成功
    @Post("tag")
    async createTag(@Body() param: {
        name: string
    }) {
        console.log(param)
        console.log(param.name)

        const encryptedName = encryptTag(param)

        return this.tagService.createTag(encryptedName)
    }

    // 暗号化完了
    // テスト完了
    @Put()
    async updateSong(@Body() params: {
        data: DecryptedSongOnId,
        tagIds: number[]
    }) {
        console.log(params)

        const encryptedSong = encryptSong(params.data)

        const tagmaps: TagMap[] = await this.tagMapService.tagMaps()
        const newTagMaps: TagMap[] = [...tagmaps].filter(tagmap => tagmap.songId === params.data.id)

        // 今までのtagmapを削除
        newTagMaps.map(tagmap => {
            this.tagMapService.deleteTagMap({
                id: tagmap.id
            })
        })

        // tagmapの書き換え
        params.tagIds.map(id => {
            this.tagMapService.createTagMap({
                songId: params.data.id,
                tagId: id
            })
        })

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

    @Delete("home")
    async deleteSongs(): Promise<string> {
        await this.songService.deleteSongs()
        await this.tagMapService.deleteTagMaps()
        console.log("succeeded")

        return "succeeded"
    }

    @Delete("slug")
    async deleteTagSongs(@Body() param: {
        slug: string
    }): Promise<string> {
        console.log("slug: ", param.slug)

        const tagOnIds = await this.tagService.tags()
        const decryptedTags = [...tagOnIds].map(tag => decryptTag(tag))
        console.log("tagOnIds", decryptedTags)
        const filterTags = [...decryptedTags].filter(tag => tag.name === param.slug)
        console.log(filterTags)

        if (filterTags.length === 0) {
            return "not delete 1"
        }
        const filterTagId: number = [...filterTags].map(tag => tag.id)[0]

        const tagmaps = await this.tagMapService.tagMaps()
        const filterTagmaps = [...tagmaps].filter(tag => tag.tagId === filterTagId)
        console.log(filterTagmaps)
        if (filterTagmaps.length === 0) {
            return "not delete 2"
        }
        filterTagmaps.map(async tagmap => {
            await this.tagMapService.deleteTagMap({
                id: tagmap.id
            })
        })

        await this.tagService.deleteTag({
            id: filterTagId
        })

        return "succeeded"
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
