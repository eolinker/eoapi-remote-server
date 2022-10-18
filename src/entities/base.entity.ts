import { ApiProperty } from '@nestjs/swagger';
import {
  BeforeUpdate,
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

export abstract class OperatorBase extends TimestampBase {
  @Column({ update: false })
  @ApiProperty()
  createBy!: string;

  @Column()
  @ApiProperty()
  updateBy!: string;

  /**
   * 以下两个事件需要创建一个新的实例时才会执行
   * mapper.save(Object.assign(this.mapper.create(), entity)) -> 执行
   * mapper.save(entity)) -> 不执行
   * [实体监听器和订阅者](https://typeorm.bootcss.com/listeners-and-subscribers)
   */
  @BeforeUpdate()
  updateUpdateBy() {
    // console.log('before-update....');
  }
}

export abstract class FictitiousBase extends OperatorBase {
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
