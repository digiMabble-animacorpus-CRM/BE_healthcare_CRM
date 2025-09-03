import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { BranchGuard } from 'src/common/guards/branch.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@ApiTags('Branches')
@UseGuards(JwtAuthGuard, RolesGuard, PermissionGuard, BranchGuard)
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles('super_admin', 'admin')
  @Permissions({ module: 'branches', action: 'create' })
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiResponse({
    status: 201,
    description: 'The branch has been successfully created.',
    type: Branch,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({
    status: 409,
    description: 'Branch with this email already exists.',
  })
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  @Roles('super_admin', 'admin')
  @Permissions({ module: 'branches', action: 'view' })
  @ApiOperation({ summary: 'Retrieve all branches with pagination and search' })
  @ApiResponse({
    status: 200,
    description: 'A list of all branches.',
    type: [Branch],
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name, email, or phone', type: String, example: 'John Doe' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.branchesService.findAll(page, limit, search);
  }

  @Get(':id')
  @Roles('super_admin', 'admin')
  @Permissions({ module: 'branches', action: 'view' })
  @ApiOperation({ summary: 'Retrieve a single branch by ID' })
  @ApiResponse({ status: 200, description: 'Branch details.', type: Branch })
  @ApiResponse({ status: 404, description: 'Branch not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.branchesService.findOne(id);
  }

  @Patch(':id')
  @Roles('super_admin', 'admin')
  @Permissions({ module: 'branches', action: 'edit' })
  @ApiOperation({ summary: 'Update a branch' })
  @ApiResponse({
    status: 200,
    description: 'The branch has been successfully updated.',
    type: Branch,
  })
  @ApiResponse({ status: 404, description: 'Branch not found.' })
  @ApiResponse({
    status: 409,
    description: 'Branch with this email already exists.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBranchDto: UpdateBranchDto,
  ) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @Roles('super_admin')
  @Permissions({ module: 'branches', action: 'delete' })
  @HttpCode(HttpStatus.NO_CONTENT) //
  @ApiOperation({ summary: 'Delete a branch' })
  @ApiResponse({
    status: 204,
    description: 'The branch has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Branch not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.branchesService.remove(id);
  }
}