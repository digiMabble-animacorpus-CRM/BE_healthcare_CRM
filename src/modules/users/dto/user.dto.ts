import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import {
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsEnum,
  IsString,
  IsDate,
  IsBoolean,
  IsNumberString,
  IsPhoneNumber,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHERS = 'Others',
}

export class UpdateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email_id: string;

  @ApiProperty()
  @IsNumberString()
  @IsPhoneNumber()
  @IsOptional()
  mobile_no: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  email_verified: boolean;

  @ApiProperty()
  @Transform(({ value }) => value ? new Date(value) : null)
  @IsDate()
  @IsOptional()
  dob: Date | null;

  @ApiProperty()
  @IsString()
  @IsOptional()
  profile_url: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  device_token: string;
  
  @ApiProperty()
  @IsArray()
  @IsOptional()
  preferences: string[];

  @ApiProperty()
  @IsOptional()
  @IsEnum(Gender, {
    message: 'gender must be either Male , Female or Others ',
  })
  gender: Gender;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}

export class GetBranchAndServiceSearch {
  @ApiProperty({ example: 'Some text' })
  @IsNotEmpty()
  @IsString()
  search_text: string;
}
