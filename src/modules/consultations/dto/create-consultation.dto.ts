import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsOptional, IsNumber } from 'class-validator';

export class CreateConsultationDto {
  @ApiProperty({ example: 'General Check-up' })
  @IsString()
  @IsOptional()
  our_consultations?: string;

  @ApiProperty({ example: 'A comprehensive general health check-up.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Adults and Children' })
  @IsString()
  @IsOptional()
  for_whom?: string;

  @ApiProperty({ example: 'Initial assessment, followed by tests if required.' })
  @IsString()
  @IsOptional()
  care_process?: string;

  @ApiProperty({ example: 'Fee: $100. Insurance coverage may apply.' })
  @IsString()
  @IsOptional()
  fees_and_reimbursements?: string;

  @ApiProperty({ description: 'The ID of the branch this consultation belongs to.' })
  @IsNumber()
  @IsNotEmpty()
  branch_id: number;
}
    