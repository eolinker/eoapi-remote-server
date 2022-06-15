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
/**
 * Without name and description constructure
 */
export abstract class FictitiousBase {
  @PrimaryGeneratedColumn()
  uuid: number;

  @Column('timestamp')
  createdAt: Timestamp;

  @Column('timestamp')
  updatedAt: Timestamp;
}
