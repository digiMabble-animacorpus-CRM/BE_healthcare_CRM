// src/modules/calendars/dto/find-all-calendars-query.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class FindAllCalendarsQueryDto {
  @ApiProperty({ required: false, description: 'Search by label, siteid, or ownerid' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Page number for pagination' })
  @IsOptional()
  @IsNumber()
  pagNo?: number;

  @ApiProperty({ required: false, description: 'Number of items per page' })
  @IsOptional()
  @IsNumber()
  limit?: number;
}