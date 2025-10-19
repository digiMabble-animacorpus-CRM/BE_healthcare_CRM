import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsDateString } from 'class-validator';

export class ChatBotHistoryFilterDto {
  @ApiProperty({ required: false, description: 'Start date filter (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({ required: false, description: 'End date filter (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
