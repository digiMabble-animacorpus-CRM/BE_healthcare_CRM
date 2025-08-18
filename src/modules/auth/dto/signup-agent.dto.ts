import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested, Length, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAddressDto } from 'src/modules/addresses/dto/create-address.dto';

export class SignupAgentDto {
    @ApiProperty({ example: 'Agent User' })
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
    @Matches(/^[A-Za-z\s]+$/, { message: 'Name can only contain letters and spaces' })
    name: string;

    @ApiProperty({ example: 'agent@example.com' })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email_id: string;

    @ApiProperty({ example: 'StrongPass123!' })
    @IsString()
    @Length(8, 100, { message: 'Password must be between 8 and 100 characters' })
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
        message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
    })

    password: string;

    @ApiProperty({ example: '+1234567890' })
    @IsOptional()
    @IsString()
    mobile_no: string;

    @ApiProperty({
        type: CreateAddressDto,
        description: 'Address is required when registering as an agent'
    })
    
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateAddressDto)
    address: CreateAddressDto;

    @ApiProperty({ example: 'your_device_token', required: false })
    @IsOptional()
    @IsString()
    device_token?: string;
}
