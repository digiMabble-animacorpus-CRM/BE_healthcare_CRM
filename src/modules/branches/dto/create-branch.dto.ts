import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'Main Clinic' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty({ example: '123 Health St, Wellness City' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: 'main.clinic@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'https://maps.app.goo.gl/your-location',
    required: false,
  })
  @IsOptional()
  @IsString()
  location: string;
}