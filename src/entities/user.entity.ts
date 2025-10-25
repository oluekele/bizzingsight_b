import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ unique: true })
  @IsEmail()
  @ApiProperty({ example: 'admin@bizinsight360.com' })
  email: string;

  @Column({ nullable: true })
  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @Column()
  @MinLength(6)
  @ApiProperty({ example: 'password123' })
  password: string;

  @Column({ nullable: true, type: 'varchar', default: null })
  @ApiProperty({ example: 'hashed-refresh-token' })
  refreshToken: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN })
  role: UserRole;

  @Column({ nullable: true, type: 'varchar', default: null })
  @ApiProperty({ example: 'hashed-reset-token' })
  resetToken: string | null;

  @Column({ nullable: true, type: 'timestamp', default: null })
  @ApiProperty({ example: '2025-10-21T22:39:00.000Z' })
  resetTokenExpires: Date | null;
}
