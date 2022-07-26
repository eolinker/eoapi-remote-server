import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
export abstract class Base {
  @PrimaryGeneratedColumn()
  uuid: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
/**
 * Without name and description constructure
 */
export abstract class FictitiousBase {
  @PrimaryGeneratedColumn()
  uuid: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
