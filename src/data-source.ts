import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Sale } from './entities/sale.entity';
import { Product } from './entities/product.entity';
import { Kpi } from './kpis/kpis.entity';
import { Customer } from './entities/customer.entity';

// Load .env file
dotenv.config();

// Ensure required env vars exist
const requiredEnvVars = [
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`,
  );
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Sale, Product, Kpi, Customer],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
  ssl: {
    rejectUnauthorized: false,
  },
});
