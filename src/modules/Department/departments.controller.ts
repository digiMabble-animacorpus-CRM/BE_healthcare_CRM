import { Controller, Get, Post, Body, Param, Patch , Delete , Query,UseGuards} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';


@ApiTags('Departments')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Roles('super_admin', 'admin')
  @Permissions({ module: 'departments', action: 'create' })
  @ApiOperation({ summary: 'Create a new department' })
  @ApiResponse({ status: 201, description: 'Department created successfully', type: Department })
  async create(@Body() dto: CreateDepartmentDto) {
    return await this.departmentsService.create(dto);
  }



@Get()
@Roles('super_admin', 'admin')
  @Permissions({ module: 'departments', action: 'view' })
@ApiOperation({ summary: 'Get departments (optionally filtered by branch)' })
  @ApiResponse({ status: 200, description: 'List of departments', type: [Department] })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
async findAll(
  @Query('branchId') branchId?: number,
  @Query('search') search?: string
) {
  return this.departmentsService.findAllFiltered(branchId, search);
}

  @Get(':id')
   @Roles('super_admin', 'admin')
  @Permissions({ module: 'departments', action: 'view' })
  @ApiOperation({ summary: 'Get department by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Department fetched successfully', type: Department })
  @ApiResponse({ status: 404, description: 'Department not found' })
  async findOne(@Param('id') id: string) {
    return await this.departmentsService.findOne(+id);
  }

  @Patch(':id') // 👈 changed from PUT → PATCH
   @Roles('super_admin', 'admin')
  @Permissions({ module: 'departments', action: 'view' })
  @ApiOperation({ summary: 'Update department by ID (partial update)' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Department updated successfully', type: Department })
  async update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return await this.departmentsService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('super_admin') // ❌ only super_admin can delete
  @Permissions({ module: 'departments', action: 'delete' })
  @ApiOperation({ summary: 'Delete department by ID' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiResponse({ status: 200, description: 'Department deleted successfully' })
  async remove(@Param('id') id: string) {
    return await this.departmentsService.remove(+id);
  }
}
