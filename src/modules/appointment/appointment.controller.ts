import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import HandleResponse from 'src/core/utils/handle_response';
import { EC200, EC201, EC204, EC404, EC500, EM100, EM104, EM106, EM116, EM119, EM127 } from 'src/core/constants';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentsService } from './appointment.service';
import { FindAllAppointmentsQueryDto } from './dto/find-all-appointments-query.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  /**
   * Handles common error responses.
   */
  private handleError(error: any) {
    if (error instanceof HttpException) {
      return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
    }
    if (error.message?.includes('not found')) {
      return HandleResponse.buildErrObj(EC404, EM119, error);
    }
    return HandleResponse.buildErrObj(EC500, EM100, error);
  }

  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    try {
      const data = await this.appointmentsService.createAppointment(createAppointmentDto);
      return HandleResponse.buildSuccessObj(EC201, 'Appointment created successfully.', data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get()
  async findAll(@Query() query: FindAllAppointmentsQueryDto) {
    const page = query.pagNo ?? 1; 
    const limit = query.limit ?? 10; 
    const search = query.search;

    try {
      const { data, total } = await this.appointmentsService.findAllWithPaginationAppointments(page, limit, search);
      return HandleResponse.buildSuccessObj(EC200, 'Appointments retrieved successfully.', {
        data,
        total,
        page,
        limit,
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.appointmentsService.findOneAppointment(id);
      return HandleResponse.buildSuccessObj(EC200, 'Appointment retrieved successfully.', data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    try {
      await this.appointmentsService.updateAppointment(id, updateAppointmentDto);
      const data = await this.appointmentsService.findOneAppointment(id);
      return HandleResponse.buildSuccessObj(EC200, 'Appointment updated successfully.', data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.appointmentsService.removeAppointment(id);
      return HandleResponse.buildSuccessObj(EC200, 'Appointment deleted successfully.', null);
    } catch (error) {
      return this.handleError(error);
    }
  }
}
