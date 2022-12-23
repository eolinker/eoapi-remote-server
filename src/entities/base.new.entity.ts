import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Generated,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import dayjs from 'dayjs';

export class BaseTimestampEntity {
  @ApiProperty({ type: Date, description: '创建时间' })
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'), {
    toPlainOnly: true,
  })
  @CreateDateColumn({
    type: 'datetime',
    nullable: false,
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date | null;

  @ApiProperty({ type: Date, description: '更新时间' })
  @UpdateDateColumn({
    type: 'datetime',
    name: 'updated_at',
    comment: '更新时间',
  })
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'), {
    toPlainOnly: true,
  })
  updatedAt: Date | null;

  @Exclude()
  @DeleteDateColumn({
    type: 'datetime',
    name: 'deleted_at',
    select: false,
    comment: '删除时间',
  })
  @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'), {
    toPlainOnly: true,
  })
  deletedAt: Date;
}

export class BaseGeneratedEntity extends BaseTimestampEntity {
  @ApiHideProperty()
  @Exclude()
  @PrimaryGeneratedColumn({ name: 'id', comment: '主键ID' })
  id: number;

  @ApiProperty({ type: String, description: 'uuid' })
  @Column({ comment: '业务 UUID' })
  @Generated('uuid')
  uuid: string;
}

export class BaseEntity extends BaseGeneratedEntity {
  @ApiProperty({ type: Number, description: '创建者' })
  @Column('bigint', { name: 'create_by', nullable: true, comment: '创建者' })
  createBy: number | null;

  @ApiProperty({ type: Number, description: '更新者' })
  @Column('bigint', { name: 'update_by', nullable: true, comment: '更新者' })
  updateBy: number | null;
}
