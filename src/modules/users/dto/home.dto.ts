import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';

export class HomeDto {
  @ApiProperty({ example: '62a5af6ec5ca5e39d17cfe04' })
  // @IsUUID()
  @IsOptional()
  user_id: string;

  // @ApiProperty({ example: 1 })
  // @IsNotEmpty()
  // page: number;

  // @ApiProperty({ example: '' })
  // location_search: string;

  // @ApiProperty({ example: 'KFC' })
  // shopNameSearch: string;

  // @ApiProperty({
  //   example:
  //     'Chennai Bypass Road, Om Shakti Nagar, Menambedu, Korattur, Chennai, Tamil Nadu, India',
  // })
  // @IsOptional()
  // homelocation: string;

  // @ApiProperty({ example: '' })
  // serviceNameSearch: string;

  // @ApiProperty({ example: '' })
  // services_filter: string;

  // @ApiProperty({ example: '' })
  // servicetypes_filter: string;

  // @ApiProperty({ example: '' })
  // gender_filter: string;

  // @ApiProperty({ example: '' })
  // service_shop_search: string;
  @ApiProperty({ example: 13.045218 })
  @IsOptional()
  @IsNumber()
  lat: number;
  @ApiProperty({ example: 80.135437 })
  @IsOptional()
  @IsNumber()
  lng: number;
}


