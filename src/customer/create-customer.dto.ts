import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the customer' })
  @IsString()
  name: string;

  @ApiProperty({ example: 100, description: 'Customer loyalty score' })
  @IsInt()
  @Min(0)
  loyaltyScore: number;

  @ApiProperty({ example: 5, description: 'Number of purchases made by the customer' })
  @IsInt()
  @Min(0)
  purchaseFrequency: number;
}