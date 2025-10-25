import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { SeederService } from './seeder/seeder.service';
import { Kpi } from './kpis/kpis.entity';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { EmailModule } from './email/email.module';
import { redisStore } from 'cache-manager-ioredis-yet';
import { Module } from '@nestjs/common/decorators';
import { CacheModule } from '@nestjs/cache-manager';
import { KpisModule } from './kpis/kpis.module';
import { UsersModule } from './users/users.module';
import { CustomerModule } from './customer/customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: configService.get('REDIS_URL', 'redis://localhost:6379'),
        }),
        ttl: 60000, // Cache time-to-live in ms
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          type: 'postgres' as const,
          host: configService.get('DB_HOST', 'localhost'),
          port: +configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', 'Applying'),
          database: configService.get('DB_DATABASE', 'bizinsight360'),
          entities: [User, Product, Kpi],
          synchronize: true,
          logging: true,
        };

        return dbConfig;
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Product, Kpi]),
    AuthModule,
    ProductsModule,
    EmailModule,
    KpisModule,
    UsersModule,
    CustomerModule,
  ],
  providers: [SeederService],
})
export class AppModule {
  constructor(private seederService: SeederService) {
    seederService.seed();
  }
}
