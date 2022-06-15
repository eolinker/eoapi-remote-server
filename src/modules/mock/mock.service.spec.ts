
import { Test, TestingModule } from '@nestjs/testing';
import { MockService } from './mock.service';

describe('MockService', () => {
  let service: MockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MockService],
    }).compile();

    service = module.get<MockService>(MockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
