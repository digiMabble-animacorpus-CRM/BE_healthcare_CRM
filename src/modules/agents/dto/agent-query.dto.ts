// // src/modules/agents/dto/agent-query.dto.ts

// import { ApiProperty } from '@nestjs/swagger';
// import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
// import { Type } from 'class-transformer';

// export class AgentQueryDto {
//   @ApiProperty({ example: 'John', required: false })
//   @IsOptional()
//   @IsString()
//   search?: string;

//   @ApiProperty({ example: 1, required: false, default: 1 })
//   @IsOptional()
//   @Type(() => Number)
//   @IsNumber()
//   page?: number = 1;

//   @ApiProperty({ example: 10, required: false, default: 10 })
//   @IsOptional()
//   @Type(() => Number)
//   @IsNumber()
//   limit?: number = 10;

//   @ApiProperty({
//     example: 'name',
//     required: false,
//     enum: ['name', 'email_id', 'mobile_no', 'created_at'],
//     default: 'created_at',
//   })
  
//   @IsOptional()
//   @IsIn(['name', 'email_id', 'mobile_no', 'created_at'])
//   sort_by?: string = 'created_at';

//   @ApiProperty({ example: 'asc', required: false, enum: ['asc', 'desc'], default: 'desc' })
//   @IsOptional()
//   @IsIn(['asc', 'desc'])
//   order?: 'asc' | 'desc' = 'desc';
// }
