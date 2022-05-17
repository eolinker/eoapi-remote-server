import { Test, TestingModule } from '@nestjs/testing';
import { ApiTestHistoryController } from './apiTestHistory.controller';
import { ApiTestHistoryService } from './apiTestHistory.service';

describe('ProjectController', () => {
  let controller: ApiTestHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiTestHistoryController],
      providers: [ApiTestHistoryService],
    }).compile();

    controller = module.get<ApiTestHistoryController>(ApiTestHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
