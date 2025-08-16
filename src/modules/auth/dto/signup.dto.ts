import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class SignupAdminDto {
  @ApiProperty({ example: 'Admin User' })
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name can only contain letters and spaces' })
  name: string;

  @ApiProperty({ example: 'admin@example.com' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email_id: string;

  @ApiProperty({ example: 'StrongPass123!' })
  @IsString()
  @Length(8, 100, { message: 'Password must be between 8 and 100 characters' })
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
  })
  password: string;

  @ApiProperty({ example: 'your_device_token', required: false })
  @IsOptional()
  @IsString()
  device_token?: string;
}
