import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResizerModule } from './resizer/resizer.module';

@Module({
  imports: [ResizerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
