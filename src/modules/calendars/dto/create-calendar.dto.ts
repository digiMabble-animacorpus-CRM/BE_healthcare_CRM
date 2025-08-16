
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCalendarDto {
  @ApiProperty({
    example: 'Team Calendar',
    description: 'The name of the calendar',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'A calendar for the whole team',
    description: 'A description of the calendar',
    required: false
  })
  @IsOptional()
  @IsString()
  description: string;
}
