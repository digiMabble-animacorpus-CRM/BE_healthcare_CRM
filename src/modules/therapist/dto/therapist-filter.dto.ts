// src/modules/therapists/dto/therapist-filter.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class TherapistFilterDto {
  @ApiPropertyOptional({ example: '1' })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ example: 'alice' })
  @IsOptional()
  @IsString()
  searchText?: string;

  @ApiPropertyOptional({ example: 'Gembloux - Orneau' })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiPropertyOptional({ example: '2025-07-01' })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({ example: '2025-07-31' })
  @IsOptional()
  @IsString()
  toDate?: string;
}
