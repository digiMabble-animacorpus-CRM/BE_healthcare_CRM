import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsUUID } from 'class-validator';

export class FindAllSpecializationsQueryDto {
  @ApiProperty({
    required: false,
    description: 'Search by specialization type, description, or department name'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;

  // @ApiProperty({
  //   required: false,
  //   description: 'Filter specializations by consultation ID',
  // })
  // @IsOptional()
  // @IsUUID()
  // consultationId?: string;

  @ApiProperty({
    required: false,
    description: 'Filter specializations by department ID',
  })
  @IsOptional()
  departmentId?: string;
}