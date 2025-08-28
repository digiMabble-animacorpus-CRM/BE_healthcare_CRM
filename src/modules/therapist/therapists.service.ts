import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Therapist } from './entities/therapist.entity';
import { Language } from 'src/modules/language/entities/language.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Specialization } from 'src/modules/specialization/entities/specialization.entity';
import { CreateTherapistDto } from './dto/create-therapist.dto';
import { UpdateTherapistDto } from './dto/update-therapist.dto';
import { TherapistFilterDto } from './dto/therapist-filter.dto';

@Injectable()
export class TherapistService {
  constructor(
    @InjectRepository(Therapist)
    private therapistRepository: Repository<Therapist>,

    @InjectRepository(Language)
    private languageRepository: Repository<Language>,

    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,

    @InjectRepository(Specialization)
    private specializationRepository: Repository<Specialization>,
  ) {}

  // CREATE
  async create(dto: CreateTherapistDto): Promise<Therapist> {
    // Handle languages
    const languages = await Promise.all(
      (dto.languages || []).map(async (name) => {
        let lang = await this.languageRepository.findOne({ where: { name } });
        if (!lang) {
          lang = this.languageRepository.create({ name });
          lang = await this.languageRepository.save(lang);
        }
        return lang;
      }),
    );

    // Handle branches
    const branches = dto.branches?.length
      ? await this.branchRepository.findBy({ branch_id: In(dto.branches) })
      : [];

    // Handle specializations
    const specializations = dto.specializations?.length
      ? await this.specializationRepository.findBy({ specialization_id: In(dto.specializations) })
      : [];

    const therapist = this.therapistRepository.create({
      ...dto,
      languages,
      branches,
      specializations,
      isDelete: false,
      deletedAt: null,
    });

    return this.therapistRepository.save(therapist);
  }

  // GET ALL WITH FILTERS
async findAll(filter?: TherapistFilterDto): Promise<Therapist[]> {
  const query = this.therapistRepository
    .createQueryBuilder('therapist')
    .leftJoinAndSelect('therapist.languages', 'language')
    .leftJoinAndSelect('therapist.branches', 'branch')
    .leftJoinAndSelect('therapist.specializations', 'specialization')
    .where('therapist.is_delete = false');

  // Search text
  if (filter?.searchText) {
    query.andWhere(
      `(therapist.first_name ILIKE :term 
        OR therapist.last_name ILIKE :term 
        OR therapist.full_name ILIKE :term 
        OR therapist.about_me ILIKE :term 
        OR language.name ILIKE :term 
        OR branch.name ILIKE :term 
        OR specialization.description ILIKE :term)`,
      { term: `%${filter.searchText}%` },
    );
  }

  // Department filter
  if (filter?.departmentId) {
    query.andWhere('therapist.department_id = :departmentId', {
      departmentId: filter.departmentId,
    });
  }

  // Specialization filter
  if (filter?.specializationIds?.length) {
    query.andWhere('specialization.specialization_id IN (:...specializationIds)', {
      specializationIds: filter.specializationIds,
    });
  }

  // Branch filter
  if (filter?.branchIds?.length) {
    query.andWhere('branch.branch_id IN (:...branchIds)', {
      branchIds: filter.branchIds,
    });
  }
  if (filter?.branchName) {
    query.andWhere('branch.name ILIKE :branchName', {
      branchName: `%${filter.branchName}%`,
    });
  }

  // Language filter
  if (filter?.languageIds?.length) {
    query.andWhere('language.id IN (:...languageIds)', {
      languageIds: filter.languageIds,
    });
  }

  // Pagination
  if (filter?.page && filter?.limit) {
    const page = Number(filter.page);
    const limit = Number(filter.limit);
    query.skip((page - 1) * limit).take(limit);
  }

  return query.getMany();
}


  // SEARCH (free text)
  async search(term: string): Promise<Therapist[]> {
    if (!term) return [];
    return this.therapistRepository
      .createQueryBuilder('therapist')
      .leftJoinAndSelect('therapist.languages', 'language')
      .leftJoinAndSelect('therapist.branches', 'branch')
      .leftJoinAndSelect('therapist.specializations', 'specialization')
      .where('therapist.is_delete = false')
      .andWhere(
        `(therapist.first_name ILIKE :term OR therapist.last_name ILIKE :term OR therapist.full_name ILIKE :term OR language.name ILIKE :term OR branch.name ILIKE :term OR specialization.description ILIKE :term)`,
        { term: `%${term}%` },
      )
      .getMany();
  }

  // GET BY ID
  async findOne(id: number): Promise<Therapist> {
    const therapist = await this.therapistRepository.findOne({
      where: { therapistId: id, isDelete: false },
      relations: ['languages', 'branches', 'specializations'],
    });
    if (!therapist) throw new NotFoundException(`Therapist with ID ${id} not found`);
    return therapist;
  }

  // UPDATE
  async update(id: number, dto: UpdateTherapistDto): Promise<Therapist> {
    const therapist = await this.findOne(id);

    // Handle languages
    let languages = therapist.languages;
    if (dto.languages?.length) {
      languages = await Promise.all(
        dto.languages.map(async (name) => {
          let lang = await this.languageRepository.findOne({ where: { name } });
          if (!lang) {
            lang = this.languageRepository.create({ name });
            lang = await this.languageRepository.save(lang);
          }
          return lang;
        }),
      );
    }

    // Handle branches
    let branches = therapist.branches;
    if (dto.branches?.length) {
      branches = await this.branchRepository.findBy({ branch_id: In(dto.branches) });
    }

    // Handle specializations
    let specializations = therapist.specializations;
    if (dto.specializations?.length) {
      specializations = await this.specializationRepository.findBy({
        specialization_id: In(dto.specializations),
      });
    }

    Object.assign(therapist, {
      ...dto,
      languages,
      branches,
      specializations,
    });

    return this.therapistRepository.save(therapist);
  }

  // SOFT DELETE
  async remove(id: number): Promise<{ deleted: boolean }> {
    const therapist = await this.findOne(id);
    therapist.isDelete = true;
    therapist.deletedAt = new Date();
    await this.therapistRepository.save(therapist);
    return { deleted: true };
  }

  // RESTORE
  async restore(id: number): Promise<Therapist> {
    const therapist = await this.therapistRepository.findOne({
      where: { therapistId: id, isDelete: true },
    });
    if (!therapist) throw new NotFoundException(`Therapist with ID ${id} not found or not deleted`);

    therapist.isDelete = false;
    therapist.deletedAt = null;
    return this.therapistRepository.save(therapist);
  }
}
