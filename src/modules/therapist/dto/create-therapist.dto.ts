import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsIn,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from 'src/modules/addresses/dto/create-address.dto';


class CertificationFileDto {
  @ApiProperty({ example: 'uploads/cert1.pdf' })
  @IsString()
  @IsNotEmpty()
  path: string;

  @ApiProperty({ example: 'https://example.com/cert1-preview.png', required: false })
  @IsOptional()
  @IsString()
  preview: string | null;

  @ApiProperty({ example: '1.5 MB' })
  @IsString()
  formattedSize: string;
}

class AvailabilityDto {
  @ApiProperty({ example: 'Monday' })
  @IsString()
  day: string;

  @ApiProperty({ example: '09:00' })
  @IsString()
  from: string;

  @ApiProperty({ example: '14:00' })
  @IsString()
  to: string;
}

export class CreateTherapistDto {
  @ApiProperty({ example: 'Alice Martin' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'alice@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+32123456789' })
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiProperty({ example: '1985-06-15' })
  @IsNotEmpty()
  @IsString()
  dob: string;

  @ApiProperty({ example: 'Specializes in cognitive therapy', required: false })
  @IsOptional()
  @IsString()
  description: string;

  
  @ApiProperty({ type: () => CreateAddressDto })
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;


  @ApiProperty({ example: 'Female' })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({ example: 'French' })
  @IsNotEmpty()
  @IsString()
  language: string;

  

 

  @ApiProperty({ example: 'Cognitive Behavioral Therapy' })
  @IsNotEmpty()
  @IsString()
  specialization: string;

  @ApiProperty({ example: '10 years' })
  @IsNotEmpty()
  @IsString()
  experience: string;

  @ApiProperty({ example: 'PhD in Psychology' })
  @IsNotEmpty()
  @IsString()
  education: string;

  @ApiProperty({
    type: [CertificationFileDto],
    required: false,
    description: 'List of uploaded certification files',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationFileDto)
  certificationFiles: CertificationFileDto[];

  @ApiProperty({ example: 'REG-2025-001' })
  @IsNotEmpty()
  @IsString()
  registrationNumber: string;

  @ApiProperty({ type: [AvailabilityDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto[];

  @ApiProperty({ example: ['stress', 'depression'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ enum: ['active', 'inactive'], example: 'active' })
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';

  @ApiProperty({ example: '2025-07-02T13:00:00Z' })
  @IsNotEmpty()
  @IsString()
  lastUpdated: string;

  @ApiProperty({ example: 'Instagram', required: false })
  @IsOptional()
  @IsString()
  source: string;

  @ApiProperty({
    enum: ['Gembloux - Orneau', 'Gembloux - Tout Vent', 'Anima Corpus Namur'],
    example: 'Gembloux - Orneau',
  })
  @IsIn(['Gembloux - Orneau', 'Gembloux - Tout Vent', 'Anima Corpus Namur'])
  branch: 'Gembloux - Orneau' | 'Gembloux - Tout Vent' | 'Anima Corpus Namur';
}
