import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsNumber,
  Matches,
  MaxLength,
  IsPositive,
  IsInt,
  IsBoolean
} from 'class-validator';
import { LeadSource, LeadStatus } from '../entities/lead.entity';

export class CreateLeadDto {
  @ApiProperty({
    example: LeadSource.WEBSITE,
    enum: LeadSource,
    description: 'Source of the lead'
  })
  @IsNotEmpty({ message: 'Select a lead source.' })
  @IsEnum(LeadSource, { message: 'Select a lead source.' })
  lead_source: LeadSource;

  @ApiProperty({
    example: LeadStatus.NEW,
    enum: LeadStatus,
    description: 'Current status of the lead'
  })
  @IsNotEmpty({ message: 'Select the current status of the lead.' })
  @IsEnum(LeadStatus, { message: 'Select the current status of the lead.' })
  lead_status: LeadStatus;

  @ApiProperty({ example: 1, description: 'ID of existing customer from customers table' })
  @IsNotEmpty({ message: 'Select a customer.' })
  @IsInt({ message: 'Customer ID must be a valid integer.' })
  @IsPositive({ message: 'Customer ID must be a positive number.' })
  customer_id: number;

  @ApiProperty({ example: 1, description: 'ID of the property from properties table' })
  @IsNotEmpty({ message: 'Select a property of interest.' })
  @IsInt({ message: 'Property ID must be a valid integer.' })
  @IsPositive({ message: 'Property ID must be a positive number.' })
  interested_property_id: number;

  @ApiProperty({ example: 500000, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Enter a valid budget.' })
  @IsPositive({ message: 'Enter a valid budget.' })
  budget_range?: number;

  @ApiProperty({ example: '14:30', required: false })
  @IsOptional()
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: 'Enter a valid contact time.' })
  preferred_contact_time?: string;

  @ApiProperty({ example: 'Customer is interested in waterfront properties', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Notes should be under 500 characters.' })
  notes?: string;

  @ApiProperty({ example: '2024-06-09' })
  @IsNotEmpty({ message: 'Date of inquiry is required.' })
  @IsDateString({}, { message: 'Enter a valid date.' })
  date_of_inquiry: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean = true;
}
