// import { ApiProperty } from '@nestjs/swagger';
// import {
//   IsArray,
//   IsBoolean,
//   IsDateString,
//   IsEmail,
//   IsEnum,
//   IsNotEmpty,
//   IsNumber,
//   IsObject,
//   IsOptional,
//   IsString,
//   Matches,
//   MinLength,
//   ValidateNested,
//   IsUrl,
//   IsInt,
//   IsDate,
// } from 'class-validator';
// import { Type } from 'class-transformer';
// import { CreateAddressDto } from 'src/modules/addresses/dto/create-address.dto';
// import { AccessLevel, Gender, Status } from '../entities/staff.entity';

// export class CertificationFileDto {
//   @ApiProperty()
//   @IsString()
//   path: string;

//   @ApiProperty({ required: false })
//   @IsOptional()
//   @IsString()
//   preview?: string;

//   @ApiProperty()
//   @IsString()
//   formattedSize: string;
// }

// export class AvailabilitySlotDto {
//   @ApiProperty({ example: 'Monday' })
//   @IsString()
//   day: string;

//   @ApiProperty({ example: '09:00' })
//   @IsString()
//   from: string;

//   @ApiProperty({ example: '14:00' })
//   @IsString()
//   to: string;
// }

// export class PermissionDto {
//   @ApiProperty({ example: 'create' })
//   @IsString()
//   action: string;

//   @ApiProperty({ example: 'patient' })
//   @IsString()
//   resource: string;

//   @ApiProperty({ example: true })
//   @IsBoolean()
//   enabled: boolean;
// }


// export class CreateStaffDto {
//   @ApiProperty({ required: false, example: 123 })
//   @IsOptional()
//   @IsInt()
//   idPro?: number;

//   @ApiProperty({ required: false, example: '2025-08-15T10:00:00Z', description: 'ISO 8601 start datetime' })
//   @IsOptional()
//   @Type(() => Date)
//   @IsDate()
//   appointmentStart?: Date;

//   @ApiProperty({ required: false, example: '2025-08-15T12:00:00Z', description: 'ISO 8601 end datetime' })
//   @IsOptional()
//   @Type(() => Date)
//   @IsDate()
//   appointmentEnd?: Date;

//   @ApiProperty({ required: false, example: 30, description: 'Alert time in minutes before appointment' })
//   @IsOptional()
//   @IsInt()
//   appointmentAlert?: number;

//   @ApiProperty({ required: false, example: 'John Doe' })
//   @IsOptional()
//   @IsString()
//   fullName?: string;

//   @ApiProperty({ required: false, example: 'Therapist' })
//   @IsOptional()
//   @IsString()
//   jobTitle?: string;

//   @ApiProperty({ required: false, example: 'Adults, Teens' })
//   @IsOptional()
//   @IsString()
//   targetAudience?: string;

//   @ApiProperty({ required: false, example: 'Psychotherapy' })
//   @IsOptional()
//   @IsString()
//   specialization1?: string;

//   @ApiProperty({ required: false, example: 'I provide individual therapy sessions.' })
//   @IsOptional()
//   @IsString()
//   aboutMe?: string;

//   @ApiProperty({ required: false, example: 'Consultations available Mon-Fri 10am-5pm' })
//   @IsOptional()
//   @IsString()
//   consultations?: string;

//   @ApiProperty({ required: false, example: '123 Main St, City' })
//   @IsOptional()
//   @IsString()
//   centerAddress?: string;

//   @ApiProperty({ required: false, example: 'center@example.com' })
//   @IsOptional()
//   @IsString()
//   centerEmail?: string;

//   @ApiProperty({ required: false, example: '+1234567890' })
//   @IsOptional()
//   @IsString()
//   centerPhoneNumber?: string;

//   @ApiProperty({ required: false, example: 'contact@example.com' })
//   @IsOptional()
//   @IsString()
//   contactEmail?: string;

//   @ApiProperty({ required: false, example: '+0987654321' })
//   @IsOptional()
//   @IsString()
//   contactPhone?: string;

//   @ApiProperty({ required: false, example: 'Mon-Fri 9am-5pm' })
//   @IsOptional()
//   @IsString()
//   schedule?: string;

//   @ApiProperty({ required: false, example: 'About the therapist...' })
//   @IsOptional()
//   @IsString()
//   about?: string;

//   @ApiProperty({ required: false, example: 'English, Spanish' })
//   @IsOptional()
//   @IsString()
//   spokenLanguages?: string;

//   @ApiProperty({ required: false, example: 'Cash, Card, Insurance' })
//   @IsOptional()
//   @IsString()
//   paymentMethods?: string;

//   @ApiProperty({ required: false, example: 'MA Psychology, PhD Counselling' })
//   @IsOptional()
//   @IsString()
//   degreesAndTraining?: string;

//   @ApiProperty({ required: false, example: 'Psychotherapy, CBT' })
//   @IsOptional()
//   @IsString()
//   specializations?: string;

//   @ApiProperty({ required: false, example: 'https://example.com' })
//   @IsOptional()
//   @IsString()
//   website?: string;

//   @ApiProperty({ required: false, example: 'FAQ content here' })
//   @IsOptional()
//   @IsString()
//   faq?: string;

//   @ApiProperty({ required: false, example: 'https://calendar.example.com' })
//   @IsOptional()
//   @IsString()
//   agendaLinks?: string;

//   @ApiProperty({ required: false, example: 'Imported value 1' })
//   @IsOptional()
//   @IsString()
//   importedTable2?: string;

//   @ApiProperty({ required: false, example: 'Field 27 value' })
//   @IsOptional()
//   @IsString()
//   field27?: string;

//   @ApiProperty({ required: false, example: 'Imported value 2' })
//   @IsOptional()
//   @IsString()
//   importedTable22?: string;

//   @ApiProperty({ required: false, example: 'Team Namur 1' })
//   @IsOptional()
//   @IsString()
//   teamNamur1?: string;

//   @ApiProperty({ required: false, example: 'Imported value 3' })
//   @IsOptional()
//   @IsString()
//   importedTable23?: string;

//   @ApiProperty({ required: false, example: 'Team Namur 2' })
//   @IsOptional()
//   @IsString()
//   teamNamur2?: string;

//   @ApiProperty({ required: false, example: 'Site information' })
//   @IsOptional()
//   @IsString()
//   sites?: string;

//   @ApiProperty({ required: false, example: 'Available Mon-Fri' })
//   @IsOptional()
//   @IsString()
//   availability?: string;

//   @ApiProperty({ required: false, example: 'Specialization 2' })
//   @IsOptional()
//   @IsString()
//   specialization2?: string;

//   @ApiProperty({ required: false, example: 'https://rosa-link.com' })
//   @IsOptional()
//   @IsString()
//   rosaLink?: string;

//   @ApiProperty({ required: false, example: 'https://google-agenda-link.com' })
//   @IsOptional()
//   @IsString()
//   googleAgendaLink?: string;

//   @ApiProperty({ required: false, example: 'https://photo.example.com/photo.jpg' })
//   @IsOptional()
//   @IsString()
//   photo?: string;

//   @ApiProperty({ required: false, example: 'Doe' })
//   @IsOptional()
//   @IsString()
//   lastName?: string;

//   @ApiProperty({ required: false, example: 'John' })
//   @IsOptional()
//   @IsString()
//   firstName?: string;
// }
