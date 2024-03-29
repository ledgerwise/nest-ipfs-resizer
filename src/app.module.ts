import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { ConfigModule } from '@nestjs/config';
import { HelperService } from './services/helpers.service';
import { ImageService } from './services/image.service';
import { VideoService } from './services/video.service';
import { ScheduleModule } from '@nestjs/schedule';
import { PruneMediaService } from './services/prune-media.service';
import { AudioService } from './services/audio.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    HelperService,
    ImageService,
    AudioService,
    VideoService,
    PruneMediaService
  ],
})
export class AppModule {}
