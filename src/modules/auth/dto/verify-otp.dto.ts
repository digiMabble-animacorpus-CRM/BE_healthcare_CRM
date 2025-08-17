import { PartialType } from '@nestjs/mapped-types';
import { SendOtpDto } from './send-otp.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumberString, IsOptional, IsUUID, Length } from 'class-validator';

export class VerifyOtpDto extends PartialType(SendOtpDto) {
    @ApiProperty({ example: "sample@gmail.com" })
    @IsNotEmpty()
    // @IsUUID()
    email_id: string;

    @ApiProperty({ example: 1234 })
    @IsNotEmpty()
    @IsNumberString()
    @Length(6, 6)
    otp: string;

    @IsBoolean()
    @IsOptional()
    email_verified:boolean

    @ApiProperty({ example: "" })
    @IsOptional()
    device_token: string;
}
