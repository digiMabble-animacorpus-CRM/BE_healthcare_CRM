import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, FindManyOptions,DeepPartial } from 'typeorm';
import { Staff } from './entities/staff.entity';
import { Address } from '../addresses/entities/address.entity';
import { Branch } from '../branches/entities/branch.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffFilterDto } from './dto/staff-filter.dto';
import { BaseService } from 'src/base.service';
import { logger } from 'src/core/utils/logger';
import { EC500, EM100 } from 'src/core/constants';
import { Errors } from 'src/core/constants/error_enums';
import { Status } from './entities/staff.entity';
import { Permission } from '../permissions/entities/permission.entity';
@Injectable()
export class StaffService extends BaseService<Staff> {
  protected repository: Repository<Staff>;

  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    super(staffRepository.manager);
    this.repository = staffRepository;
  }

async create(dto: CreateStaffDto): Promise<Staff> {
  try {
    logger.info(`Staff_Create_Entry: ${JSON.stringify(dto)}`);

    // Check for existing staff
    const exists = await this.staffRepository.findOne({ where: { email: dto.email } });
    logger.debug(`Checking existing staff by email: ${dto.email} => Found: ${!!exists}`);
    if (exists) throw new ConflictException(Errors.EMAIL_ID_ALREADY_EXISTS);

    // Save address
    logger.debug('Creating address...');
    const address = this.addressRepository.create(dto.address);
    const savedAddress = await this.addressRepository.save(address);
    logger.debug(`Address saved: ${JSON.stringify(savedAddress)}`);

    // Fetch related role
    logger.debug(`Fetching role ID: ${dto.role_id}`);
    const role = await this.roleRepository.findOne({ where: { id: +dto.role_id } });
    if (!role) throw new NotFoundException('Invalid role ID');
    logger.debug(`Role found: ${JSON.stringify(role)}`);

    // Handle selected branch
    let selectedBranch = null;
    if (dto.selected_branch) {
      logger.debug(`Finding selected_branch by ID: ${dto.selected_branch}`);
      selectedBranch = await this.branchRepository.findOne({ where: { id: +dto.selected_branch } });

      if (!selectedBranch && dto.selected_branch_name) {
        logger.debug(`selected_branch not found by ID. Trying by name: ${dto.selected_branch_name}`);
        selectedBranch = await this.branchRepository.findOne({ where: { name: dto.selected_branch_name } });

        if (!selectedBranch) {
          logger.debug('Creating new branch by name...');
          selectedBranch = this.branchRepository.create({
            name: dto.selected_branch_name,
            location: '',
            is_active: true,
          });
          selectedBranch = await this.branchRepository.save(selectedBranch);
          logger.debug(`New branch created: ${JSON.stringify(selectedBranch)}`);
        }
      }

      if (!selectedBranch) {
        throw new NotFoundException('Invalid selected_branch ID and no name provided');
      }
    } else if (dto.selected_branch_name) {
      logger.debug(`Finding selected_branch by name only: ${dto.selected_branch_name}`);
      selectedBranch = await this.branchRepository.findOne({ where: { name: dto.selected_branch_name } });

      if (!selectedBranch) {
        logger.debug('Creating new branch by name...');
        selectedBranch = this.branchRepository.create({
          name: dto.selected_branch_name,
          location: '',
          is_active: true,
        });
        selectedBranch = await this.branchRepository.save(selectedBranch);
        logger.debug(`New branch created: ${JSON.stringify(selectedBranch)}`);
      }
    } else {
      throw new NotFoundException('No selected_branch or selected_branch_name provided');
    }

    // Fetch multiple branches
    logger.debug(`Fetching branchEntities for: ${JSON.stringify(dto.branches)}`);
    const branchEntities = await this.branchRepository.findBy({
      id: In(dto.branches.map((id) => +id)),
    });
    logger.debug(`Branch entities fetched: ${branchEntities.length}`);

    // Fetch permissions
    logger.debug(`Mapping permissions...`);
    const permissions = dto.permissions?.map(p => ({
      action: p.action,
      resource: p.resource
    })) || [];

    const permissionEntities: Permission[] = [];
    for (const perm of permissions) {
      const found = await this.permissionRepository.findOne({
        where: {
          action: perm.action,
          resource: perm.resource,
        },
      });
      if (found) {
        permissionEntities.push(found);
        logger.debug(`Permission added: ${perm.action} on ${perm.resource}`);
      } else {
        logger.warn(`Permission not found in DB: ${perm.action} on ${perm.resource}`);
      }
    }

    const staffData: DeepPartial<Staff> = {
      name: dto.name,
      phone_number: dto.phone_number,
      email: dto.email,
      gender: dto.gender,
      languages: dto.languages,
      description: dto.description,
      dob: dto.dob,
      access_level: dto.access_level,
      specialization: dto.specialization,
      experience: dto.experience,
      education: dto.education,
      registration_number: dto.registration_number,
      certification_files: dto.certification_files,
      availability: dto.availability,
      tags: dto.tags,
      status: dto.status === 'inactive' ? Status.INACTIVE : Status.ACTIVE,
      login_details: dto.login_details,
      created_by: +dto.created_by,

      // Relations
      address: savedAddress,
      role: role,
      selected_branch: selectedBranch,
      branches: branchEntities,
      permissions: permissionEntities,
    };

    logger.debug('Creating staff entity...');
    const staff = this.staffRepository.create(staffData);
    const savedStaff = await this.staffRepository.save(staff);
    logger.debug(`Staff saved: ID = ${savedStaff.id}`);

    const result = await this.staffRepository.findOne({
      where: { id: savedStaff.id },
      relations: ['address', 'role', 'branches', 'selected_branch', 'permissions'],
    });

    logger.info(`Staff_Create_Exit: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    logger.error(`Staff_Create_Error: ${JSON.stringify(error.message || error)}`);
    throw new HttpException(EM100, EC500);
  }
}




  async findAll(options?: FindManyOptions<Staff>): Promise<Staff[]> {
    try {
      logger.info('Staff_FindAll_Entry');
      const staffs = await this.staffRepository.find({
        where: {
          ...(options?.where || {}),
          is_deleted: false,
        },
        relations: ['address', 'role', 'branches', 'selected_branch'],
        order: { created_at: 'DESC' },
        ...options,
      });
      logger.info(`Staff_FindAll_Exit: Found ${staffs.length} records`);
      return staffs;
    } catch (error) {
      logger.error(`Staff_FindAll_Error: ${JSON.stringify(error.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }

  async searchWithFilters(dto: StaffFilterDto): Promise<{ data: Staff[]; total: number }> {
    const { page = '1', limit = '10', searchText, branch, fromDate, toDate } = dto;

    try {
      const query = this.staffRepository.createQueryBuilder('staff')
        .leftJoinAndSelect('staff.address', 'address')
        .leftJoinAndSelect('staff.role', 'role')
        .leftJoinAndSelect('staff.branches', 'branches')
        .leftJoinAndSelect('staff.selected_branch', 'selected_branch')
        .where('staff.is_deleted = :isDeleted', { isDeleted: false });

      if (searchText) {
        query.andWhere(
          `(staff.name ILIKE :search OR staff.email ILIKE :search OR staff.phone_number ILIKE :search)`,
          { search: `%${searchText}%` },
        );
      }

      if (branch) {
        query.andWhere('selected_branch.id = :branch', { branch });
      }

      if (fromDate && toDate) {
        query.andWhere('DATE(staff.created_at) BETWEEN :fromDate AND :toDate', {
          fromDate,
          toDate,
        });
      }

      const [data, total] = await query
        .orderBy('staff.created_at', 'DESC')
        .skip((+page - 1) * +limit)
        .take(+limit)
        .getManyAndCount();

      return { data, total };
    } catch (error) {
      logger.error(`Staff_Filter_Error: ${JSON.stringify(error.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }

  async findOne(id: number): Promise<Staff> {
    try {
      logger.info(`Staff_FindOne_Entry: id=${id}`);
      const staff = await this.staffRepository.findOne({
        where: { id, is_deleted: false },
        relations: ['address', 'role', 'branches', 'selected_branch'],
      });

      if (!staff) throw new NotFoundException(Errors.NO_RECORD_FOUND);

      logger.info(`Staff_FindOne_Exit: ${JSON.stringify(staff)}`);
      return staff;
    } catch (error) {
      logger.error(`Staff_FindOne_Error: ${JSON.stringify(error.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }

async updateStaff(id: number, dto: UpdateStaffDto): Promise<Staff> {
  try {
    logger.info(`Staff_Update_Entry: id=${id}, data=${JSON.stringify(dto)}`);

    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['address', 'role', 'branches', 'selected_branch', 'permissions'],
    });
    if (!staff) throw new NotFoundException('Staff not found');

    if (dto.address) {
      Object.assign(staff.address, dto.address);
    }

    if (dto.branches) {
      staff.branches = await this.branchRepository.findBy({ id: In(dto.branches) });
    }

    if (dto.role_id) {
      const role = await this.roleRepository.findOneBy({ id: dto.role_id });
      if (!role) throw new NotFoundException('Invalid role ID');
      staff.role = role;
    }

    if (dto.selected_branch) {
      const selectedBranch = await this.branchRepository.findOneBy({ id: dto.selected_branch });
      if (!selectedBranch) throw new NotFoundException('Invalid selected branch ID');
      staff.selected_branch = selectedBranch;
    }

  const permissionConditions = dto.permissions.map(p => ({
  action: p.action,
  resource: p.resource,
}));

const permissionEntities = await this.permissionRepository.find({
  where: permissionConditions,
});
    if (dto.permissions) {
      staff.permissions = permissionEntities;
    }

    // Safely update other fields
    Object.assign(staff, {
      name: dto.name ?? staff.name,
      phone_number: dto.phone_number ?? staff.phone_number,
      email: dto.email ?? staff.email,
      gender: dto.gender ?? staff.gender,
      languages: dto.languages ?? staff.languages,
      description: dto.description ?? staff.description,
      dob: dto.dob ?? staff.dob,
      access_level: dto.access_level ?? staff.access_level,
      specialization: dto.specialization ?? staff.specialization,
      experience: dto.experience ?? staff.experience,
      education: dto.education ?? staff.education,
      registration_number: dto.registration_number ?? staff.registration_number,
      certification_files: dto.certification_files ?? staff.certification_files,
      availability: dto.availability ?? staff.availability,
      tags: dto.tags ?? staff.tags,
      status: dto.status ?? staff.status,
      login_details: dto.login_details ?? staff.login_details,
    });

    const updated = await this.staffRepository.save(staff);

    logger.info(`Staff_Update_Exit: ${JSON.stringify(updated)}`);
    return updated;
  } catch (error) {
    logger.error(`Staff_Update_Error: ${JSON.stringify(error.message || error)}`);
    throw new HttpException(EM100, EC500);
  }
}


  async removeStaff(id: number): Promise<void> {
    try {
      logger.info(`Staff_Remove_Entry: id=${id}`);
      await this.staffRepository.update(id, {
        is_deleted: true,
        is_active: false,
      });
      logger.info(`Staff_Remove_Exit: Soft deleted staff with id=${id}`);
    } catch (error) {
      logger.error(`Staff_Remove_Error: ${JSON.stringify(error.message || error)}`);
      throw new HttpException(EM100, EC500);
    }
  }



  async findOneByEmail(email: string): Promise<Staff> {
  const staff = await this.staffRepository.findOne({
    where: { email },
    relations: ['selected_branch'], // include relations if needed
  });

  if (!staff) throw new NotFoundException(`Staff with email ${email} not found`);
  return staff;
}

}
