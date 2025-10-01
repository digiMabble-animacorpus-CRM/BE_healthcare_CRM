import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsInt,
} from 'class-validator';


export class CreateSpecializationDto {
  @ApiProperty({ description: 'Reference to Department' })
  @IsInt()
  @IsNotEmpty()
  department_id: number;

  @ApiProperty({
    type: String,
    description: 'Type of specialization (e.g. Consultation, Therapy, X-Ray, etc.)',
    example: 'Consultation',
  })
  @IsString()
  @IsNotEmpty()
  specialization_type: string;

  @ApiProperty({
    description: 'Extra info about this specialization',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;
}
