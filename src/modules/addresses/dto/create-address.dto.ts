import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({
    example: '123 Main Street',
    description: 'The street address',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  street: string;

  @ApiProperty({
    example: 'New York',
    description: 'The city name',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    example: 'NY',
    description: 'The state name',
    required: false
  })
  @IsOptional()
  @IsString()
  state: string;

  @ApiProperty({
    example: '10001',
    description: 'The postal/zip code',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  zip_code: string;

  @ApiProperty({
    example: 'USA',
    description: 'The country name',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  country: string;
}
