import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SongService } from './song.service';
import { FolderService } from './folder.service';
import { Song, Folder } from "@prisma/client";

@Controller('song')
export class SongController {
    constructor(
        private readonly songService: SongService,
        private readonly folderService: FolderService
    ) {}

    @Get(":id")
    async getSong(@Param("id") id: string): Promise<Song> {
        return this.songService.song({
            id: Number(id)
        })
    }

    @Get("folders")
    async getFolders(): Promise<Folder[]> {
        return this.folderService.folders()
    }

    @Get()
    async getSongs(): Promise<Song[]> {
        return this.songService.songs()
    }

    @Post("folder")
    async createFolder(): Promise<string> {
        return "フォルダの作成"
    }

    @Post()
    async createSong(): Promise<string> {
        return "曲情報の作成"
    }

    @Put("folder")
    async updateFolder(): Promise<string> {
        return "フォルダのアップデート"
    }

    @Put()
    async updateSong(): Promise<string> {
        return "曲のアップデート"
    }

    @Delete("folder")
    async deleteFolder(): Promise<string> {
        return "フォルダの削除"
    }

    @Delete()
    async deleteSong(): Promise<string> {
        return "曲の削除"
    }
}
