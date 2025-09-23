import {
  IsString,
  IsOptional,
  IsEmail,
  IsArray,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MemberRole, MemberStatus } from '../entities/therapist-team.entity';
import { Type } from 'class-transformer';

export class AvailabilityDto {
  @ApiProperty({ example: 'Monday' })
  @IsString()
  day: string;

  @ApiProperty({ example: '09:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '17:00' })
  @IsString()
  endTime: string;
}

export class CreateTherapistMemberDto {
  @ApiProperty({ example: 'Alice' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Smith' })
  @IsString()
  lastName: string;


    @ApiPropertyOptional({ example: 'Alice Smith', description: 'Full name of the team member' })
    @IsOptional()
    @IsString()
    full_name?: string;

  @ApiPropertyOptional({ example: 'https://example.com/photo.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 'alice@example.com' })
  @IsEmail()
  contactEmail: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  contactPhone: string;

  @ApiPropertyOptional({ example: 'Experienced therapist specializing in pediatric therapy.' })
  @IsOptional()
  @IsString()
  aboutMe?: string;

  @ApiPropertyOptional({ example: 'PhD in Psychology ,MSc in Neuropsychology' })
  @IsOptional()
  @IsString({ each: true })
  degreesTraining?: string;

  @ApiPropertyOptional({ example: 123456 })
  @IsOptional()
  @IsNumber()
  inamiNumber?: number;

  @ApiPropertyOptional({ example: ['Cash', 'Card', 'Insurance'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  payment_methods?: string[];

 @ApiPropertyOptional({ example: ["Answer 1", "Answer 2", "Answer 3"] })
@IsOptional()
@IsArray()
@IsString({ each: true })
faq?: string[];


  @ApiPropertyOptional({ example: 'https://therapist-website.com' })
  @IsOptional()
  @IsString()
  website?: string;

  @ApiPropertyOptional({ example: 'Consultations available on Monday and Wednesday.' })
  @IsOptional()
  @IsString()
  consultations?: string;

  @ApiPropertyOptional({ example: { admin: true } })
  @IsOptional()
  @IsObject()
  permissions?: Record<string, any>;

  @ApiPropertyOptional({ enum: MemberRole, example: MemberRole.STAFF })
  @IsOptional()
  @IsEnum(MemberRole)
  role?: MemberRole;

  @ApiPropertyOptional({ enum: MemberStatus, example: MemberStatus.ACTIVE })
  @IsOptional()
  @IsEnum(MemberStatus)
  status?: MemberStatus;

  @ApiPropertyOptional({
    type: [AvailabilityDto],
    example: [{ day: 'Monday', startTime: '09:00', endTime: '17:00' }],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  availability?: AvailabilityDto[];

  @ApiPropertyOptional({ example: ['English', 'French'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languagesSpoken?: string[];

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isDelete?: boolean;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  departmentId?: number;

  @ApiPropertyOptional({ example: [1, 2] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  specializationIds?: number[];

  @ApiPropertyOptional({ example: [1, 2] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  branchIds?: number[];
}
