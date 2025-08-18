import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsEnum, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { LeadStatus } from '../entities/lead.entity';

export class LeadQueryDto {
    @ApiProperty({
        example: 1,
        required: false,
        description: 'Page number for pagination',
        minimum: 1
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Page number must be a valid number' })
    @Min(1, { message: 'Page number must be at least 1' })
    pagNo?: number;

    @ApiProperty({
        example: 10,
        required: false,
        description: 'Number of items per page',
        minimum: 1,
        maximum: 100
    })
    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: 'Limit must be a valid number' })
    @Min(1, { message: 'Limit must be at least 1' })
    @Max(100, { message: 'Limit cannot exceed 100' })
    limit?: number;

    @ApiProperty({
        example: 'New',
        required: false,
        enum: LeadStatus,
        description: 'Filter by lead status'
    })
    @IsOptional()
    @IsEnum(LeadStatus, { message: 'Invalid lead status' })
    status?: LeadStatus;

    @ApiProperty({
        example: 'john',
        required: false,
        description: 'Search text to filter leads'
    })
    @IsOptional()
    @IsString({ message: 'Search text must be a string' })
    searchText?: string;
}
