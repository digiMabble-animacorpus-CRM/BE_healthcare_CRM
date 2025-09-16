import { Controller, Get, Param } from '@nestjs/common';
import { NewRequestsService } from './new-requests.service';
import { NewRequest } from './entities/new-request.entity';

@Controller('new-requests')
export class NewRequestsController {
  constructor(private readonly newRequestsService: NewRequestsService) {}

  @Get()
  async getAll(): Promise<NewRequest[]> {
    return this.newRequestsService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: number): Promise<NewRequest> {
    return this.newRequestsService.findOne(id);
  }
}
