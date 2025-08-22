import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsNotEmpty, IsArray } from 'class-validator';

export class CreateFunctionDescriptionDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fonction?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  function_description_text?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  simplification_description?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  communication_patients?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  tone_communication?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  professional_1?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  professional_2?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  professional_3?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  professional_4?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  professional_5?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  professional_6?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  professional_7?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  professional_8?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  professional_9?: string;

  @ApiProperty({ description: 'The ID of the consultation this service belongs to.' })
  @IsUUID()
  @IsNotEmpty()
  consultation_id: string;

  @ApiProperty({
    description: 'An array of therapist IDs associated with this service.',
    type: [String],
    required: false,
  })
  @IsArray()
  @IsOptional()
  therapist_ids?: string[];
}
