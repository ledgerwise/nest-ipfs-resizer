import { Test, TestingModule } from '@nestjs/testing';
import { ResizerService } from './resizer.service';

describe('ResizerService', () => {
  let service: ResizerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResizerService],
    }).compile();

    service = module.get<ResizerService>(ResizerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
