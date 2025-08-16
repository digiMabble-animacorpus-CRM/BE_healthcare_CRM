import { Controller, Get, Param, HttpException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import HandleResponse from 'src/core/utils/handle_response';
import { EC200, EC500, EM100, EM106 } from 'src/core/constants';

@ApiTags('Pincode')
@Controller('pincode')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get(':postalcode')
  async findByPostalCode(@Param('postalcode') postalcode: string) {
    try {
      const data = await this.locationService.findByPostalCode(postalcode);
      return HandleResponse.buildSuccessObj(EC200, EM106, data);
    } catch (error) {
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
      }
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }
}
