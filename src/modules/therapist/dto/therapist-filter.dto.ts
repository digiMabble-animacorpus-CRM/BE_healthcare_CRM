// src/modules/therapists/dto/therapist-filter.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class TherapistFilterDto {
  @ApiPropertyOptional({ example: '1', description: 'Page number for pagination' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number;

  @ApiPropertyOptional({ example: '10', description: 'Number of items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @ApiPropertyOptional({ example: 'alice', description: 'Search text for therapist name or email' })
  @IsOptional()
  @IsString()
  searchText?: string;

  @ApiPropertyOptional({ example: [1, 2], description: 'Branch IDs to filter therapists' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => Number(v))
      : value?.split(',').map((v) => Number(v)) || [],
  )
  @IsInt({ each: true })
  branchIds?: number[];

  @ApiPropertyOptional({ example: 'Main Clinic', description: 'Branch name to filter therapists' })
  @IsOptional()
  @IsString()
  branchName?: string;

  @ApiPropertyOptional({ example: '1', description: 'Department ID to filter therapists' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  departmentId?: number;

  @ApiPropertyOptional({ example: [2, 3], description: 'Filter by specialization IDs' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => Number(v))
      : value?.split(',').map((v) => Number(v)) || [],
  )
  @IsInt({ each: true })
  specializationIds?: number[];

  @ApiPropertyOptional({ example: [1, 2], description: 'Filter by language IDs' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => Number(v))
      : value?.split(',').map((v) => Number(v)) || [],
  )
  @IsInt({ each: true })
  languageIds?: number[];

  @ApiPropertyOptional({ example: '2025-07-01', description: 'Filter therapists available from this date' })
  @IsOptional()
  @IsString()
  fromDate?: string;

  @ApiPropertyOptional({ example: '2025-07-31', description: 'Filter therapists available until this date' })
  @IsOptional()
  @IsString()
  toDate?: string;
}
