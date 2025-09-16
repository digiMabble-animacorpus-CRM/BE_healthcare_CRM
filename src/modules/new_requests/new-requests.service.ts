import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewRequest } from './entities/new-request.entity';

@Injectable()
export class NewRequestsService {
  constructor(
    @InjectRepository(NewRequest)
    private readonly newRequestRepository: Repository<NewRequest>,
  ) {}

  async findAll(): Promise<NewRequest[]> {
    return this.newRequestRepository.find();
  }

  async findOne(id: number): Promise<NewRequest> {
    return this.newRequestRepository.findOneBy({ id });
  }
}
