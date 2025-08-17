import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({ example: 101, description: 'Unique order identifier' })
  @IsNotEmpty()
  @IsNumber()
  order_id: number;

  @ApiProperty({ example: 1, description: 'Customer ID' })
  @IsNotEmpty()
  @IsNumber()
  customer_id: number;

  @ApiProperty({ example: 1, description: 'Property ID' })
  @IsNotEmpty()
  @IsNumber()
  property_id: number;

  @ApiProperty({ example: '2025-03-10', description: 'Purchase date in YYYY-MM-DD format' })
  @IsNotEmpty()
  @IsDateString()
  purchase_date: string;

  @ApiProperty({ example: 45842.00, description: 'Purchase amount' })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'EUR', description: 'Currency code' })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({ example: 'Paid', description: 'Payment status', enum: ['Pending', 'Paid', 'Failed'] })
  @IsOptional()
  @IsString()
  amount_status?: string;

}