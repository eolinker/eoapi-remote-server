import { Test, TestingModule } from '@nestjs/testing';
import { ApiTestHistoryService } from './apiTestHistory.service';

describe('ApiTestHistoryService', () => {
  let service: ApiTestHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiTestHistoryService],
    }).compile();

    service = module.get<ApiTestHistoryService>(ApiTestHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
