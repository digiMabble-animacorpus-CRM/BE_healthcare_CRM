import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  ValidateNested,
  IsUrl,
  IsInt,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from 'src/modules/addresses/dto/create-address.dto';
import { AccessLevel, Gender, Status } from '../entities/staff.entity';

export class CertificationFileDto {
  @ApiProperty()
  @IsString()
  path: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  preview?: string;

  @ApiProperty()
  @IsString()
  formattedSize: string;
}

export class AvailabilitySlotDto {
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

export class PermissionDto {
  @ApiProperty({ example: 'create' })
  @IsString()
  action: string;

  @ApiProperty({ example: 'patient' })
  @IsString()
  resource: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  enabled: boolean;
}

export class CreateStaffDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  _key: number;

  @ApiProperty({ required: false, example: 123 })
  @IsOptional()
  @IsInt()
  id_pro?: number;

  @ApiProperty({
    required: false,
    example: '2025-08-15T10:00:00Z',
    description: 'ISO 8601 start datetime',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  appointment_start?: Date;

  @ApiProperty({
    required: false,
    example: '2025-08-15T12:00:00Z',
    description: 'ISO 8601 end datetime',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  appointment_end?: Date;

  @ApiProperty({
    required: false,
    example: 30,
    description: 'Alert time in minutes before appointment',
  })
  @IsOptional()
  @IsInt()
  appointment_alert?: number;

  @ApiProperty({ required: false, example: 'John Doe' })
  @IsOptional()
  @IsString()
  full_name?: string;

  @ApiProperty({ required: false, example: 'Therapist' })
  @IsOptional()
  @IsString()
  job_title?: string;

  @ApiProperty({ required: false, example: 'Adults, Teens' })
  @IsOptional()
  @IsString()
  target_audience?: string;

  @ApiProperty({ required: false, example: 'Psychotherapy' })
  @IsOptional()
  @IsString()
  specialization_1?: string;

  @ApiProperty({ required: false, example: 'I provide individual therapy sessions.' })
  @IsOptional()
  @IsString()
  about_me?: string;

  @ApiProperty({ required: false, example: 'Consultations available Mon-Fri 10am-5pm' })
  @IsOptional()
  @IsString()
  consultations?: string;

  @ApiProperty({ required: false, example: '123 Main St, City' })
  @IsOptional()
  @IsString()
  center_address?: string;

  @ApiProperty({ required: false, example: 'center@example.com' })
  @IsOptional()
  @IsString()
  center_email?: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  center_phone_number?: string;

  @ApiProperty({ required: false, example: 'contact@example.com' })
  @IsOptional()
  @IsString()
  contact_email?: string;

  @ApiProperty({ required: false, example: '+0987654321' })
  @IsOptional()
  @IsString()
  contact_phone?: string;

  @ApiProperty({ required: false, example: 'Mon-Fri 9am-5pm' })
  @IsOptional()
  @IsString()
  schedule?: string;

  @ApiProperty({ required: false, example: 'About the therapist...' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiProperty({ required: false, example: 'English, Spanish' })
  @IsOptional()
  @IsString()
  spoken_languages?: string;

  @ApiProperty({ required: false, example: 'Cash, Card, Insurance' })
  @IsOptional()
  @IsString()
  payment_methods?: string;

  @ApiProperty({ required: false, example: 'MA Psychology, PhD Counselling' })
  @IsOptional()
  @IsString()
  degrees_and_training?: string;

  @ApiProperty({ required: false, example: 'Psychotherapy, CBT' })
  @IsOptional()
  @IsString()
  specializations?: string;

  @ApiProperty({ required: false, example: 'https://example.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiProperty({ required: false, example: 'FAQ content here' })
  @IsOptional()
  @IsString()
  faq?: string;

  @ApiProperty({ required: false, example: 'https://calendar.example.com' })
  @IsOptional()
  @IsString()
  agenda_links?: string;

  @ApiProperty({ required: false, example: 'Imported value 1' })
  @IsOptional()
  @IsString()
  imported_table_2?: string;

  @ApiProperty({ required: false, example: 'Field 27 value' })
  @IsOptional()
  @IsString()
  field_27?: string;

  @ApiProperty({ required: false, example: 'Imported value 2' })
  @IsOptional()
  @IsString()
  imported_table_2_2?: string;

  @ApiProperty({ required: false, example: 'Team Namur 1' })
  @IsOptional()
  @IsString()
  team_namur_1?: string;

  @ApiProperty({ required: false, example: 'Imported value 3' })
  @IsOptional()
  @IsString()
  imported_table_2_3?: string;

  @ApiProperty({ required: false, example: 'Team Namur 2' })
  @IsOptional()
  @IsString()
  team_namur_2?: string;

  @ApiProperty({ required: false, example: 'Site information' })
  @IsOptional()
  @IsString()
  sites?: string;

  @ApiProperty({ required: false, example: 'Available Mon-Fri' })
  @IsOptional()
  @IsString()
  availability?: string;

  @ApiProperty({ required: false, example: 'Specialization 2' })
  @IsOptional()
  @IsString()
  specialization_2?: string;

  @ApiProperty({ required: false, example: 'https://rosa-link.com' })
  @IsOptional()
  @IsString()
  rosa_link?: string;

  @ApiProperty({ required: false, example: 'https://google-agenda-link.com' })
  @IsOptional()
  @IsString()
  google_agenda_link?: string;

  @ApiProperty({ required: false, example: 'https://photo.example.com/photo.jpg' })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ required: false, example: 'Doe' })
  @IsOptional()
  @IsString()
  last_name?: string;

  @ApiProperty({ required: false, example: 'John' })
  @IsOptional()
  @IsString()
  first_name?: string;
}
