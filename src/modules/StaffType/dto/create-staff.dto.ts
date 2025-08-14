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
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from 'src/modules/addresses/dto/create-address.dto';
import { AccessLevel, Gender, Status } from '../entities/staff.entity'; // import enums from entity

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
  @ApiProperty({ example: 'John Smith' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: 'Name must contain only letters and spaces',
  })
  name: string;

  @ApiProperty({ example: '+1234567890' })
  @IsNotEmpty()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, {
    message: 'Please provide a valid phone number',
  })
  phoneNumber: string;

  @ApiProperty({ example: 'john.smith@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: Gender })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: ['english', 'french'], isArray: true })
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiProperty({ type: CreateAddressDto, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  address?: CreateAddressDto;

  @ApiProperty({ example: 'Experienced therapist', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '1985-06-15', required: false })
  @IsOptional()
  @IsDateString()
  dob?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  roleId: number;

  @ApiProperty({ enum: AccessLevel })
  @IsNotEmpty()
  @IsEnum(AccessLevel)
  accessLevel: string;

  
  @ApiProperty({ example: [1, 2] })
  @IsArray()
  @IsNumber({}, { each: true })
  branches: number[];

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  selectedBranch: number;

  @IsOptional()
@IsString()
@ApiProperty({ example: 'Main Branch', required: false })
selectedBranchName?: string;


  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  experience?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  registrationNumber?: string;

  @ApiProperty({ type: [CertificationFileDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CertificationFileDto)
  certificationFiles?: CertificationFileDto[];

  @ApiProperty({ type: [AvailabilitySlotDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AvailabilitySlotDto)
  availability?: AvailabilitySlotDto[];

  @ApiProperty({ example: ['stress', 'anxiety'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: Status.ACTIVE, enum: Status, required: false })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsArray()
  @ApiProperty({ type: [PermissionDto], required: false })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions?: PermissionDto[];

  @ApiProperty({
    required: false,
    example: {
      otpVerified: true,
      lastLogin: '2025-07-07T14:00:00Z',
      loginCount: 2,
    },
  })
  @IsOptional()
  @IsObject()
  loginDetails?: {
    otpVerified: boolean;
    lastLogin?: string;
    loginCount?: number;
    deviceInfo?: string;
  };

  @ApiProperty({ example: 101 })
  @IsOptional()
  @IsNumber()
  createdBy?: number;


  @IsOptional() @IsString() photo?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() jobTitle?: string;
  @IsOptional() @IsString() targetAudience?: string;
  @IsOptional() @IsString() specialization1?: string;
  @IsOptional() @IsString() consultations?: string;
  @IsOptional() @IsString() contactEmail?: string;
  @IsOptional() @IsString() contactPhone?: string;
  @IsOptional() @IsString() schedule?: string;
  @IsOptional() @IsString() about?: string;
  @IsOptional() @IsString() paymentMethods?: string;
  @IsOptional() @IsString() degreesAndTraining?: string;
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() faq?: string;
  @IsOptional() @IsString() agendaLinks?: string;
  @IsOptional() @IsString() importedTable2?: string;
  @IsOptional() @IsString() field27?: string;
  @IsOptional() @IsString() importedTable22?: string;
  @IsOptional() @IsString() teamNamur1?: string;
  @IsOptional() @IsString() importedTable23?: string;
  @IsOptional() @IsString() teamNamur2?: string;
  @IsOptional() @IsString() sites?: string;
  @IsOptional() @IsString() specialization2?: string;
  @IsOptional() @IsString() rosaLink?: string;
  @IsOptional() @IsString() googleAgendaLink?: string;
  @IsOptional() @IsString() appointmentStart?: string;
  @IsOptional() @IsString() appointmentEnd?: string;
  @IsOptional() @IsString() appointmentAlert?: string;

}
