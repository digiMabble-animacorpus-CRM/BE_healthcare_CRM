// src/modules/users/dto/update-company-profile.dto.ts
import {
  IsString,
  IsOptional,
  IsEmail,
  ValidateNested,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from 'src/modules/addresses/dto/create-address.dto';

export class UpdateCompanyProfileDto {
  @IsString()
  company_name: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;

  @IsOptional()
  @IsString()
  mobile_no?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl()
  website?: string;

  @IsOptional()
  @IsString()
  tax_id?: string;
}
