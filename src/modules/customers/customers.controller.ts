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
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import HandleResponse from 'src/core/utils/handle_response';
import {
  EC200,
  EC201,
  EC204,
  EC500,
  EM100,
  EM104,
  EM106,
  EM116,
  EM127,
} from 'src/core/constants';
import { PaginationDto } from 'src/core/interfaces/shared.dto';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // CREATE
  @Post()
  @ApiOperation({ summary: 'Create a new customer (plain JSON only)' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async create(@Body() reqBody: CreateCustomerDto) {
    try {
      const createCustomerDto = plainToClass(CreateCustomerDto, reqBody);
      await validateOrReject(createCustomerDto);

      const data = await this.customersService.create(createCustomerDto);
      return HandleResponse.buildSuccessObj(EC201, EM104, data);
    } catch (error) {
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(
          error.getStatus(),
          error.message,
          error,
        );
      }
      console.error('Create customer error:', error);
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }

  // GET ALL
  @Get()
  @ApiOperation({
    summary: 'Get all customers with pagination and filters (plain query only)',
  })
  @ApiResponse({ status: 200, description: 'Customers fetched successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiQuery({ name: 'pagNo', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'searchText', required: false, type: String })
  @ApiQuery({ name: 'branch', required: false, type: String })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  async findAll(@Query() queryParams: PaginationDto) {
    try {
      const paginationDto = plainToClass(PaginationDto, queryParams);
      await validateOrReject(paginationDto);

      if (paginationDto.pagNo && paginationDto.limit) {
        const { data, total } =
          await this.customersService.findAllWithPaginationCustomer(
            paginationDto.pagNo,
            paginationDto.limit,
            paginationDto.searchText,
            paginationDto.branch,
            paginationDto.fromDate,
            paginationDto.toDate,
          );
        return HandleResponse.buildSuccessObj(EC200, EM106, { data, total });
      } else {
        const data = await this.customersService.findAll();
        return HandleResponse.buildSuccessObj(EC200, EM106, data);
      }
    } catch (error) {
      console.error('FindAll error:', error);
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(
          error.getStatus(),
          error.message,
          error,
        );
      }
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }

  // GET ONE
  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', required: true, type: Number, example: 123 })
  @ApiResponse({ status: 200, description: 'Customer fetched successfully' })
  @ApiResponse({ status: 400, description: 'Invalid ID or request format' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.customersService.findOne(id);
      return HandleResponse.buildSuccessObj(EC200, EM106, data);
    } catch (error) {
      console.error('FindOne error:', error);
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(
          error.getStatus(),
          error.message,
          error,
        );
      }
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }

  // UPDATE
  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer by ID' })
  @ApiParam({ name: 'id', required: true, type: Number, example: 123 })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() reqBody: UpdateCustomerDto,
  ) {
    try {
      const dto = plainToClass(UpdateCustomerDto, reqBody);
      await validateOrReject(dto);

      const data = await this.customersService.updateCustomer(id, dto);
      return HandleResponse.buildSuccessObj(EC200, EM116, data);
    } catch (error) {
      console.error('Update error:', error);
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(
          error.getStatus(),
          error.message,
          error,
        );
      }
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }

  // DELETE
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer by ID' })
  @ApiParam({ name: 'id', required: true, type: Number, example: 123 })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid ID or input' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.customersService.removeCustomer(id);
      return HandleResponse.buildSuccessObj(EC204, EM127, null);
    } catch (error) {
      console.error('Delete error:', error);
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(
          error.getStatus(),
          error.message,
          error,
        );
      }
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }
}
