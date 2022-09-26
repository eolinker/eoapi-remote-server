import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';

@Entity({ name: 'auth' })
export class AuthEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public accessToken: string;

  @Column({ type: 'varchar' })
  public refreshToken: string;

  @Column({ type: 'bigint' })
  public refreshTokenExpiresAt: number;

  @JoinColumn()
  @ManyToOne((_type) => UserEntity)
  public user: UserEntity;

  @Column({ type: 'int' })
  public userId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
