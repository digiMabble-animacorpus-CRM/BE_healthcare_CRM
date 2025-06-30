import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SendOtpDto {
  @ApiProperty({example:"+917010132357"})
  @IsNotEmpty()
  mobile_no: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  user_id:number

  @ApiProperty()
  @IsOptional()
  @IsString()
  otp_sha_key:string
}
