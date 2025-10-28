import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { Sale } from '../entities/sale.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Public } from 'src/auth/public.decorator';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  // @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Create a new sale' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Sale created successfully',
    type: Sale,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product or user not found',
  })
  async create(@Body() createSaleDto: CreateSaleDto): Promise<Sale> {
    return this.salesService.create(createSaleDto);
  }

  @Get()
  @Public()
  // @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get all sales' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of sales',
    type: [Sale],
  })
  async findAll(): Promise<Sale[]> {
    return this.salesService.findAll();
  }

  @Get(':id')
  @Public()
  // @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get a sale by ID' })
  @ApiParam({ name: 'id', description: 'Sale ID', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'Sale found', type: Sale })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Sale not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Sale> {
    return this.salesService.findOne(id);
  }
}
