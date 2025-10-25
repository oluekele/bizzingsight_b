import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Kpi } from '../kpis/kpis.entity';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Kpi)
    private kpiRepository: Repository<Kpi>,
  ) {}

  async seed() {
    await this.seedAdminUser();
    await this.seedProducts();
    await this.seedKpis();
  }

  private async seedAdminUser() {
    const adminExists = await this.userRepository.findOne({
      where: { email: 'admin@bizinsight360.com' },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const admin = this.userRepository.create({
        email: 'admin@bizinsight360.com',
        fullName: 'Admin User',
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
      await this.userRepository.save(admin);
      console.log('✅ Admin user seeded');
    }
  }

  private async seedProducts() {
    const existingProducts = await this.productRepository.count();
    if (existingProducts > 0) {
      console.log('ℹ️ Products already exist, skipping seeding.');
      return;
    }

    const productsData = [
      { name: 'Wireless Headphones', price: 129.99, stock: 50 },
      { name: 'Smart LED TV 55"', price: 799.99, stock: 20 },
      { name: 'Gaming Laptop', price: 1599.99, stock: 15 },
      { name: 'Bluetooth Speaker', price: 59.99, stock: 100 },
      { name: 'Smartphone Pro X', price: 999.99, stock: 30 },
      { name: 'Fitness Tracker Band', price: 49.99, stock: 80 },
      { name: '4K Action Camera', price: 249.99, stock: 25 },
      { name: 'Mechanical Keyboard', price: 109.99, stock: 60 },
      { name: 'Noise Cancelling Earbuds', price: 89.99, stock: 70 },
      { name: 'Portable Power Bank 20,000mAh', price: 39.99, stock: 120 },
    ];

    const products = this.productRepository.create(productsData);
    await this.productRepository.save(products);
    console.log(' Mock products seeded');
  }

  private async seedKpis() {
    const existingKpis = await this.kpiRepository.count();
    if (existingKpis > 0) {
      console.log('ℹ KPIs already exist, skipping seeding.');
      return;
    }

    const now = new Date();
    const kpisData = [
      { name: 'Monthly Revenue', value: 25000, date: now },
      { name: 'New Users', value: 450, date: now },
      { name: 'Active Subscriptions', value: 320, date: now },
      { name: 'Churn Rate', value: 4.5, date: now },
      { name: 'Customer Satisfaction', value: 88, date: now },
      { name: 'Orders Processed', value: 1500, date: now },
      { name: 'Refund Rate', value: 2.1, date: now },
      { name: 'Website Traffic', value: 18500, date: now },
      { name: 'Conversion Rate', value: 3.8, date: now },
      { name: 'Support Tickets Closed', value: 210, date: now },
    ];

    const kpis = this.kpiRepository.create(kpisData);
    await this.kpiRepository.save(kpis);
    console.log(' Mock KPIs seeded');
  }
}
