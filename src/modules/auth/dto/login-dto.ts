import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'sample@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email_id: string;

  @ApiProperty()
  @IsOptional()
  password: string;

  @ApiProperty({ example: '' })
  @IsOptional()
  @IsString()
  device_token: string;

  @ApiProperty({ example: false, required: false, description: 'Set to true for an extended session duration.' })
  @IsOptional()
  @IsBoolean()
  remember_me?: boolean;
}

export class DeleteDto {
  @ApiProperty({ example: 'Enter your email (or) mobile number include (+91)' })
  @IsNotEmpty()
  identity: string;
}

export class userlogoutDto {
  @ApiProperty({ example: '' })
  @IsNotEmpty()
  @IsString()
  user_id: number;
}

// export class SignupDto {
//   @ApiProperty()
//   @IsEmail()
//   email: string;

//   @ApiProperty()
//   @IsStrongPassword()
//   password: string;
// }

export class VerifyEmailDto { 
  @ApiProperty({ example: '' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '' })
  otp: string;
}
export class ResendEmailDto { 
  @ApiProperty({ example: 'sample@gmail.com' })
  @IsEmail()
  email: string;
}
