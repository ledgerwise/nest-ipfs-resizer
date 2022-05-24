import { Test, TestingModule } from '@nestjs/testing';
import { ResizerController } from './resizer.controller';

describe('ResizerController', () => {
  let controller: ResizerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResizerController],
    }).compile();

    controller = module.get<ResizerController>(ResizerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
