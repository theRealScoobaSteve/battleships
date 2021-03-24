import { Test, TestingModule } from '@nestjs/testing';
import { GridService } from './grid.service';

describe('GameService', () => {
  let service: GridService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GridService],
    }).compile();

    service = module.get<GridService>(GridService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
