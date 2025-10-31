import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { Product } from '../entities/product.entity';
import { Kpi } from '../kpis/kpis.entity';
import { Sale } from '../entities/sale.entity';
import { Customer } from '../entities/customer.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeederService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Kpi)
    private kpiRepository: Repository<Kpi>,
    @InjectRepository(Sale)
    private saleRepository: Repository<Sale>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async seed() {
    await this.seedAdminUser();
    await this.seedCustomers();
    await this.seedProducts();
    await this.seedSales();
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

  private async seedCustomers() {
    const existingCustomers = await this.customerRepository.count();
    if (existingCustomers > 0) {
      console.log('ℹ️ Customers already exist, skipping seeding.');
      return;
    }

    const users = await this.userRepository.find({
      where: { role: UserRole.USER },
    });

    if (!users.length) {
      const userData = [
        {
          email: 'customer1@bizinsight360.com',
          fullName: 'John Doe',
          password: await bcrypt.hash('customer123', 10),
          role: UserRole.USER,
        },
        {
          email: 'customer2@bizinsight360.com',
          fullName: 'Jane Smith',
          password: await bcrypt.hash('customer123', 10),
          role: UserRole.USER,
        },
      ];
      const newUsers = this.userRepository.create(userData);
      await this.userRepository.save(newUsers);
      users.push(...newUsers);
      console.log('✅ User customers seeded');
    }

    const customersData = [
      {
        name: 'John Doe',
        email: 'customer1@bizinsight360.com',
        loyaltyScore: 100,
        purchaseFrequency: 5,
        user: users.find((u) => u.email === 'customer1@bizinsight360.com'),
      },
      {
        name: 'Jane Smith',
        email: 'customer2@bizinsight360.com',
        loyaltyScore: 150,
        purchaseFrequency: 8,
        user: users.find((u) => u.email === 'customer2@bizinsight360.com'),
      },
    ];

    const customers = this.customerRepository.create(customersData);
    await this.customerRepository.save(customers);
    console.log('✅ Customers seeded');
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
    console.log('✅ Mock products seeded');
  }

  private async seedSales() {
    const existingSales = await this.saleRepository.count();
    if (existingSales > 0) {
      console.log('ℹ️ Sales already exist, skipping seeding.');
      return;
    }

    const products = await this.productRepository.find();
    const customers = await this.userRepository.find({
      where: { role: UserRole.USER },
    });

    if (products.length < 5 || customers.length < 2) {
      console.log('⚠️ Not enough products or customers to seed sales.');
      return;
    }

    const salesData = [
      {
        productId: products[0].id,
        quantity: 2,
        total: products[0].price * 2,
        date: '2025-10-27T10:00:00Z',
        user: customers[0],
        product: products[0],
      },
      {
        productId: products[1].id,
        quantity: 1,
        total: products[1].price * 1,
        date: '2025-10-27T12:00:00Z',
        user: customers[0],
        product: products[1],
      },
      {
        productId: products[2].id,
        quantity: 1,
        total: products[2].price * 1,
        date: '2025-10-26T15:00:00Z',
        user: customers[1],
        product: products[2],
      },
      {
        productId: products[3].id,
        quantity: 5,
        total: products[3].price * 5,
        date: '2025-10-26T09:00:00Z',
        user: customers[1],
        product: products[3],
      },
      {
        productId: products[4].id,
        quantity: 1,
        total: products[4].price * 1,
        date: '2025-10-25T11:00:00Z',
        user: customers[0],
        product: products[4],
      },
    ];

    const sales = this.saleRepository.create(salesData);
    for (const sale of sales) {
      const product = products.find((p) => p.id === sale.productId);
      if (product) {
        product.stock -= sale.quantity;
        await this.productRepository.save(product);
      }
    }

    await this.saleRepository.save(sales);
    console.log('✅ Mock sales seeded');
  }

  private async seedKpis() {
    const existingKpis = await this.kpiRepository.count();
    if (existingKpis > 0) {
      console.log('ℹ️ KPIs already exist, skipping seeding.');
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
    console.log('✅ Mock KPIs seeded');
  }
}
