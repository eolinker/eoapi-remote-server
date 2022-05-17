import { Test, TestingModule } from '@nestjs/testing';
import { ApiDataController } from './apiData.controller';
import { ApiDataService } from './apiData.service';

describe('ProjectController', () => {
  let controller: ApiDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiDataController],
      providers: [ApiDataService],
    }).compile();

    controller = module.get<ApiDataController>(ApiDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
