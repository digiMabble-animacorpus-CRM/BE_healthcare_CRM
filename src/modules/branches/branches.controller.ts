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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';

@ApiTags('Branches')
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new branch' })
  @ApiResponse({ status: 201, description: 'The branch has been successfully created.', type: Branch })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 409, description: 'Branch with this email already exists.' })
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all branches' })
  @ApiResponse({ status: 200, description: 'A list of all branches.', type: [Branch] })
  findAll() {
    return this.branchesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single branch by ID' })
  @ApiResponse({ status: 200, description: 'Branch details.', type: Branch })
  @ApiResponse({ status: 404, description: 'Branch not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.branchesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a branch' })
  @ApiResponse({ status: 200, description: 'The branch has been successfully updated.', type: Branch })
  @ApiResponse({ status: 404, description: 'Branch not found.' })
  @ApiResponse({ status: 409, description: 'Branch with this email already exists.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) //
  @ApiOperation({ summary: 'Delete a branch' })
  @ApiResponse({ status: 204, description: 'The branch has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Branch not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.branchesService.remove(id);
  }
}