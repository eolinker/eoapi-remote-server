import { Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

export abstract class Base {
  @PrimaryGeneratedColumn()
  uuid: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('timestamp')
  createdAt: Timestamp;

  @Column('timestamp')
  updatedAt: Timestamp;
}
