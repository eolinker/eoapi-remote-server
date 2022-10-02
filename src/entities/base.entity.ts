import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
/**
 * Without name and description constructure
 */

export abstract class TimestampBase {
  @CreateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @ApiProperty()
  updatedAt: Date;
}

export abstract class FictitiousBase extends TimestampBase {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  uuid: number;
}

export abstract class Base extends FictitiousBase {
  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true })
  @ApiProperty()
  description: string;
}
