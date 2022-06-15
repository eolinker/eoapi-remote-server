import { Test, TestingModule } from '@nestjs/testing';
import { MockController } from './mock.controller';
import { MockService } from './mock.service';

describe('MockController', () => {
  let controller: MockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MockController],
      providers: [MockService],
    }).compile();

    controller = module.get<MockController>(MockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
