import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class TherapistTeamFilterDto {
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

  @ApiPropertyOptional({ example: 'alice', description: 'Search text for team member name or email' })
  @IsOptional()
  @IsString()
  searchText?: string;

  @ApiPropertyOptional({ example: [1, 2], description: 'Department IDs to filter team members' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => Number(v))
      : value?.split(',').map((v) => Number(v)) || [],
  )
  @IsInt({ each: true })
  departmentIds?: number[];

  @ApiPropertyOptional({ example: [1, 2], description: 'Branch IDs to filter team members' })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => Number(v))
      : value?.split(',').map((v) => Number(v)) || [],
  )
  @IsInt({ each: true })
  branchIds?: number[];
}
