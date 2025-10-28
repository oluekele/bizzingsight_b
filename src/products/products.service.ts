import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { NotFoundException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepo.find();
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create(createProductDto);
    return this.productRepo.save(product);
  }

  async update(
    id: string,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, createProductDto);
    return this.productRepo.save(product);
  }

  async delete(id: string): Promise<void> {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
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

  async saveBulk(createProductDtos: CreateProductDto[]): Promise<void> {
    const products = this.productRepo.create(createProductDtos);
    await this.productRepo.save(products);
  }
}
