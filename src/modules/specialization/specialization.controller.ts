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
    summary: 'Retrieve all specializations, optionally filtered by consultation',
  })
  @ApiQuery({
    name: 'consultationId',
    required: false,
    type: String,
    description: 'Filter specializations by consultation ID',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('consultationId') consultationId?: string,
  ) {
    return this.specializationService.findAll(
      page,
      limit,
      search,
      consultationId,
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
