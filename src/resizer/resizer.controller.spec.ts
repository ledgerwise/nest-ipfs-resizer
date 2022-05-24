import { Test, TestingModule } from '@nestjs/testing';
import { ResizerController } from './resizer.controller';
import { ResizerService } from './resizer.service';

describe('ResizerController', () => {
  let controller: ResizerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResizerController],
      providers: [ResizerService]
    }).compile();

    controller = module.get<ResizerController>(ResizerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
