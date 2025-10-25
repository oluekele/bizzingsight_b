import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  quantity: number;

  @Column('decimal')
  total: number;

  @Column()
  date: string;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;
}
