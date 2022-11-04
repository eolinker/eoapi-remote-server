import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SharedEntity } from '@/entities/shared.entity';
import { Project } from '@/entities/project.entity';

@Injectable()
export class SharedService {
  constructor(
    @InjectRepository(SharedEntity)
    private readonly sharedEntityRepository: Repository<SharedEntity>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async createShared(projectID: number) {
    const project = await this.projectRepository.findOneBy({
      uuid: projectID,
    });
    const shared = await this.findOneBy({ projectID });
    return shared ?? this.sharedEntityRepository.save({ projectID, project });
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
