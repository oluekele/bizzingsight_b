import { IsInt, IsPositive, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSaleDto {
  @ApiProperty({ description: 'ID of the product being sold', example: 1 })
  @IsInt()
  @IsPositive()
  productId: number;

  @ApiProperty({ description: 'Quantity of the product sold', example: 5 })
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiProperty({
    description: 'Date of the sale',
    example: '2025-10-27T12:00:00Z',
    required: false,
  })
  @IsString()
  @IsOptional()
  date?: string;

  @ApiProperty({
    description: 'ID of the user (customer) making the purchase',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  userId: number;
}
