// src/modules/properties/dto/create-property.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePropertyDto {
  @ApiProperty({ example: 'Luxury Villa' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })  // Changed to number example
  @IsNotEmpty()
  @IsNumber()  // Changed to IsNumber validator
  category: number;  // Changed to number type

  @ApiProperty({ example: 'Sale' })
  @IsNotEmpty()
  @IsString()
  listing_type: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @IsOptional()
  bedrooms: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsOptional()
  bathrooms: number;

  @ApiProperty({ example: 2500 })
  @IsNumber()
  @IsOptional()
  square_foot: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  floor: number;

  @ApiProperty({ example: 500000 })
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsOptional()
  address_id: number;

  @ApiProperty({ example: 'https://example.com/image.jpg' })
  @IsString()
  @IsOptional()
  image: string;

}
