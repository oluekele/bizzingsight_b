import { IsString, IsInt, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Wireless Headphones',
    description: 'Name of the product',
  })
  @IsString()
  name: string;

  @ApiProperty({ example: 50, description: 'Available stock quantity' })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({ example: 129.99, description: 'Price of the product' })
  @IsNumber()
  @Min(0)
  price: number;
}
