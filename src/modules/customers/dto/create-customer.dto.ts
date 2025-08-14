import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  IsNumber,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from 'src/modules/addresses/dto/create-address.dto';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John Doe', description: 'Customer name (min 2 chars, letters and spaces only)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-Z\s]+$/, { message: 'customerName must contain only letters and spaces' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Please provide a valid phone number',
  })
  number: string;

    @ApiProperty({ example: 'Customer description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

    @ApiProperty({ example: '123 Main Street', required: false })
  @IsOptional()
  @IsString()
  address?: string;

    @ApiProperty({ example: '10001', required: false })
  @IsOptional()
  @IsString()
  zipCode?: string;

   @ApiProperty({ example: 'New York', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'USA', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'Male', required: false })
  @IsOptional()
  @IsString()
  gender?: string;


    @ApiProperty({ example: 'English', required: false })
  @IsOptional()
  @IsString()
  language?: string;

   @ApiProperty({ example: ['tag1', 'tag2'], required: false, type: [String] })
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];

  
  @ApiProperty({ example: 'new', enum: ['new', 'old'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['new', 'old'])
  status?: 'new' | 'old';

   @ApiProperty({ example: '2025-08-14T12:00:00Z', required: false })
  @IsOptional()
  lastUpdated?: string;

  @ApiProperty({ example: 'https://example.com/profile_url.png', required: false })
  @IsOptional()
  @IsString()
  customer_image_url?: string;

  @ApiProperty({ example: 'Main Branch', required: false })
  @IsOptional()
  @IsString()
  branch?: string;

   @ApiProperty({ example: '1990-05-15', required: false })
  @IsOptional()
  dob?: Date;

    @ApiProperty({ example: 'Instagram', required: false })
  @IsOptional()
  @IsString()
  source?: string;



  // @ApiProperty({ example: 5, required: false })
  // @IsOptional()
  // @IsNumber()
  // view_properties?: number;

  // @ApiProperty({ example: 2, required: false })
  // @IsOptional()
  // @IsNumber()
  // own_properties?: number;

  // @ApiProperty({ example: 150000.50, required: false })
  // @IsOptional()
  // @IsNumber()
  // invest_property?: number;


}
