import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from '../entities/customer.entity';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  findAll(): Promise<Customer[]> {
    return this.customerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.customerService.findOne(+id);
  }

  @Post()
  create(@Body() data: Partial<Customer>): Promise<Customer> {
    return this.customerService.create(data);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() data: Partial<Customer>,
  ): Promise<Customer> {
    return this.customerService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.customerService.remove(+id);
  }
}
