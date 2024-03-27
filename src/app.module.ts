import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './services/app.service';
import { ConfigModule } from '@nestjs/config';
import { HelperService } from './services/helpers.service';
import { ImageService } from './services/image.service';
import { VideoService } from './services/video.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    HelperService,
    ImageService,
    VideoService
  ],
})
export class AppModule {}
