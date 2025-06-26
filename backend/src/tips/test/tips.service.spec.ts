import { Test, TestingModule } from '@nestjs/testing';
import { TipsService } from '../tips.service';

describe('TipsService', () => {
  let service: TipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipsService],
    }).compile();

    service = module.get<TipsService>(TipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
