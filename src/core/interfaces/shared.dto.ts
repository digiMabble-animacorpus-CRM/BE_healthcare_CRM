import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber, IsOptional,
  IsString
} from 'class-validator';

export enum BlockingUserType {
  USER = 'USER'
}





export class PaginationDto {
  @ApiProperty({ example: 'Some text', required: false })
  @IsString()
  @IsOptional()
  searchText?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @Type(() => Number) 
  @IsInt() 
  pagNo?: number;

  @ApiProperty({ example: 10, required: false })
  @IsOptional()
  @Type(() => Number) 
  @IsInt() 
  limit?: number;
}
