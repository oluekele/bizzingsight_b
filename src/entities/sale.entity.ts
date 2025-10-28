import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column()
  @ApiProperty({ example: 1 })
  productId: number;

  @Column()
  @ApiProperty({ example: 5 })
  quantity: number;

  @Column('decimal')
  @ApiProperty({ example: 259.98 })
  total: number;

  @Column()
  @ApiProperty({ example: '2025-10-27T12:00:00Z' })
  date: string;

  @ManyToOne(() => Product, (product) => product.id)
  @ApiProperty({ type: () => Product })
  product: Product;

  @ManyToOne(() => User, (user) => user.sales)
  @ApiProperty({ type: () => User })
  user: User;
}
