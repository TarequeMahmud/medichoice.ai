import { Test, TestingModule } from '@nestjs/testing';
import { TipsController } from '../tips.controller';
import { TipsService } from '../tips.service';

describe('TipsController', () => {
  let controller: TipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipsController],
      providers: [TipsService],
    }).compile();

    controller = module.get<TipsController>(TipsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
