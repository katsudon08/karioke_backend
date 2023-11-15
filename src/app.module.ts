import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SongModule } from './song/song.module';
import { CorsMiddleware } from './cors.middleware';
import { AppController } from './app.controller';

@Module({
    imports: [SongModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CorsMiddleware).forRoutes('*')
    }
}
