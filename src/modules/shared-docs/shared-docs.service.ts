import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SharedEntity } from '@/entities/shared.entity';

@Injectable()
export class SharedDocsService {
  constructor(
    @InjectRepository(SharedEntity)
    private readonly sharedEntityRepository: Repository<SharedEntity>,
  ) {}

  async createShared(projectID: number) {
    const shared = await this.findOneBy({ projectID });
    return shared ?? this.sharedEntityRepository.save({ projectID });
  }

  async deleteShared(uniqueID: string, projectID: number) {
    return this.sharedEntityRepository.delete({ projectID, uniqueID });
  }
  async getShared(projectID: number) {
    return this.sharedEntityRepository.findBy({ projectID });
  }

  async findOneBy(where: FindOptionsWhere<SharedEntity>) {
    return this.sharedEntityRepository.findOneBy(where);
  }
}
