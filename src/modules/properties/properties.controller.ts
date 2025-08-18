// src/modules/properties/properties.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import HandleResponse from 'src/core/utils/handle_response';
import { EC200, EC201, EC204, EC404, EC500, EM100, EM104, EM106, EM116, EM119, EM127 } from 'src/core/constants';
import { PaginationDto } from 'src/core/interfaces/shared.dto';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    try {
      const data = await this.propertiesService.createProperty(createPropertyDto);
      return HandleResponse.buildSuccessObj(EC201, EM104, data);
    } catch (error) {
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
      }
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    try {
      if (paginationDto.pagNo && paginationDto.limit) {
        const { data, total } = await this.propertiesService.findAllWithPagination(
          paginationDto.pagNo,
          paginationDto.limit
        );
        return HandleResponse.buildSuccessObj(EC200, EM106, { data, total });
      } else {
        const data = await this.propertiesService.findAllProperties();
        return HandleResponse.buildSuccessObj(EC200, EM106, data);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
      }
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.propertiesService.findOneProperty(+id);
      return HandleResponse.buildSuccessObj(EC200, EM106, data);
    } catch (error) {
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
      }
      if (error.message.includes('not found')) {
        return HandleResponse.buildErrObj(EC404, EM119, error);
      }
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    try {
      await this.propertiesService.updateProperty(+id, updatePropertyDto);
      const data = await this.propertiesService.findOneProperty(+id);
      return HandleResponse.buildSuccessObj(EC200, EM116, data);
    } catch (error) {
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
      }
      if (error.message.includes('not found')) {
        return HandleResponse.buildErrObj(EC404, EM119, error);
      }
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.propertiesService.removeProperty(+id);
      return HandleResponse.buildSuccessObj(EC204, EM127, null);
    } catch (error) {
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
      }
      if (error.message.includes('not found')) {
        return HandleResponse.buildErrObj(EC404, EM119, error);
      }
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }

  // @Delete('destroy/:id')
  // async destroy(@Param('id') id: string) {
  //   try {
  //     await this.propertiesService.destroyProperty(id);
  //     return HandleResponse.buildSuccessObj(EC204, EM127, null);
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
  //     }
  //     if (error.message.includes('not found')) {
  //       return HandleResponse.buildErrObj(EC404, EM119, error);
  //     }
  //     return HandleResponse.buildErrObj(EC500, EM100, error);
  //   }
  // }
}
