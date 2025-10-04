import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TherapistMember } from 'src/modules/therapists-team/entities/therapist-team.entity';
import { CreateTherapistMemberDto } from './dto/create-therapist-team.dto';
import { UpdateTherapistTeamDto } from 'src/modules/therapists-team/dto/update-therapiist-team.dto';
import { TherapistTeamFilterDto } from './dto/therapist-team-filter.dto';
import { Department } from '../Department/entities/department.entity';
import { Branch } from 'src/modules/branches/entities/branch.entity';
import { Specialization } from 'src/modules/specialization/entities/specialization.entity';
import { In } from 'typeorm';
import { AppLanguage } from 'src/modules/languages/entities/app-languages.entity';

@Injectable()
export class TherapistTeamService {
  constructor(
    @InjectRepository(TherapistMember)
    private readonly therapistRepo: Repository<TherapistMember>,

     @InjectRepository(Department)
    private deptRepo: Repository<Department>,

    @InjectRepository(Branch)
    private branchRepo: Repository<Branch>,

    @InjectRepository(Specialization)
    private specializationRepo: Repository<Specialization>,

    @InjectRepository(AppLanguage)
private readonly languageRepo: Repository<AppLanguage>


  ) {}



  async getLanguagesDetails(names: string[]): Promise<any[]> {
  if (!names?.length) return [];
  
  // Assuming you have a repository for AppLanguage
  const languages = await this.languageRepo.find({
    where: { language_name: In(names) },
  });
  
  return languages;
}


async create(dto: CreateTherapistMemberDto): Promise<TherapistMember> {
  // 1️⃣ Fetch department if provided
  let department: Department = null;
  if (dto.departmentId) {
    department = await this.deptRepo.findOne({ where: { id: dto.departmentId } });
    if (!department) throw new NotFoundException('Department not found');
  }

  // 2️⃣ Exclude full_name and relation IDs from DTO to prevent issues
  const { full_name, branchIds, specializationIds, ...rest } = dto;

  // 3️⃣ Create the therapist entity WITHOUT ManyToMany relations
  const therapist = this.therapistRepo.create({
    ...rest,
    payment_methods: dto.payment_methods || [],
    faq: dto.faq || [],
    availability: dto.availability || [],
    permissions: dto.permissions || {},
    department,
  });

  // 4️⃣ Save therapist first to generate therapist_id
  const savedTherapist = await this.therapistRepo.save(therapist);

  // 5️⃣ Handle ManyToMany relations AFTER therapist exists
  if (branchIds?.length) {
    const branches = await this.branchRepo.find({ where: { branch_id: In(branchIds) } });
    savedTherapist.branches = branches;
  }

  if (specializationIds?.length) {
    const specializations = await this.specializationRepo.find({
      where: { specialization_id: In(specializationIds) },
    });
    savedTherapist.specializations = specializations;
  }

  // 6️⃣ Save again to persist ManyToMany relations
  const finalTherapist = await this.therapistRepo.save(savedTherapist);
const languagesSpokenDetails = await this.getLanguagesDetails(finalTherapist.languagesSpoken);


const therapistWithRelations = await this.therapistRepo.findOne({
  where: { therapistId: finalTherapist.therapistId },
  relations: ['department', 'branches', 'specializations'],
});

  // 7️⃣ Return the therapist with relations loaded
 return {
  ...therapistWithRelations,
  languagesSpoken: languagesSpokenDetails,
};
}


 async findAll(filter: TherapistTeamFilterDto) {
  const { searchText, departmentIds, branchIds } = filter;

  const query = this.therapistRepo.createQueryBuilder('t')
    .leftJoinAndSelect('t.department', 'department')
    .leftJoinAndSelect('department.specializations', 'departmentSpecializations') 
    .leftJoinAndSelect('t.branches', 'branch')
    .leftJoinAndSelect('t.specializations', 'specializations')
    .where('t.isDelete = false');

  if (searchText) {
    query.andWhere('(t.firstName ILIKE :text OR t.lastName ILIKE :text OR t.contactEmail ILIKE :text)', {
      text: `%${searchText}%`,
    });
  }

  if (departmentIds?.length) {
    query.andWhere('t.department_id IN (:...departmentIds)', { departmentIds });
  }

  if (branchIds?.length) {
    query.andWhere('branch.branch_id IN (:...branchIds)', { branchIds });
  }

  const  therapists = await query.getMany();

 // Fetch languages details for each therapist
  const therapistsWithLanguages = await Promise.all(
    therapists.map(async (therapist) => {
      const languagesSpokenDetails = await this.getLanguagesDetails(therapist.languagesSpoken);


        // Merge department + therapist-level specializations
      const deptSpecs = therapist.department?.specializations ?? [];
      const ownSpecs = therapist.specializations ?? [];
      const mergedSpecs = [...deptSpecs, ...ownSpecs].reduce((acc, curr) => {
        if (!acc.some((s) => s.specialization_id === curr.specialization_id)) {
          acc.push(curr);
        }
        return acc;
      }, []);


      return {
        ...therapist,
        languagesSpokenDetails,
        specializations: mergedSpecs, //  unified for frontend
        department: {
          ...therapist.department,
          specializations: undefined, //  remove nested to avoid confusion
        },
      };
    })
  );

  return therapistsWithLanguages; // just return array
}


async findOne(id: number): Promise<TherapistMember> {
  const therapist = await this.therapistRepo.findOne({
    where: { therapistId: id, isDelete: false },
    relations: [
      'department',
      'department.specializations', //  include this
      'branches',
      'specializations',
    ],
  });

  if (!therapist) {
    throw new NotFoundException(`Therapist member #${id} not found`);
  }

  const languagesDetails = await this.getLanguagesDetails(therapist.languagesSpoken);

  // 🔹 Merge department + therapist specializations
  const deptSpecs = therapist.department?.specializations ?? [];
  const ownSpecs = therapist.specializations ?? [];
  const mergedSpecs = [...deptSpecs, ...ownSpecs].reduce((acc, curr) => {
    if (!acc.some((s) => s.specialization_id === curr.specialization_id)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  return {
    ...therapist,
    languagesSpoken: languagesDetails,
    specializations: mergedSpecs, // unified field for frontend
    department: {
      ...therapist.department,
      specializations: undefined, //  remove nested specs to avoid confusion
    },
  };
}



async update(id: number, dto: UpdateTherapistTeamDto): Promise<TherapistMember> {
  const therapist = await this.findOne(id);

  // Handle department
  if (dto.departmentId) {
    const department = await this.deptRepo.findOne({ where: { id: dto.departmentId } });
    if (!department) throw new NotFoundException('Department not found');
    therapist.department = department;
  }

  // Handle branches
  if (dto.branchIds) {
    const branches = dto.branchIds.length
      ? await this.branchRepo.find({ where: { branch_id: In(dto.branchIds) } })
      : [];
    therapist.branches = branches;
  }

  // Handle specializations
  if (dto.specializationIds) {
    const specializations = dto.specializationIds.length
      ? await this.specializationRepo.find({ where: { specialization_id: In(dto.specializationIds) } })
      : [];
    therapist.specializations = specializations;
  }

  // Merge other fields safely
  const { departmentId, branchIds, specializationIds, full_name, ...rest } = dto;
  Object.assign(therapist, rest);
 // Handle languages (store only names)
  if (dto.languagesSpoken?.length) {
    const languageEntities = await this.getLanguagesDetails(dto.languagesSpoken);
    therapist.languagesSpoken = languageEntities.map(l => l.language_name);
  }

  // Save updates
  const updatedTherapist = await this.therapistRepo.save(therapist);

  // Fetch related entities for return
  const therapistWithRelations = await this.therapistRepo.findOne({
    where: { therapistId: updatedTherapist.therapistId },
    relations: ['department', 'branches', 'specializations'],
  });

  return {
    ...therapistWithRelations,
    languagesSpoken: therapist.languagesSpoken, // only names
  };
}



  async remove(id: number): Promise<void> {
    const therapist = await this.findOne(id);
    therapist.isDelete = true;
    therapist.deletedAt = new Date();
    await this.therapistRepo.save(therapist);
  }
}
