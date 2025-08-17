import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsNumber, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class SocialLinksDto {
  @ApiProperty({ example: 'https://facebook.com/agent', required: false })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiProperty({ example: 'https://instagram.com/agent', required: false })
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiProperty({ example: 'https://twitter.com/agent', required: false })
  @IsOptional()
  @IsUrl()
  twitter?: string;
}
