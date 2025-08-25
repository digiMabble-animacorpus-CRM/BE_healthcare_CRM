import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateDepartmentDto {
   @ApiProperty({ example: 'Cardiology', description: 'Name of the department' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: true, required: false, description: 'Is the department active?' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiProperty({ example: 'Handles heart-related treatments', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
