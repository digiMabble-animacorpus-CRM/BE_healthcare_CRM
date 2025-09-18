import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString, IsArray, ValidateNested } from 'class-validator';

export class AvailabilityDto {
  @ApiProperty({ example: 'Monday' })
  @IsString()
  day: string;

  @ApiProperty({ example: '09:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '17:00' })
  @IsString()
  endTime: string;
}

export class CreateTherapistDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ required: false, example: 'https://example.com/photos/john.jpg' })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ required: false, example: 'https://example.com/images/john.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsString()
  contactEmail: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  contactPhone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  aboutMe?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  degreesTraining?: string;

  @ApiProperty({ example: 987654321 })
  @IsInt()
  inamiNumber: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsArray()
  paymentMethods?: any[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  faq?: string;

  @ApiProperty({ example: 4, description: 'Reference to Department ID' })
  @IsInt()
  departmentId: number;

  @ApiProperty({ example: [1, 2, 3], description: 'Specialization IDs for therapist' })
  @IsArray()
  @IsInt({ each: true })
  specializations: number[];

  @ApiProperty({ example: ['English', 'French'], description: 'Languages spoken by therapist' })
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiProperty({ example: [1, 2], description: 'Array of branch IDs for therapist' })
  @IsArray()
  @IsInt({ each: true })
  branches: number[];

  @ApiProperty({
    type: [AvailabilityDto],
    required: false,
    example: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '10:00', endTime: '16:00' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  availability?: AvailabilityDto[];
}
