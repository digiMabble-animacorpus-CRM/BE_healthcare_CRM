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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-function-description.dto';

@ApiTags('Consultations')
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new consultation' })
  create(@Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationsService.create(createConsultationDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retrieve all consultations, optionally filtered by branch',
  })
  @ApiQuery({
    name: 'branchId',
    required: false,
    type: String,
    description: 'Filter consultations by branch ID',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page', example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term', example: 'John Doe' })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
    @Query('branchId') branchId?: number,
  ) {
    return this.consultationsService.findAll(page, limit, search, branchId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single consultation by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.consultationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a consultation' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateConsultationDto: UpdateConsultationDto) {
    return this.consultationsService.update(id, updateConsultationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a consultation' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.consultationsService.remove(id);
  }
}
