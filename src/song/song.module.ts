import { Module } from '@nestjs/common';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { TagService } from './tag.service';
import { TagMapService } from './tagmap.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SongController],
  // prismaのサービス依存を解消する必要がある
  providers: [SongService, TagService, TagMapService, PrismaService]
})
export class SongModule {}
