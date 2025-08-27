import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString, IsDate, IsArray,ValidateNested } from 'class-validator';





// // ---------------------- Branch DTOs ----------------------
// export class BranchAvailabilityDto {
//   @ApiProperty({ example: 'Monday' })
//   @IsString()
//   day: string;

//   @ApiProperty({ example: '09:00' })
//   @IsString()
//   startTime: string;

//   @ApiProperty({ example: '17:00' })
//   @IsString()
//   endTime: string;
// }

// export class BranchDto {
//   @ApiProperty({ example: 1 })
//   @IsInt()
//   branch_id: number;

//   @ApiProperty({ example: 'Main Clinic' })
//   @IsString()
//   branch_name: string;

//   @ApiProperty({
//     type: [BranchAvailabilityDto],
//     example: [
//       { day: 'Monday', startTime: '09:00', endTime: '17:00' },
//       { day: 'Wednesday', startTime: '10:00', endTime: '16:00' },
//     ],
//   })
//   @IsArray()
//   @ValidateNested({ each: true })
//   @Type(() => BranchAvailabilityDto)
//   availability: BranchAvailabilityDto[];
// }


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

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsString()
  contactEmail: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  contactPhone: string;

  @ApiProperty({ required: false, example: 'Experienced psychologist specializing in cognitive therapy.' })
  @IsOptional()
  @IsString()
  aboutMe?: string;

  @ApiProperty({ required: false, example: 'PhD in Clinical Psychology' })
  @IsOptional()
  @IsString()
  degreesTraining?: string;

  @ApiProperty({ example: 987654321 })
  @IsInt()
  inamiNumber: number;

  @ApiProperty({ required: false, example: ['Cash', 'Card'] })
  @IsOptional()
  @IsArray()
  paymentMethods?: any[];

  @ApiProperty({ required: false, example: 'Q: Do you offer online sessions? A: Yes' })
  @IsOptional()
  @IsString()
  faq?: string;

  @ApiProperty({ example: 4, description: 'Reference to Department ID' })
  @IsInt()
  departmentId: number;

  @ApiProperty({ example: [2, 3, 5], description: 'Multiple specialization IDs' })
  @IsArray()
  specializationIds: number[];

  @ApiProperty({ example: ['English', 'French'], description: 'Languages spoken by therapist' })
  @IsArray()
  @IsString({ each: true })
  languages: string[];


  @ApiProperty({ example: [1, 2], description: 'Array of branch IDs for therapist' })
  @IsArray()
  @IsInt({ each: true })
  branches: number[];

  @ApiProperty({
    type: [Object],
    required: false,
    example: [
      { day: 'Monday', startTime: '09:00', endTime: '17:00' },
      { day: 'Wednesday', startTime: '10:00', endTime: '16:00' },
    ],
  })
  @IsOptional()
  @IsArray()
  availability?: { day: string; startTime: string; endTime: string }[];


}