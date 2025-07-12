import { IsOptional, IsString, IsNumberString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class StaffFilterDto {
  @ApiPropertyOptional({ description: 'Page number', example: '1' })
  @IsOptional()
  @IsNumberString({}, { message: 'Page must be a numeric string' })
  page?: string;

  @ApiPropertyOptional({ description: 'Limit per page', example: '10' })
  @IsOptional()
  @IsNumberString({}, { message: 'Limit must be a numeric string' })
  limit?: string;

  @ApiPropertyOptional({ description: 'Search text for name, phone, email', example: 'john' })
  @IsOptional()
  @IsString()
  searchText?: string;

  @ApiPropertyOptional({ description: 'Branch name for filtering', example: 'Chennai' })
  @IsOptional()
  @IsString()
  branch?: string;

  @ApiPropertyOptional({ description: 'From date (YYYY-MM-DD)', example: '2024-01-01' })
  @IsOptional()
  @IsDateString({}, { message: 'fromDate must be a valid ISO date string' })
  fromDate?: string;

  @ApiPropertyOptional({ description: 'To date (YYYY-MM-DD)', example: '2024-12-31' })
  @IsOptional()
  @IsDateString({}, { message: 'toDate must be a valid ISO date string' })
  toDate?: string;
}
