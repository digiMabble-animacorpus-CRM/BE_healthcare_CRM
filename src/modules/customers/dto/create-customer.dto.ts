import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength, IsNumber, IsUrl, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from 'src/modules/addresses/dto/create-address.dto';



export class CreateCustomerDto {
  @ApiProperty({ example: 'John Doe', description: 'Customer name (min 2 chars, letters and spaces only)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-Z\s]+$/, { message: 'customerName must contain only letters and spaces' })
  customer_name: string;

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
  phone_number: string;

  @ApiProperty({ example: 5, required: false })
  @IsOptional()
  @IsNumber()
  view_properties?: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsNumber()
  own_properties?: number;

  @ApiProperty({ example: 150000.50, required: false })
  @IsOptional()
  @IsNumber()
  invest_property?: number;

  @ApiProperty({ example: 'Active', enum: ['Active', 'Inactive', 'Prospect'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['Active', 'Inactive', 'Prospect'])
  status: string;

  @ApiProperty({ example: 'https://example.com/profile_url.png', required: false })
  @IsOptional()
  @IsString()
  customer_image_url?: string;


  @ApiProperty({ type: CreateAddressDto })
  @IsNotEmpty()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}