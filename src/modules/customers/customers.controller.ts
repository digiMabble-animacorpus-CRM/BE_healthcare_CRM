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
import { ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import HandleResponse from 'src/core/utils/handle_response';
import { EC200, EC201, EC204, EC500, EM100, EM104, EM106, EM116, EM127 } from 'src/core/constants';
import { PaginationDto } from 'src/core/interfaces/shared.dto';
import { AES } from 'src/core/utils//encryption.util';
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';

@ApiTags('Customers')
@Controller('customers')
// @UseInterceptors(ClassSerializerInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

 @Post()
async create(@Body() reqBody: any) {
  try {
    let decryptedObject;

    //  Support encrypted payload
    if (reqBody.data) {
      const decryptedString = AES.decrypt(reqBody.data); // AES decryption
      decryptedObject = JSON.parse(decryptedString);
    } else {
      decryptedObject = reqBody; // plain input (e.g., Postman)
    }

    //  Transform and validate against CreateCustomerDto
    const createCustomerDto = plainToClass(CreateCustomerDto, decryptedObject);
    await validateOrReject(createCustomerDto);

    //  Create customer
    const data = await this.customersService.create(createCustomerDto);
    return HandleResponse.buildSuccessObj(EC201, EM104, data);

  } catch (error) {
    if (error instanceof HttpException) {
      return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
    }

    //  Log detailed validation error if needed
    console.error('Create customer error:', error);
    return HandleResponse.buildErrObj(EC500, EM100, error);
  }
}

@Get()
async findAll(@Query() queryParams: any) {
  try {
    let decryptedObject;
    // Support encrypted or plain input
    if (queryParams.data) {
      const decryptedString = AES.decrypt(queryParams.data); // Your decrypt method
      decryptedObject = JSON.parse(decryptedString);
      console.log('Decrypted GET query:', decryptedObject);
    } else {
      decryptedObject = queryParams;
      console.log('Plain GET query:', decryptedObject);
    }

    // Manually map decryptedObject to DTO
    const paginationDto = plainToClass(PaginationDto, decryptedObject);
    await validateOrReject(paginationDto);

    if (paginationDto.pagNo && paginationDto.limit) {
      const { data, total } = await this.customersService.findAllWithPaginationCustomer(
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
      return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
    }
    return HandleResponse.buildErrObj(EC500, EM100, error);
  }
}


@Get(':id')
async findOne(@Param('id') id: string, @Query('data') encryptedData?: string) {
  try {
    let customerId: number;

    if (encryptedData) {
      // Encrypted data received, decrypt it
      const decryptedString = AES.decrypt(encryptedData); // Use your AES.decrypt method
      const decryptedObject = JSON.parse(decryptedString);
      console.log('Decrypted findOne data:', decryptedObject);

      if (!decryptedObject.id) {
        throw new BadRequestException('Missing "id" in encrypted data');
      }

      customerId = parseInt(decryptedObject.id, 10);
    } else {
      // Plain ID received (Postman-style)
      customerId = parseInt(id, 10);
    }

    if (isNaN(customerId)) {
      throw new BadRequestException('Invalid customer ID');
    }

    const data = await this.customersService.findOne(customerId);
    return HandleResponse.buildSuccessObj(EC200, EM106, data);

  } catch (error) {
    console.error('FindOne error:', error);
    if (error instanceof HttpException) {
      return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
    }
    return HandleResponse.buildErrObj(EC500, EM100, error);
  }
}


@Patch(':id')
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() reqBody: any,
) {
  try {
    let decryptedObject;

    if (reqBody.data) {
      // Encrypted input (e.g., from frontend)
      const decryptedString = AES.decrypt(reqBody.data); // Replace with your actual AES.decrypt method
      decryptedObject = JSON.parse(decryptedString);
      console.log('Decrypted update body:', decryptedObject);
    } else {
      // Plain input (e.g., from Postman)
      decryptedObject = reqBody;
      console.log('Plain update body:', decryptedObject);
    }

    const dto = plainToClass(UpdateCustomerDto, decryptedObject);
    await validateOrReject(dto);

    const data = await this.customersService.updateCustomer(id, dto);
    return HandleResponse.buildSuccessObj(EC200, EM116, data);

  } catch (error) {
    console.error('Update error:', error);

    if (error instanceof HttpException) {
      return HandleResponse.buildErrObj(error.getStatus(), error.message, error);
    }
    return HandleResponse.buildErrObj(EC500, EM100, error);
  }
}


 @Delete(':id')
async remove(@Param('id', ParseIntPipe) id: number, @Body() reqBody: any) {
  try {
    if (reqBody?.data) {
      const decrypted = AES.decrypt(reqBody.data);
      console.log('Decrypted delete body (if any):', JSON.parse(decrypted));
    } else {
      console.log('Delete called without body encryption.');
    }

    await this.customersService.removeCustomer(id);
    return HandleResponse.buildSuccessObj(EC204, EM127, null);

  } catch (error) {
    console.error('Delete error:', error);
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