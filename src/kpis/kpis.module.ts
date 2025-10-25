import { TypeOrmModule } from '@nestjs/typeorm';
import { KpisService } from './kpis.service';
import { KpisController } from './kpis.controller';
import { Kpi } from './kpis.entity';
import { Module } from '@nestjs/common/decorators';

@Module({
  imports: [TypeOrmModule.forFeature([Kpi])],
  providers: [KpisService],
  controllers: [KpisController],
})
export class KpisModule {}
