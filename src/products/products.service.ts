import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Injectable } from '@nestjs/common/decorators';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async create(product: Partial<Product>): Promise<Product> {
    return this.productRepo.save(product);
  }

  async update(id: string, product: Partial<Product>): Promise<Product> {
    await this.productRepo.update(id, product);
    return this.findOne(id);
  }

  async delete(id: string): Promise<void> {
    await this.productRepo.delete(id);
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id: Number(id) },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async saveBulk(products: Partial<Product>[]): Promise<void> {
    await this.productRepo.save(products);
  }
}
