import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { TherapistsService } from './therapists.service';
import { CreateTherapistDto } from './dto/create-therapist.dto';
import { UpdateTherapistDto } from './dto/update-therapist.dto';
import HandleResponse from 'src/core/utils/handle_response';
import { EC200, EC201, EC204, EC500, EM100, EM104, EM106, EM116, EM127 } from 'src/core/constants';
import { PaginationDto } from 'src/core/interfaces/shared.dto';
import { AES } from 'src/core/utils/encryption.util';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { TherapistFilterDto } from './dto/therapist-filter.dto';

@ApiTags('Therapists')
@Controller('therapists')
export class TherapistsController {
  constructor(private readonly therapistsService: TherapistsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new therapist (supports encrypted or plain JSON)' })
  @ApiBody({ type: CreateTherapistDto })
  async create(@Body() reqBody: any) {
    try {
      let decryptedObject;

      if (reqBody.data) {
        const decryptedString = AES.decrypt(reqBody.data);
        decryptedObject = JSON.parse(decryptedString);
      } else {
        decryptedObject = reqBody;
      }

      const dto = plainToClass(CreateTherapistDto, decryptedObject);
      await validateOrReject(dto);

      const data = await this.therapistsService.create(dto);
      return HandleResponse.buildSuccessObj(EC201, EM104, data);
    } catch (error) {
      console.error('Therapist create error:', error);
      return HandleResponse.buildErrObj(error.status || EC500, EM100, error.message || error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all therapists (with optional pagination)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'searchText', required: false, type: String })
  @ApiQuery({ name: 'branch', required: false, type: String })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  async findAll(@Query() queryParams: any) {
    try {
      let decryptedObject;

      if (queryParams.data) {
        const decryptedString = AES.decrypt(queryParams.data);
        decryptedObject = JSON.parse(decryptedString);
      } else {
        decryptedObject = queryParams;
      }

      const dto = plainToClass(TherapistFilterDto, decryptedObject);
      await validateOrReject(dto);

      if (dto.page && dto.limit) {
        const { data, total } = await this.therapistsService.searchWithFilters(dto);
        return HandleResponse.buildSuccessObj(EC200, EM106, { data, total });
      } else {
        const data = await this.therapistsService.findAll();
        return HandleResponse.buildSuccessObj(EC200, EM106, data);
      }
    } catch (error) {
      console.error('FindAll therapists error:', error);
      return HandleResponse.buildErrObj(error.status || EC500, EM100, error.message || error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get therapist by ID (encrypted or plain)' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id') id: string, @Query('data') encryptedData?: string) {
    try {
      let therapistId: number;

      if (encryptedData) {
        const decryptedString = AES.decrypt(encryptedData);
        const decryptedObject = JSON.parse(decryptedString);
        therapistId = parseInt(decryptedObject.id, 10);
      } else {
        therapistId = parseInt(id, 10);
      }

      if (isNaN(therapistId)) {
        throw new BadRequestException('Invalid therapist ID');
      }

      const data = await this.therapistsService.findOne(therapistId);
      return HandleResponse.buildSuccessObj(EC200, EM106, data);
    } catch (error) {
      console.error('Find therapist error:', error);
      return HandleResponse.buildErrObj(error.status || EC500, EM100, error.message || error);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a therapist (encrypted or plain)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateTherapistDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() reqBody: any) {
    try {
      let decryptedObject;

      if (reqBody.data) {
        const decryptedString = AES.decrypt(reqBody.data);
        decryptedObject = JSON.parse(decryptedString);
      } else {
        decryptedObject = reqBody;
      }

      const dto = plainToClass(UpdateTherapistDto, decryptedObject);
      await validateOrReject(dto);

      const data = await this.therapistsService.updateTherapist(id, dto);
      return HandleResponse.buildSuccessObj(EC200, EM116, data);
    } catch (error) {
      console.error('Update therapist error:', error);
      return HandleResponse.buildErrObj(error.status || EC500, EM100, error.message || error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete therapist by ID' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number, @Body() reqBody: any) {
    try {
      if (reqBody?.data) {
        const decrypted = AES.decrypt(reqBody.data);
        console.log('Decrypted delete body:', JSON.parse(decrypted));
      }

      await this.therapistsService.removeTherapist(id);
      return HandleResponse.buildSuccessObj(EC204, EM127, null);
    } catch (error) {
      console.error('Delete therapist error:', error);
      return HandleResponse.buildErrObj(error.status || EC500, EM100, error.message || error);
    }
  }
}
