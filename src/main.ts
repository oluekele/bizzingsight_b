import { NestFactory } from '@nestjs/core';
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import { version } from 'os'; // optional — replace with package.json version if needed

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  let app: INestApplication;

  try {
    app = await NestFactory.create(AppModule);
  } catch (error) {
    logger.error(`Failed to create Nest application: ${String(error)}`);
    process.exit(1);
  }

  // Config service
  const configService = app.get(ConfigService);
  const frontendUrl = configService.get(
    'FRONTEND_URL',
    'http://localhost:3000',
  );
  const nodeEnv = configService.get('NODE_ENV', 'development');

  // Enable CORS
  app.enableCors({
    origin:
      nodeEnv === 'production'
        ? frontendUrl
        : nodeEnv === 'development'
          ? 'http://localhost:3000'
          : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", frontendUrl],
        },
      },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  // Global validation, guards
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('BizInsight360 API')
    .setDescription('API for BizInsight360 admin dashboard')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  // OpenAPI JSON export
  app.getHttpAdapter().get('/api-spec', (req, res) => {
    res.json(document);
  });

  // Root route
  app.getHttpAdapter().get('/', (req, res) => {
    res.json({
      message: 'BizInsight360 API is working',
      service: 'BizInsight360 API',
      version: version || '1.0.0',
      docs: '/api-docs',
      environment: nodeEnv,
    });
  });

  // Health check endpoint using DataSource
  app.getHttpAdapter().get('/health', async (req, res) => {
    let dbStatus = 'disconnected';
    try {
      const dataSource = app.get(DataSource);
      dbStatus = dataSource.isInitialized ? 'connected' : 'disconnected';
    } catch (error) {
      logger.error(
        `Health check: Database connection failed: ${String(error)}`,
      );
    }

    res.json({
      status: 'ok',
      service: 'BizInsight360 API',
      database: dbStatus,
      timestamp: new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Lagos',
      }),
    });
  });

  // Test database connection (on startup)
  try {
    const dataSource = app.get(DataSource);
    if (dataSource.isInitialized) {
      logger.log(
        `✅ Database connected successfully: ${dataSource.options.database}`,
      );
    } else {
      logger.error('❌ Database connection not initialized.');
    }
  } catch (error) {
    logger.error(`Database connection failed: ${String(error)}`);
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  // Start server
  const port = configService.get('PORT', 3006);
  try {
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 BizInsight360 API running on http://localhost:${port}`);
    logger.log(`📚 API Docs: http://localhost:${port}/api-docs`);
    logger.log(`📥 OpenAPI Spec: http://localhost:${port}/api-spec`);
    logger.log(`🩺 Health: http://localhost:${port}/health`);
    logger.log(`🌐 Environment: ${nodeEnv}`);
    logger.log(`⏰ Timezone: Africa/Lagos (WAT)`);
  } catch (error) {
    if (error instanceof Error && (error as any).code === 'EADDRINUSE') {
      logger.error(
        `Port ${port} is already in use. Please free the port or use another.`,
      );
      process.exit(1);
    }
    logger.error(`Failed to start server: ${String(error)}`);
    process.exit(1);
  }
}

bootstrap();
