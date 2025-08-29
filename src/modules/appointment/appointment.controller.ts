import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiQuery, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Create a new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created successfully.' })
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    try {
      const data = await this.appointmentsService.createAppointment(createAppointmentDto);
      return HandleResponse.buildSuccessObj(EC201, 'Appointment created successfully.', data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointments with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Appointments retrieved successfully.' })
  async findAll(@Query() query: FindAllAppointmentsQueryDto) {
    const page = query.pagNo ?? 1; 
    const limit = query.limit ?? 10; 
    const search = query.search;
    const status = query.status;
    const startDate = query.startDate;
    const endDate = query.endDate;
    const departmentId = query.departmentId;
    const branchId = query.branchId;
    const patientId = query.patientId;
    const therapistId = query.therapistId;

    try {
      const { data, total } = await this.appointmentsService.findAllWithPaginationAppointments(
        page, 
        limit, 
        search, 
        status, 
        startDate,
        endDate,
        departmentId,
        branchId,
        patientId,
        therapistId
      );
      return HandleResponse.buildSuccessObj(EC200, 'Appointments retrieved successfully.', {
        data,
        total,
        page,
        limit,
        filters: { search, status, startDate, endDate, departmentId, branchId, patientId, therapistId }
      });
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiResponse({ status: 200, description: 'Appointment retrieved successfully.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.appointmentsService.findOneAppointment(id);
      return HandleResponse.buildSuccessObj(EC200, 'Appointment retrieved successfully.', data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an appointment (including status and other fields)' })
  @ApiResponse({ status: 200, description: 'Appointment updated successfully.' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAppointmentDto: UpdateAppointmentDto) {
    try {
      const data = await this.appointmentsService.updateAppointment(id, updateAppointmentDto);
      return HandleResponse.buildSuccessObj(EC200, 'Appointment updated successfully.', data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an appointment' })
  @ApiResponse({ status: 200, description: 'Appointment deleted successfully.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.appointmentsService.removeAppointment(id);
      return HandleResponse.buildSuccessObj(EC200, 'Appointment deleted successfully.', null);
    } catch (error) {
      return this.handleError(error);
    }
  }
}
