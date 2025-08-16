import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class FindAllOrdersQueryDto {
  @ApiProperty({ required: false, description: 'Search term' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Page number' })
  @IsOptional()
  @IsNumber()
  pagNo?: number;

  @ApiProperty({ required: false, description: 'Number of items per page' })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
