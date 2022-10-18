import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Repository, SelectQueryBuilder, UpdateResult } from 'typeorm';
import Page from '@/common/class/page.class';
import { IUser } from '@/common/decorators/user.decorator';

export abstract class PublicService<T> {
  // 定义mapper属性，由子类具体实现赋值
  constructor(
    readonly mapper: Repository<T>,
    private jwtService?: JwtService,
  ) {}

  /**
   * 构造查询条件的钩子函数
   * @param query
   */
  // abstract generateWhere(query: any, qb: SelectQueryBuilder<T>): void;

  // async page(query: any): Promise<Page<T>> {
  //   // 因为我需要的功能用mapper.find实现不了，所以采用createQueryBuilder
  //   let queryBuilder = this.mapper.createQueryBuilder('t');
  //   // 引用传递
  //   this.generateWhere(query, queryBuilder);

  //   const { pn, ps } = query;
  //   queryBuilder = queryBuilder.skip((pn - 1) * ps).take(ps);

  //   const [records, total] = await queryBuilder.getManyAndCount();
  //   return new Page(pn, ps, total, records);
  // }

  async single(id: number): Promise<T | null> {
    return await this.mapper.createQueryBuilder().where({ id }).getOne();
  }

  async saveOrUpdate(entity: T, request: Request): Promise<T> {
    const token = request.headers['authorization'] as string;
    // 添加审计字段
    const username = this.jwtService.verify<IUser>(token);
    // 合并对象到entity
    Object.assign(entity, { updateBy: username });
    !this.mapper.getId(entity) && Object.assign(entity, { createBy: username });
    return await this.mapper.save(entity);
  }

  // 批量删除
  // async delete(entity: { ids: [] }): Promise<UpdateResult> {
  //   const { ids, ...instance } = entity;
  //   // for循环 - 修改标记字段
  //   return await this.mapper.update(ids, instance as object);
  // }
}
