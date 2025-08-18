import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { LocationResponseDto } from './dto/location.dto';
import { logger } from 'src/core/utils/logger';

@Injectable()
export class LocationService {
    constructor(private readonly httpService: HttpService) { }

    private detectCountryByPostalCode(postalCode: string): string[] {
        const cleanCode = postalCode.trim().replace(/\s+/g, '');

        // Belgium postal codes: 4 digits (1000-9999)
        const belgiumRegex = /^[1-9]\d{3}$/;

        // India PIN codes: 6 digits (100000-999999)
        const indiaRegex = /^\d{6}$/;

        const possibleCountries: string[] = [];

        if (belgiumRegex.test(cleanCode)) {
            possibleCountries.push('be'); // Belgium
        }

        if (indiaRegex.test(cleanCode)) {
            possibleCountries.push('in'); // India
        }

        return possibleCountries;
    }

    async findByPostalCode(postalCode: string): Promise<LocationResponseDto> {
        // Basic validation
        if (!postalCode || postalCode.trim().length === 0) {
            throw new HttpException('Postal code is required', HttpStatus.BAD_REQUEST);
        }

        const cleanPostalCode = postalCode.trim().replace(/\s+/g, '');
        const possibleCountries = this.detectCountryByPostalCode(cleanPostalCode);

        console.log(`Possible countries for postal code "${cleanPostalCode}":`, possibleCountries);


        if (possibleCountries.length === 0) {
            throw new HttpException(
                'Invalid postal code format. Supported formats: Belgium (4 digits: 1000-9999), India (6 digits: 100000-999999)',
                HttpStatus.BAD_REQUEST
            );
        }

        // Try each possible country until we find a match
        for (const countryCode of possibleCountries) {
            try {
                const result = await this.fetchLocationData(countryCode, cleanPostalCode);
                return result;
            } catch (error) {
                // If it's a 404, try the next country
                if (error instanceof HttpException && error.getStatus() === HttpStatus.NOT_FOUND) {
                    continue;
                }
                // For other errors, throw immediately
                throw error;
            }
        }

        // If we've tried all possible countries and none worked
        throw new HttpException('Postal code not found in supported countries (Belgium, India)', HttpStatus.NOT_FOUND);
    }

    private async fetchLocationData(countryCode: string, postalCode: string): Promise<LocationResponseDto> {
        const url = `https://api.zippopotam.us/${countryCode}/${postalCode}`;

        try {
            const response = await firstValueFrom(
                this.httpService.get(url, {
                    timeout: 5000, 
                })
            );

            const data = response.data;

            if (!data || !data.places || data.places.length === 0) {
                throw new HttpException('Postal code not found', HttpStatus.NOT_FOUND);
            }

            const place = data.places[0];

            console.log(`Fetched location data for postal code ${postalCode} in ${countryCode}:`, place);


            return {
                postalCode: data['post code'],
                city: place['place name'],
                state: place['state'] || place['state abbreviation'] || '',
                country: data['country'],
                countryCode: data['country abbreviation'].toUpperCase(),
            };
        } catch (error) {
            logger.error(`Error fetching location for postal code ${postalCode} in ${countryCode}:`, error);

            if (error instanceof HttpException) {
                throw error;
            }

            if (error.response?.status === 404) {
                throw new HttpException('Postal code not found', HttpStatus.NOT_FOUND);
            }

            if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
                throw new HttpException('Request timeout', HttpStatus.REQUEST_TIMEOUT);
            }

            throw new HttpException('Failed to fetch location data', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Keep backward compatibility
    async findByZipcode(zipcode: string): Promise<LocationResponseDto> {
        return this.findByPostalCode(zipcode);
    }
}
