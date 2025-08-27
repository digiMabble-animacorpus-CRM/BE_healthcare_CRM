import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { FunctionDescriptionService } from './function-description.service';
import { CreateFunctionDescriptionDto } from './dto/create-function-description.dto';
import { UpdateFunctionDescriptionDto } from './dto/update-function-description.dto';

@ApiTags('Function Descriptions (Services)')
@Controller('function-descriptions')
export class FunctionDescriptionController {
  constructor(
    private readonly functionDescriptionService: FunctionDescriptionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new service (function description)' })
  create(@Body() createDto: CreateFunctionDescriptionDto) {
    return this.functionDescriptionService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all services, optionally filtered by consultation' })
  @ApiQuery({ name: 'consultationId', required: false, type: String, description: 'Filter services by consultation ID' })
  findAll(@Query('consultationId') consultationId?: any) {
    return this.functionDescriptionService.findAll(consultationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single service by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.functionDescriptionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateFunctionDescriptionDto) {
    return this.functionDescriptionService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a service' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.functionDescriptionService.remove(id);
  }
}
