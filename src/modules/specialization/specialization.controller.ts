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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SpecializationService } from './specialization.service';
import { CreateSpecializationDto } from './dto/create-specialization.dto';
import { UpdateSpecializationDto } from './dto/update-specialization.dto';

import { FindAllSpecializationsQueryDto } from './dto/find-all-specializations-query.dto';

@ApiTags('Specializations')
@Controller('specializations')
export class SpecializationController {
  constructor(
    private readonly specializationService: SpecializationService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new specialization' })
  create(@Body() createDto: CreateSpecializationDto) {
    return this.specializationService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all specializations',
  })
  findAll(@Query() query: FindAllSpecializationsQueryDto) {
    const { page = 1, limit = 10, search, departmentId } = query;
    return this.specializationService.findAll(
      page,
      limit,
      search,
      departmentId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single specialization by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.specializationService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a specialization' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateSpecializationDto) {
    return this.specializationService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a specialization' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.specializationService.remove(id);
  }
}
