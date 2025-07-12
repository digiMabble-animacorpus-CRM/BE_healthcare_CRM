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
  UseGuards,
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
import { validateOrReject } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Staff')
@UseGuards(AuthGuard('jwt'),PermissionGuard, RolesGuard) //  Apply both guards globally
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @Permissions('create:staff')
  @Roles('super-admin', 'branch-admin') //  Only these roles can create
  @ApiOperation({ summary: 'Create a new staff' })
  @ApiBody({ type: CreateStaffDto })
  async create(@Body() reqBody: any) {
    console.log('StaffController received body:', reqBody);
    try {
      const decrypted = reqBody.data
        ? JSON.parse(AES.decrypt(reqBody.data))
        : reqBody;
      const dto = plainToClass(CreateStaffDto, decrypted);
      await validateOrReject(dto);
      const data = await this.staffService.create(dto);
      return HandleResponse.buildSuccessObj(EC201, EM104, data);
    } catch (error) {
      return HandleResponse.buildErrObj(
        error.status || EC500,
        EM100,
        error.message || error,
      );
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'),PermissionGuard, RolesGuard)
  @Permissions('read:staff')
  @Roles('super-admin', 'branch-admin', 'staff')
  @ApiOperation({ summary: 'Get all staff (paginated)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(@Query() queryParams: any) {
    try {
      const decrypted = queryParams.data
        ? JSON.parse(AES.decrypt(queryParams.data))
        : queryParams;
      const dto = plainToClass(StaffFilterDto, decrypted);
      await validateOrReject(dto);

      if (dto.page && dto.limit) {
        const { data, total } = await this.staffService.searchWithFilters(dto);
        return HandleResponse.buildSuccessObj(EC200, EM106, { data, total });
      }

      const data = await this.staffService.findAll();
      return HandleResponse.buildSuccessObj(EC200, EM106, data);
    } catch (error) {
      return HandleResponse.buildErrObj(
        error.status || EC500,
        EM100,
        error.message || error,
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'),PermissionGuard, RolesGuard)
  @Permissions('read:staff')
  @Roles('super-admin', 'branch-admin')
  @ApiOperation({ summary: 'Get staff by ID' })
  @ApiParam({ name: 'id', type: Number })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const data = await this.staffService.findOne(id);
      return HandleResponse.buildSuccessObj(EC200, EM106, data);
    } catch (error) {
      return HandleResponse.buildErrObj(
        error.status || EC500,
        EM100,
        error.message || error,
      );
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'),PermissionGuard, RolesGuard)
  @Permissions('update:staff')
  @Roles('super-admin', 'branch-admin')
  @ApiOperation({ summary: 'Update staff' })
  @ApiParam({ name: 'id', type: Number })
  async update(@Param('id', ParseIntPipe) id: number, @Body() reqBody: any) {
    try {
      const decrypted = reqBody.data
        ? JSON.parse(AES.decrypt(reqBody.data))
        : reqBody;
      const dto = plainToClass(UpdateStaffDto, decrypted);
      await validateOrReject(dto).catch((err) => {
        throw new BadRequestException(err);
      });

      const data = await this.staffService.updateStaff(id, dto);
      return HandleResponse.buildSuccessObj(EC200, EM116, data);
    } catch (error) {
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
