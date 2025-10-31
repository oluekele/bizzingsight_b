import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Sale } from 'src/entities/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Product, User])],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService], // Export TypeOrmModule for SaleRepository
})
export class SalesModule {}
