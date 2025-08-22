import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TherapistService } from './therapists.service';
import { CreateTherapistDto } from './dto/create-therapist.dto';
import { UpdateTherapistDto } from './dto/update-therapist.dto';
import { TherapistFilterDto } from './dto/therapist-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Therapist } from './entities/therapist.entity';

@ApiTags('Therapists')
@UseGuards(AuthGuard('jwt')) // Protect all routes
@Controller('therapists')
export class TherapistController {
  constructor(private readonly therapistService: TherapistService) {}

  // CREATE
  @Post()
  // @Permissions('create:therapist')
  // @Roles('super-admin', 'branch-admin')
  @ApiOperation({ summary: 'Create a new therapist' })
  @ApiBody({ type: CreateTherapistDto })
  @ApiResponse({ status: 201, description: 'Therapist created successfully', type: Therapist })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() dto: CreateTherapistDto): Promise<Therapist> {
    console.log('📥 Incoming DTO:', dto);
    return this.therapistService.create(dto);
  }

  // GET ALL
  @Get()
  // @Permissions('read:therapist')
  // @Roles('super-admin', 'branch-admin')
  @ApiOperation({ summary: 'Get all therapists' })
  @ApiResponse({ status: 200, description: 'List of therapists', type: [Therapist] })
  async findAll(): Promise<Therapist[]> {
    return this.therapistService.findAll();
  }

  // GET BY ID
  @Get(':key')
  // @Permissions('read:therapist')
  // @Roles('super-admin', 'branch-admin')
  @ApiOperation({ summary: 'Get a therapist by key' })
  @ApiParam({ name: 'key', type: Number, description: 'Therapist key' })
  @ApiResponse({ status: 200, description: 'Therapist found', type: Therapist })
  @ApiResponse({ status: 404, description: 'Therapist not found' })
  async findOne(@Param('key', ParseIntPipe) key: number) {
    return this.therapistService.findOne(key);
  }

  // PATCH / UPDATE
  @Patch(':key')
  // @Permissions('update:therapist')
  // @Roles('super-admin', 'branch-admin')
  @ApiOperation({ summary: 'Update a therapist by key' })
  @ApiParam({ name: 'key', type: Number })
  @ApiBody({ type: UpdateTherapistDto })
  @ApiResponse({ status: 200, description: 'Therapist updated successfully', type: Therapist })
  @ApiResponse({ status: 404, description: 'Therapist not found' })
  async update(
    @Param('key', ParseIntPipe) key: number,
    @Body() dto: UpdateTherapistDto,
  ): Promise<Therapist> {
    return this.therapistService.update(key, dto);
  }


   @Get('search')
  @ApiOperation({ summary: 'Search therapists by name, job title, or specialization' })
  @ApiQuery({
    name: 'q',
    required: true,
    description: 'Search keyword (name, job title, specialization, etc.)',
    example: 'psychologist',
  })
  @ApiResponse({
    status: 200,
    description: 'List of therapists matching search criteria',
    type: Therapist,
    isArray: true,
  })
  async search(@Query('q') q: string) {
    if (!q) {
      return [];
    }
    return this.therapistService.search(q);
  }



  // DELETE BY ID
  @Delete(':key')
  // @Permissions('delete:therapist')
  // @Roles('super-admin', 'branch-admin')
  @ApiOperation({ summary: 'Delete a therapist by key' })
  @ApiParam({ name: 'key', type: Number })
  @ApiResponse({ status: 200, description: 'Therapist deleted successfully' })
  @ApiResponse({ status: 404, description: 'Therapist not found' })
  async remove(@Param('key', ParseIntPipe) key: number): Promise<{ deleted: boolean }> {
    return this.therapistService.remove(key);
  }

  // DELETE ALL
  // @Delete()
  // // @Permissions('delete:therapist')
  // // @Roles('super-admin', 'branch-admin')
  // @ApiOperation({ summary: 'Delete all therapists' })
  // @ApiResponse({ status: 200, description: 'All therapists deleted successfully' })
  // async removeAll(): Promise<{ deleted: boolean }> {
  //   return this.therapistService.removeAll();
  // }



@Patch(':key/restore')
@ApiOperation({ summary: 'Restore a soft-deleted therapist' })
@ApiParam({ name: 'key', type: Number })
async restore(@Param('key', ParseIntPipe) key: number): Promise<Therapist> {
  return this.therapistService.restore(key);
}

}
