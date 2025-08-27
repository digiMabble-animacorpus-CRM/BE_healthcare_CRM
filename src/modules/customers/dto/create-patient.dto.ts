import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePatientDto {

  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsString()
  firstname?: string;

  @ApiProperty({ example: 'Middle' })
  @IsOptional()
  @IsString()
  middlename?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiProperty({ example: '94060768059' })
  @IsOptional()
  @IsString()
  ssin?: string;

  @ApiProperty({ example: 'M' })
  @IsOptional()
  @IsString()
  legalgender?: string;

  @ApiProperty({ example: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ example: 'primary_record_123' })
  @IsOptional()
  @IsString()
  primarypatientrecordid?: string;

  @ApiProperty({ example: 'Some note about the patient' })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '12345' })
  @IsOptional()
  @IsString()
  mutualitynumber?: string;

  @ApiProperty({ example: '67890' })
  @IsOptional()
  @IsString()
  mutualityregistrationnumber?: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsOptional()
  @IsEmail()
  emails?: string;

  @ApiProperty({ example: 'BE' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'Brussels' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'Rue du Comté' })
  @IsOptional()
  @IsString()
  street?: string;

  @ApiProperty({ example: '10' })
  @IsOptional()
  @IsString()
  number?: string;

  @ApiProperty({ example: '5140' })
  @IsOptional()
  @IsString()
  zipcode?: string;

  

  @ApiProperty({ example: '1994-06-07' })
  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @ApiProperty({ example: ['+32491079736'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phones?: string[];


@ApiProperty({ example: 1, description: 'Optional therapist ID' })
@IsOptional()
@IsNumber()
therapistId?: number;

}
