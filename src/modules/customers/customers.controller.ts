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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import HandleResponse from 'src/core/utils/handle_response';
import { EC200, EC201, EC204, EC500, EM100, EM104, EM106, EM116, EM127 } from 'src/core/constants';
import { PaginationDto } from 'src/core/interfaces/shared.dto';

@ApiTags('Customers')
@Controller('customers')
// @UseInterceptors(ClassSerializerInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      const data = await this.customersService.create(createCustomerDto);
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
    console.log('Pagination DTO:', paginationDto);

    try {
      if (paginationDto.pagNo && paginationDto.limit) {
        const { data, total } = await this.customersService.findAllWithPaginationCustomer(
          paginationDto.pagNo,
          paginationDto.limit,
        );
        return HandleResponse.buildSuccessObj(EC200, EM106, { data, total });
      } else {
        const data = await this.customersService.findAll();
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
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.customersService.findOne(id);
      return HandleResponse.buildSuccessObj(EC200, EM106, data);
    } catch (error) {
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
      }
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    try {
      const data = await this.customersService.updateCustomer(id, updateCustomerDto);
      return HandleResponse.buildSuccessObj(EC200, EM116, data);
    } catch (error) {
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
      }
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.customersService.removeCustomer(id);
      return HandleResponse.buildSuccessObj(EC204, EM127, null);
    } catch (error) {
      if (error instanceof HttpException) {
        return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
      }
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }

  // @Delete('destroy/:id')
  // async destroy(@Param('id', ParseIntPipe) id: number) {
  //   try {
  //     await this.customersService.destroyCustomer(id);
  //     return HandleResponse.buildSuccessObj(EC204, EM127, null);
  //   } catch (error) {
  //     if (error instanceof HttpException) {
  //       return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
  //     }
  //     return HandleResponse.buildErrObj(EC500, EM100, error);
  //   }
  // }
}