import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Therapist } from './entities/therapist.entity';
import { CreateTherapistDto } from './dto/create-therapist.dto';
import { UpdateTherapistDto } from './dto/update-therapist.dto';

@Injectable()
export class TherapistService {
  constructor(
    @InjectRepository(Therapist)
    private therapistRepository: Repository<Therapist>,
  ) {}

  // CREATE
  async create(dto: CreateTherapistDto): Promise<Therapist> {
    console.log('DTO Received:', dto);   // debug incoming values
    const therapist = this.therapistRepository.create(dto);
    console.log('Entity Before Save:', therapist);  // check mapping
    return this.therapistRepository.save(therapist);
  }

  // GET ALL
  async findAll(): Promise<Therapist[]> {
    return this.therapistRepository.find();
  }

  // GET BY ID
  async findOne(key: number): Promise<Therapist> {
    const therapist = await this.therapistRepository.findOneBy({ _key: key });
    if (!therapist) throw new NotFoundException(`Therapist with key ${key} not found`);
    return therapist;
  }

  // PATCH / UPDATE
  async update(key: number, dto: UpdateTherapistDto): Promise<Therapist> {
    const therapist = await this.findOne(key);
    Object.assign(therapist, dto);
    return this.therapistRepository.save(therapist);
  }

  // DELETE ONE
  async remove(key: number): Promise<{ deleted: boolean }> {
    const therapist = await this.findOne(key);
    await this.therapistRepository.remove(therapist);
    return { deleted: true };
  }

  // DELETE ALL
  async removeAll(): Promise<{ deleted: boolean }> {
    await this.therapistRepository.clear();
    return { deleted: true };
  }

  // FIND BY EMAIL (if you later add email field)
  async findOneByEmail(email: string): Promise<Therapist> {
    const therapist = await this.therapistRepository.findOne({
      // where: { contactEmail: email }, // adjust when you have a field for email
    });

    if (!therapist) throw new NotFoundException(`Therapist with email ${email} not found`);
    return therapist;
  }
}
