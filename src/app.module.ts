import { Module } from '@nestjs/common';
import { SongModule } from './song/song.module';

@Module({
    imports: [SongModule],
    controllers: [],
    providers: [],
})
export class AppModule { }
