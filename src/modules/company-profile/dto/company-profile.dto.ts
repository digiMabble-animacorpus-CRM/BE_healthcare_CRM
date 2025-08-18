// src/modules/company-profile/dto/company-profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { CreateAddressDto } from 'src/modules/addresses/dto/create-address.dto';

export class CompanyProfileDto {
  @ApiProperty({ example: 'Real Estate Co.' })
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  @IsString()
  mobile_no: string;

  @ApiProperty({ example: 'https://realestate.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ example: 'TX12345678' })
  @IsOptional()
  @IsString()
  tax_id?: string;

  @ApiProperty({ example: 'data:image/png;base64,iVBORw0KGgo...' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty()
  @IsNotEmpty()
  address: CreateAddressDto;
}

export class UpdateCompanyProfileDto {
  @ApiProperty({ example: 'Real Estate Co.' })
  @IsOptional()
  @IsString()
  company_name: string;

  @ApiProperty({ example: '+1234567890' })
  @IsOptional()
  @IsString()
  mobile_no: string;

  @ApiProperty({ example: 'https://realestate.com' })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({ example: 'TX12345678' })
  @IsOptional()
  @IsString()
  tax_id?: string;

  @ApiProperty({ example: 'data:image/png;base64,iVBORw0KGgo...' })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({ type: CreateAddressDto, required: false })
  @IsOptional()
  address?: CreateAddressDto;
}
