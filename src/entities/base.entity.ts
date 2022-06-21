import { Column, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
export abstract class Base {
  @PrimaryGeneratedColumn()
  uuid: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Timestamp;

  @Column({ type: 'timestamp', nullable: true })
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
