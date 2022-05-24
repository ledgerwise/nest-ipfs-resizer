import { Module } from '@nestjs/common';
import { ResizerService } from './resizer.service';
import { ResizerController } from './resizer.controller';

@Module({
  providers: [ResizerService],
  controllers: [ResizerController]
})
export class ResizerModule {}
