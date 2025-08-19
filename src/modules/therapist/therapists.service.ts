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
    const therapist = this.therapistRepository.create({
      ...dto,
      is_delete: false,
      deleted_at: null,
    });
    return this.therapistRepository.save(therapist);
  }

  // GET ALL
  async findAll(): Promise<Therapist[]> {
    return this.therapistRepository.find({
      where: { is_delete: false },
    });
  }

  // GET BY ID
  async findOne(key: number): Promise<Therapist> {
    const therapist = await this.therapistRepository.findOne({
      where: { _key: key, is_delete: false },
    });
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
    therapist.is_delete = true;
    therapist.deleted_at = new Date();
    await this.therapistRepository.save(therapist);
    return { deleted: true };
  }

  // DELETE ALL
  // async removeAll(): Promise<{ deleted: boolean }> {
  //   await this.therapistRepository.clear();
  //   return { deleted: true };
  // }

  // FIND BY EMAIL (if you later add email field)
async findOneByEmail(email: string): Promise<Therapist> {
  const therapist = await this.therapistRepository.findOne({
    // where: { contact_email: email, is_delete: false },
  });

  if (!therapist) throw new NotFoundException(`Therapist with email ${email} not found`);
  return therapist;
}




    async restore(key: number): Promise<Therapist> {
    const therapist = await this.therapistRepository.findOne({
      where: { _key: key, is_delete: true },
    });
    if (!therapist) throw new NotFoundException(`Therapist with key ${key} not found or not deleted`);

    therapist.is_delete = false;
    therapist.deleted_at = null;
    return this.therapistRepository.save(therapist);
  }


}
