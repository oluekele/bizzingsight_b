import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { getConnection } from 'typeorm';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { Reflector } from '@nestjs/core';
import helmet from 'helmet';
import { version } from 'os';
import { Logger } from '@nestjs/common/services';
import { ValidationPipe } from '@nestjs/common/pipes';
// import { version } from '*/package.json';
// import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  let app: INestApplication;

  try {
    app = await NestFactory.create(AppModule);
  } catch (error: unknown) {
    logger.error(`Failed to create Nest application: ${String(error)}`);
    process.exit(1);
  }

  // Enable CORS with dynamic origins
  const configService = app.get(ConfigService);
  const frontendUrl: string = configService.get(
    'FRONTEND_URL',
    'http://localhost:3000',
  );
  const nodeEnv: string = configService.get('NODE_ENV', 'development');
  app.enableCors({
    origin: nodeEnv === 'production' ? frontendUrl : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Security headers with Helmet
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

  // Global pipes, guards, and filters
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.useGlobalFilters(new HttpExceptionFilter());
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('BizInsight360 API')
    .setDescription('API for BizInsight360 admin dashboard')
    // .setVersion(version || '1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Endpoint to export OpenAPI spec for Postman
  app.getHttpAdapter().get('/api-spec', (req, res) => {
    res.json(document);
  });

  // Root endpoint for API status
  app.getHttpAdapter().get('/', (req, res) => {
    res.json({
      message: 'BizInsight360 API is working',
      service: 'BizInsight360 API',
      version: version || '1.0.0',
      docs: '/api-docs',
      api: '/',
      environment: nodeEnv,
    });
  });

  // Health check endpoint
  app.getHttpAdapter().get('/health', async (req, res) => {
    let dbStatus = 'disconnected';
    try {
      const connection = await getConnection();
      dbStatus = connection.isConnected ? 'connected' : 'disconnected';
    } catch (error: unknown) {
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

  // Test database connection
  try {
    const connection = await getConnection();
    logger.log(
      `Database connected successfully: ${connection.options.database}`,
    );
  } catch (error: unknown) {
    logger.error(`Database connection failed: ${String(error)}`);
  }

  // Enable graceful shutdown
  app.enableShutdownHooks();

  // Start server with port conflict handling
  const port: number = configService.get('PORT', 3006);
  try {
    await app.listen(port, '0.0.0.0');
    logger.log(`🚀 BizInsight360 API is running on http://localhost:${port}`);
    logger.log(`📚 API Documentation: http://localhost:${port}/api-docs`);
    logger.log(`📥 API Spec for Postman: http://localhost:${port}/api-spec`);
    logger.log(`🩺 Health Check: http://localhost:${port}/health`);
    logger.log(`🌐 Environment: ${nodeEnv}`);
    logger.log(`⏰ Timezone: Africa/Lagos (WAT)`);
  } catch (error: unknown) {
    if (error instanceof Error && (error as any).code === 'EADDRINUSE') {
      logger.error(
        `Port ${port} is already in use. Please free the port or choose another.`,
      );
      process.exit(1);
    }
    logger.error(`Failed to start server: ${String(error)}`);
    process.exit(1);
  }
}

bootstrap();
