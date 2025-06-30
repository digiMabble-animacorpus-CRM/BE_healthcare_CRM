import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Query } from '@nestjs/common';
import { ApiTags, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import HandleResponse from 'src/core/utils/handle_response';
import { EC200, EC201, EC204, EC404, EC500, EM100, EM104, EM106, EM116, EM119, EM127 } from 'src/core/constants';
import { FindAllOrdersQueryDto } from './dto/find-all-orders-query.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const data = await this.ordersService.createOrder(createOrderDto);
      return HandleResponse.buildSuccessObj(EC201, EM104, data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Get()
  async findAll(@Query() query: FindAllOrdersQueryDto) {
    const page = query.pagNo ?? 1; 
    const limit = query.limit ?? 10; 
    const search = query.search;

    try {
      const { data, total } = await this.ordersService.findAllWithPaginationOrders(page, limit, search);
      return HandleResponse.buildSuccessObj(EC200, EM106, {
        data,
        total,
        page,
        limit,
      });
    } catch (error) {
      throw error; 
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.ordersService.findOneOrder(+id);
      return HandleResponse.buildSuccessObj(EC200, EM106, data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    try {
      await this.ordersService.updateOrder(+id, updateOrderDto);
      const data = await this.ordersService.findOneOrder(+id);
      return HandleResponse.buildSuccessObj(EC200, EM116, data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.ordersService.removeOrder(+id);
      return HandleResponse.buildSuccessObj(EC204, EM127, null);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private handleError(error: any) {
    if (error instanceof HttpException) {
      return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
    }
    if (error.message?.includes('not found')) {
      return HandleResponse.buildErrObj(EC404, EM119, error);
    }
    return HandleResponse.buildErrObj(EC500, EM100, error);
  }
}