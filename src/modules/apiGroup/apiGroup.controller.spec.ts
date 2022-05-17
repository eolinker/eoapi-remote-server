import { Test, TestingModule } from '@nestjs/testing';
import { ApiGroupController } from './apiGroup.controller';
import { ApiGroupService } from './apiGroup.service';

describe('ApiGroupController', () => {
  let controller: ApiGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiGroupController],
      providers: [ApiGroupService],
    }).compile();

    controller = module.get<ApiGroupController>(ApiGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
