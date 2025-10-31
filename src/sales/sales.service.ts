import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const { productId, quantity, date, userId }: CreateSaleDto = createSaleDto;

    // Find product and validate
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Find user and validate
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Validate stock
    if (product.stock < quantity) {
      throw new NotFoundException(
        `Insufficient stock for product ${product.name}`,
      );
    }

    // Calculate total and update stock
    const total = product.price * quantity;
    product.stock -= quantity;
    await this.productRepository.save(product);

    // Create sale entity
    const sale = this.saleRepository.create({
      productId,
      quantity,
      total,
      date: date || new Date().toISOString(),
    } as Sale);

    // Assign relations
    sale.product = product;
    sale.user = user;

    return this.saleRepository.save(sale);
  }

  async findAll(): Promise<Sale[]> {
    return this.saleRepository.find({ relations: ['product', 'user'] });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.saleRepository.findOne({
      where: { id },
      relations: ['product', 'user'],
    });
    if (!sale) {
      throw new NotFoundException(`Sale with ID ${id} not found`);
    }
    return sale;
  }
}
