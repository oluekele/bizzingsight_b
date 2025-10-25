import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { KpisService } from './kpis.service';
import { Kpi } from './kpis.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/entities/user.entity';
import { Controller, Get, UseGuards } from '@nestjs/common/decorators';

@ApiTags('kpis')
@Controller('kpis')
export class KpisController {
  constructor(private kpisService: KpisService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  async getKpis(): Promise<Kpi[]> {
    return this.kpisService.getKpis();
  }
}
