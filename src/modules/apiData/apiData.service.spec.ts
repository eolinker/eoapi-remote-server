import { Test, TestingModule } from '@nestjs/testing';
import { ApiDataService } from './apiData.service';

describe('ApiDataService', () => {
  let service: ApiDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiDataService],
    }).compile();

    service = module.get<ApiDataService>(ApiDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
