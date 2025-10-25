import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { ProductsService } from './products.service';
import { Product } from '../entities/product.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products' })
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product (admin only)' })
  @ApiBody({ type: Product })
  @ApiResponse({ status: 201, description: 'Product created' })
  create(@Body() product: Partial<Product>): Promise<Product> {
    return this.productsService.create(product);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product (admin only)' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  update(
    @Param('id') id: string,
    @Body() product: Partial<Product>,
  ): Promise<Product> {
    return this.productsService.update(id, product);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.productsService.delete(id);
  }

  @Post('bulk')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk create products (admin only)' })
  @ApiBody({ type: [Product] })
  @ApiResponse({ status: 201, description: 'Products created' })
  async bulkCreate(
    @Body() products: Partial<Product>[],
  ): Promise<{ success: boolean }> {
    await this.productsService.saveBulk(products);
    return { success: true };
  }
}
