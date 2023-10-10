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

    @Get()
    async getSongs(): Promise<GetResult> {
        const result = {
            songs: await this.songService.songs(),
            tags: await this.tagService.tags(),
            tagMaps: await this.tagMapService.tagMaps()
        }
        return result
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
        tags: string[]
    }) {

    }

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

    @Delete()
    async deleteAll(): Promise<string> {
        await this.songService.deleteSongs()
        await this.tagService.deleteTags()
        await this.tagMapService.deleteTagMaps()

        return "succeeded"
    }
}
