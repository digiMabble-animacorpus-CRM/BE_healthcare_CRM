import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Therapist } from './entities/therapist.entity';
import { Language } from 'src/modules/Language/entities/Language.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
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

    // Handle branches (ManyToMany)
    const branches = dto.branches?.length
      ? await this.branchRepository.findBy({ branch_id: In(dto.branches) })
      : [];

    const therapist = this.therapistRepository.create({
      ...dto,
      specializationIds: dto.specializationIds ?? [],
      languages,
      branches,
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
      .where('therapist.is_delete = false');

    // Search by text
    if (filter?.searchText) {
      query.andWhere(
        `(therapist.first_name ILIKE :term OR therapist.last_name ILIKE :term OR therapist.full_name ILIKE :term OR therapist.about_me ILIKE :term)`,
        { term: `%${filter.searchText}%` },
      );
    }

    // Filter by department
    if (filter?.departmentId) {
      query.andWhere('therapist.department_id = :departmentId', {
        departmentId: filter.departmentId,
      });
    }

    // Specialization filter
    if (filter?.specializationIds?.length) {
      query.andWhere('therapist.specialization_ids && :specializationIds', {
        specializationIds: filter.specializationIds,
      });
    }

    // Language filter by IDs
    if (filter?.languageIds?.length) {
      query.andWhere('language.id IN (:...languageIds)', {
        languageIds: filter.languageIds,
      });
    }

    // Branch filter by ID or name
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

    // Pagination
    if (filter?.page && filter?.limit) {
      const page = parseInt(filter.page, 10);
      const limit = parseInt(filter.limit, 10);
      query.skip((page - 1) * limit).take(limit);
    }

    return query.getMany();
  }

  // SEARCH (free text in name, specialization_ids, language_ids, branches)
  async search(term: string): Promise<Therapist[]> {
    if (!term) return [];
    return this.therapistRepository
      .createQueryBuilder('therapist')
      .leftJoinAndSelect('therapist.languages', 'language')
      .leftJoinAndSelect('therapist.branches', 'branch')
      .where('therapist.is_delete = false')
      .andWhere(
        `(therapist.first_name ILIKE :term 
          OR therapist.last_name ILIKE :term 
          OR therapist.full_name ILIKE :term
          OR therapist.specialization_ids::text ILIKE :term 
          OR language.name ILIKE :term 
          OR branch.name ILIKE :term)`,
        { term: `%${term}%` },
      )
      .getMany();
  }

  // GET BY ID
  async findOne(id: number): Promise<Therapist> {
    const therapist = await this.therapistRepository.findOne({
      where: { therapistId: id, isDelete: false },
      relations: ['languages', 'branches'],
    });
    if (!therapist) {
      throw new NotFoundException(`Therapist with ID ${id} not found`);
    }
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

    Object.assign(therapist, {
      ...dto,
      specializationIds: dto.specializationIds ?? therapist.specializationIds,
      languages,
      branches,
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
    if (!therapist) {
      throw new NotFoundException(`Therapist with ID ${id} not found or not deleted`);
    }

    therapist.isDelete = false;
    therapist.deletedAt = null;
    return this.therapistRepository.save(therapist);
  }
}
