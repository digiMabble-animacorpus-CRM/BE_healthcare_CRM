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
  BadRequestException,
  NotFoundException,
  UseGuards,
  Req,
  
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffFilterDto } from './dto/staff-filter.dto';
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
import { AES } from 'src/core/utils/encryption.util';
import { validateOrReject  } from 'class-validator';
import { plainToClass,plainToInstance } from 'class-transformer';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import {  enc } from 'crypto-js';
import * as CryptoJS from 'crypto-js';
import { Between, ILike, FindManyOptions } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { logger } from 'src/core/utils/logger';



@ApiTags('Staff')
@UseGuards(AuthGuard('jwt'),PermissionGuard, RolesGuard) //  Apply both guards globally
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

@Post()
@UseGuards(AuthGuard('jwt'), PermissionGuard, RolesGuard)
@Permissions('create:staff')
@Roles('super-admin', 'branch-admin')
@ApiOperation({ summary: 'Create a new staff' })
@ApiBody({ type: CreateStaffDto })
async create(@Body() reqBody: any, @Req() req)  {
  console.log(' Incoming staff body:', reqBody);
 console.log(' Current user role:', req.user?.user_type);
  try {
    //  Step 1: Decrypt if "data" field exists
    const decryptedPayload = reqBody.data
      ? AES.decrypt(reqBody.data)
      : reqBody;

    //  Step 2: Ensure it's a valid object
    if (typeof decryptedPayload !== 'object' || Array.isArray(decryptedPayload)) {
      throw new BadRequestException('Decrypted payload must be a valid object');
    }

    //  Step 3: Normalize optional fields
    if (decryptedPayload.address?.zipcode && !decryptedPayload.address.zip_code) {
      decryptedPayload.address.zip_code = decryptedPayload.address.zipcode;
    }

    //  Step 4: Provide defaults if needed
    decryptedPayload.certification_files ??= [];
    decryptedPayload.availability ??= [];
    decryptedPayload.permissions ??= [];

    //  Step 5: Validate DTO
    const dto = plainToInstance(CreateStaffDto, decryptedPayload, {
      enableImplicitConversion: true,
    });
    await validateOrReject(dto);

    if (!dto.access_level) {
      throw new BadRequestException('Access level is required');
    }

    const accessLevel = dto.access_level.toLowerCase();

    //  Step 6: Save to DB
    const data = await this.staffService.createStaff({ ...dto, access_level: accessLevel }, req.user);

    return HandleResponse.buildSuccessObj(EC201, EM104, data);
  } catch (error) {
    console.error(' Staff Create Error:', error);
    return HandleResponse.buildErrObj(
      error.status || EC500,
      EM100,
      error.message || error,
    );
  }
}



@Get()
@Permissions('read:staff')
@Roles('super-admin', 'branch-admin')
@ApiOperation({ summary: 'Get all staff' })
@ApiQuery({ name: 'data', required: true, description: 'Encrypted filters' })
async findAll(@Query('data') encryptedData: string) {
  try {
    //  Decrypt the input query
    const decryptedStr = CryptoJS.AES.decrypt(encryptedData, process.env.AES_SECRET_KEY).toString(CryptoJS.enc.Utf8);
    const decrypted = JSON.parse(decryptedStr);

    const page = parseInt(decrypted.page, 10) || 1;
    const limit = parseInt(decrypted.limit, 10) || 10;
    const { branch, from, to, search } = decrypted;

    const where: any = { is_deleted: false };

    if (branch) {
      where.selected_branch = { id: branch };
    }

    if (from && to) {
      where.created_at = Between(new Date(from), new Date(to));
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

   const filterDto: StaffFilterDto = {
  page: page.toString(),
  limit: limit.toString(),
  searchText: search,
  branch,
  fromDate: from,
  toDate: to,
};

const { data, total } = await this.staffService.findAllWithFilters(filterDto);

    const response = {
      data,
      totalCount: total,
    };

    //  Encrypt the response
    const encryptedResponse = CryptoJS.AES.encrypt(JSON.stringify(response), process.env.AES_SECRET_KEY).toString();
    return encryptedResponse;

  } catch (error) {
    console.error('StaffController Decrypt Error:', error);
    throw new BadRequestException('Invalid encrypted query or bad format');
  }
}



@Get(':id')
@UseGuards(AuthGuard('jwt'), PermissionGuard, RolesGuard)
@Permissions('read:staff')
@Roles('super-admin', 'branch-admin')
@ApiOperation({ summary: 'Get staff by ID (AES Encrypted)' })
@ApiParam({ name: 'id', type: String, description: 'AES Encrypted Staff ID' })
async findOne(@Param('id') encryptedId: string) {
  try {
    logger.debug(` Encrypted ID received: ${encryptedId}`);

    // Normalize input (replace URL-encoded chars)
    const normalizedId = decodeURIComponent(encryptedId).replace(/ /g, '+');

    // Decrypt using AES utility
    const decrypted = AES.decrypt(normalizedId);
    logger.debug(` Decrypted ID: ${decrypted}`);

    const id = Number(decrypted);
    if (!id || isNaN(id)) {
      logger.warn(` Invalid ID after decryption: "${decrypted}"`);
      throw new BadRequestException('Invalid decrypted staff ID');
    }

    logger.debug(` Searching for staff with ID: ${id}`);
    const staff = await this.staffService.findOne(id);

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    logger.debug(` Staff fetched: ${JSON.stringify(staff)}`);
    return HandleResponse.buildSuccessObj(EC200, EM106, staff);

  } catch (error) {
    logger.error(` Error in findOne: ${error.message}`);
    return HandleResponse.buildErrObj(
      error.status || EC500,
      error.message || EM100,
      [],
    );
  }
}




@Patch(':id')
@UseGuards(AuthGuard('jwt'), PermissionGuard, RolesGuard)
@Permissions('update:staff')
@Roles('super-admin', 'branch-admin')
@ApiOperation({ summary: 'Update a staff member by encrypted ID (AES)' })
@ApiParam({ name: 'id', type: String, description: 'AES Encrypted Staff ID' })
async update(@Param('id') encryptedId: string, @Body() reqBody: any) {
  try {
    //  Step 1: Decrypt the encrypted ID from URL
    const normalizedId = decodeURIComponent(encryptedId).replace(/ /g, '+');
    const decryptedId = AES.decrypt(normalizedId);
    const id = Number(decryptedId);

    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid decrypted staff ID');
    }

    //  Step 2: Decrypt the body if encrypted
    const decryptedBody = reqBody?.data
      ? AES.decrypt(reqBody.data)
      : reqBody;

    //  Step 3: Transform + Validate
    const dto = plainToClass(UpdateStaffDto, decryptedBody);
    await validateOrReject(dto);

    //  Step 4: Update
    const data = await this.staffService.updateStaff(id, dto);
    return HandleResponse.buildSuccessObj(EC200, EM116, data);
  } catch (error) {
    console.error(' Staff Update Error:', error);
    return HandleResponse.buildErrObj(
      error.status || EC500,
      EM100,
      error.message || error,
    );
  }
}


  @Delete(':id')
  @UseGuards(AuthGuard('jwt'),PermissionGuard, RolesGuard)
  @Permissions('delete:staff')
  @Roles('super-admin') // Only super-admin can delete
  @ApiOperation({ summary: 'Soft delete staff' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.staffService.removeStaff(id);
      return HandleResponse.buildSuccessObj(EC204, EM127, null);
    } catch (error) {
      return HandleResponse.buildErrObj(
        error.status || EC500,
        EM100,
        error.message || error,
      );
    }
  }
}
