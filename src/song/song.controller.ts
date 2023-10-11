import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SongService } from './song.service';
import { TagService } from './tag.service';
import { TagMapService } from './tagmap.service';
import { Song, Tag, TagMap } from '@prisma/client';

interface GetResult {
    songs: Song[]
    tags: Tag[]
    tagMaps: TagMap[]
}

@Controller('song')
export class SongController {
    constructor(
        private readonly songService: SongService,
        private readonly tagService: TagService,
        private readonly tagMapService: TagMapService
    ) { }

    // * テスト用
    @Get()
    async getSongs(): Promise<GetResult> {
        const result = {
            songs: await this.songService.songs(),
            tags: await this.tagService.tags(),
            tagMaps: await this.tagMapService.tagMaps()
        }
        return result
    }

    // ! テスト未実装
    @Get("id")
    async getSongIds(): Promise<number[]> {
        const ids: number[] = [...await this.songService.songs()].map(song => song.id)
        return ids
    }

    // ! テスト未実装
    @Get("tagId")
    async getTagIds(): Promise<number[]> {
        const ids: number[] = [...await this.tagService.tags()].map(tag => tag.id)
        return ids
    }

    // ! テスト未実装
    @Get("tagmapId")
    async getTagMapIds(): Promise<number[]> {
        const ids: number[] = [...await this.tagMapService.tagMaps()].map(tag => tag.id)
        return ids
    }

    @Post()
    async createSong(@Body() params: {
        title: string,
        artist: string,
        rank: number,
        key: number,
        memo: string,
        tags: string[]
    }): Promise<string> {
        console.log(params)

        const tags: Tag[] = await this.tagService.tags()
        console.log("tags", tags)
        const newTags: Tag[] = [...tags].filter(tag => params.tags.includes(tag.name))
        console.log("newtags", newTags)
        const tagIds: number[] = [...newTags].map(tag => tag.id)
        console.log("tagids", tagIds)

        const song: Song = await this.songService.createSong({
            title: params.title,
            artist: params.artist,
            rank: params.rank,
            key: params.key,
            memo: params.memo
        })

        for await (const id of tagIds) {
            await this.tagMapService.createTagMap({
                songId: song.id,
                tagId: id
            })
        }

        return "succeeded"
    }

    @Post("tag")
    async createTag(@Body() param: {
        name: string
    }) {
        console.log(param.name)

        return this.tagService.createTag({
            name: param.name
        })
    }

    // ! テスト未実装
    // TODO: タグと曲情報の編集
    @Put()
    async updateSong(@Body() params: {
        id: number,
        data: {
            title: string,
            artist: string,
            rank: number,
            key: number,
            memo: string
        },
        tags: Tag[]
    }) {
        for await (const tag of params.tags) {
            await this.tagService.updateTag({
                where: {
                    id: tag.id
                },
                data: {
                    name: tag.name
                }
            })
        }

        return this.songService.updateSong({
            where: {
                id: params.id
            },
            data: params.data
        })
    }

    // テスト完了
    @Put("tag")
    async updateTag(@Body() params: {
        id: number,
        data: {
            name: string
        }
    }) {
        console.log(params)

        return this.tagService.updateTag({
            where: {
                id: params.id
            },
            data: params.data
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
    @Delete()
    async deleteAll(): Promise<string> {
        await this.songService.deleteSongs()
        await this.tagService.deleteTags()
        await this.tagMapService.deleteTagMaps()

        return "succeeded"
    }
}
