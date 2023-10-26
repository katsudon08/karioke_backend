import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SongModule } from './song/song.module';
import { CorsMiddleware } from './cors.middleware';

@Module({
    imports: [SongModule],
    controllers: [],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CorsMiddleware).forRoutes('*')
    }
}
