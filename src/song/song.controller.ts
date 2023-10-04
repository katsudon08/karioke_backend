import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { SongService } from './song.service';

@Controller('song')
export class SongController {
    constructor(
        private readonly songService: SongService,
    ) {}

}
