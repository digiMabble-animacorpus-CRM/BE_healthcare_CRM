import { ApiProperty } from '@nestjs/swagger';

export class LocationResponseDto {
  @ApiProperty({ description: 'Postal code', example: '1000' })
  postalCode: string;

  @ApiProperty({ description: 'City name', example: 'Brussels' })
  city: string;

  @ApiProperty({ description: 'State/Province/Region name', example: 'Brussels', required: false })
  state?: string;

  @ApiProperty({ description: 'Country name', example: 'Belgium' })
  country: string;

  @ApiProperty({ description: 'Country code (ISO 3166-1 alpha-2)', example: 'BE' })
  countryCode: string;
}
