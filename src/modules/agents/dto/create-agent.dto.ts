// // src/modules/agents/dto/create-agent.dto.ts

// import { ApiProperty } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
// import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Length, Matches, ValidateNested } from 'class-validator';
// import { CreateAddressDto } from 'src/modules/addresses/dto/create-address.dto';
// import { SocialLinksDto } from 'src/modules/social-links/dto/social-links.dto';

// export class CreateAgentDto {
//   @ApiProperty({ example: 'John Agent', description: "The agent's full name" })
//   @IsString()
//   @IsNotEmpty()
//   @Length(2, 50)
//   name: string;

//   @ApiProperty({ example: 'agent@example.com', description: "The agent's email address" })
//   @IsEmail()
//   @IsNotEmpty()
//   email_id: string;

//   @ApiProperty({ example: 'StrongP@ss123', description: "The agent's password" })
//   @IsString()
//   @IsNotEmpty()
//   @Length(8, 100)
//   @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
//     message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
//   })
//   password: string;

//   @ApiProperty({ example: '+1234567890', description: "The agent's phone number" })
//   @IsString()
//   @IsNotEmpty()
//   mobile_no: string;

//   @ApiProperty({ example: 'https://example.com/profile.jpg', required: false, description: "URL to the agent's profile picture" })
//   @IsOptional()
//   @IsUrl()
//   profile_url?: string;

//   @ApiProperty({ type: CreateAddressDto, description: "The agent's address details" })
//   @IsNotEmpty()
//   @ValidateNested()
//   @Type(() => CreateAddressDto)
//   address: CreateAddressDto;

//   @ApiProperty({ type: SocialLinksDto, required: false, description: 'Social media links for the agent' })
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => SocialLinksDto)
//   social_links?: SocialLinksDto;
// }
