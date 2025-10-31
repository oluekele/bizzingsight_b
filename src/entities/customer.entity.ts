import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { User } from './user.entity';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @Column({ unique: true })
  @IsEmail()
  @ApiProperty({ example: 'customer1@bizinsight360.com' })
  email: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 100 })
  loyaltyScore: number;

  @Column({ nullable: true })
  @ApiProperty({ example: 5 })
  purchaseFrequency: number;

  @OneToOne(() => User, (user) => user.customer)
  @ApiProperty({ type: () => User })
  user: User;
}
