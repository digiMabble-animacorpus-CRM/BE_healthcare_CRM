import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsDateString, IsNumber, IsIn } from 'class-validator';

export class DashboardQueryDto {
  @ApiPropertyOptional({ description: 'Start date for filtering (ISO string)', example: '2025-09-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date for filtering (ISO string)', example: '2025-09-30T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Filter by doctor/therapist ID', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  doctorId?: number;

  @ApiPropertyOptional({ description: 'Filter by branch ID', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  branchId?: number;

  @ApiPropertyOptional({ 
    description: 'Quick date filter presets', 
    example: 'thisWeek',
    enum: ['thisWeek', 'lastWeek', 'thisMonth', 'lastMonth']
  })
  @IsOptional()
  @IsIn(['thisWeek', 'lastWeek', 'thisMonth', 'lastMonth'])
  timeFilter?: 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth';
}

export class DistributionQueryDto extends DashboardQueryDto {
  @ApiPropertyOptional({ 
    description: 'Group distribution by doctor or branch', 
    example: 'doctor',
    enum: ['doctor', 'branch']
  })
  @IsOptional()
  @IsIn(['doctor', 'branch'])
  groupBy?: 'doctor' | 'branch';
}
