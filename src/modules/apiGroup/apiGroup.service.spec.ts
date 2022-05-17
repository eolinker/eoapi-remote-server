import { Test, TestingModule } from '@nestjs/testing';
import { ApiGroupService } from './apiGroup.service';

describe('ApiGroupService', () => {
  let service: ApiGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiGroupService],
    }).compile();

    service = module.get<ApiGroupService>(ApiGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
