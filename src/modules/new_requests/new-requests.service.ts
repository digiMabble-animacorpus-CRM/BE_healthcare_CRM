import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewRequest } from './entities/new-request.entity';
import { AppointmentManagement } from './entities/appointment-management.entity';

@Injectable()
export class NewRequestsService {
  constructor(
    @InjectRepository(NewRequest)
    private readonly newRequestRepository: Repository<NewRequest>,
    @InjectRepository(AppointmentManagement)
    private readonly appointmentRepository: Repository<AppointmentManagement>,
  ) {}

  async findAll(): Promise<NewRequest[]> {
    return this.newRequestRepository.find();
  }

  async findOne(id: number): Promise<NewRequest> {
    return this.newRequestRepository.findOneBy({ id });
  }


  async getCombinedData() {
    const newRequests = await this.newRequestRepository.find();
    const appointments = await this.appointmentRepository.find();

    return {
      new_requests: newRequests,
      appointment_management: appointments,
    };
  }
}
