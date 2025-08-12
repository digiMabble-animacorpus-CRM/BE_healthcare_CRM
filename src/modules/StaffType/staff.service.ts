import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, FindManyOptions,DeepPartial ,Between, ILike,} from 'typeorm';
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
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import { MailUtils } from 'src/core/utils/mailUtils';
import { Token } from '../users/entities/token.entity';
import User  from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

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
    @InjectRepository(Token)
  private readonly tokenRepository: Repository<Token>, 
  private readonly MailUtils: MailUtils,    
   private readonly userService: UsersService, 
  ) {
    super(staffRepository.manager);
    this.repository = staffRepository;
  }

async createStaff(dto: CreateStaffDto, currentUser:any): Promise<Staff> {
  try {
    logger.info(`Staff_Create_Entry: ${JSON.stringify(dto)}`);

    if (currentUser.user_type !== 'super-admin' && currentUser.user_type !== 'branch-admin') {
       logger.warn(`Unauthorized staff creation attempt by: ${currentUser?.email}`);
      throw new ForbiddenException('Only super-admin can create staff');
    }

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

// Create matching user record for this staff
const existingUser = await this.userService.findOneByEmail(savedStaff.email);
if (!existingUser) {
  logger.debug(`Creating linked user for staff email: ${savedStaff.email}`);

  const roleForUser = await this.roleRepository.findOne({ where: { id: +dto.role_id } });
  const tempPassword = await bcrypt.hash(uuidv4(), 10);

const userData: Partial<User> = {
  name: savedStaff.name,
  email_id: savedStaff.email,
  password: tempPassword, // temporary hashed password
  user_type: 'staff',
  email_verified: false,
  last_login: null,
  is_blocked: false,
  preferences: [],
  roles: [roleForUser],
  company_name: null,
  website: null,
  tax_id: null,
};


  await this.userService.create(userData);
} else {
  logger.warn(`User already exists for staff email: ${savedStaff.email}`);
}

//  Continue your existing token + email flow
const token = uuidv4();

const tokenEntity = this.tokenRepository.create({
  user_email: savedStaff.email,
  token,
  type: 'password_reset',
  staff: savedStaff,
  expires_at: moment().add(1, 'day').toDate(),
});

await this.tokenRepository.save(tokenEntity);

// Send verification email with the same style as forgot passwords
const verifyLink = `${process.env.FRONTEND_BASE_URL}/auth/reset-password?token=${token}`;
logger.debug(`Verify URL: ${verifyLink}`);

await MailUtils.sendEmailVerificationLink(savedStaff.email, verifyLink);




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



async findAllWithFilters(filterDto?: StaffFilterDto): Promise<{ data: any[]; total: number }> {
  try {
    logger.info('Staff_FindAll_Entry');

    const {
      page = '1',
      limit = '10',
      searchText,
      branch,
      fromDate,
      toDate,
    } = filterDto || {};

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    const queryBuilder = this.staffRepository.createQueryBuilder('staff')
      .leftJoinAndSelect('staff.address', 'address')
      .leftJoinAndSelect('staff.role', 'role')
      .leftJoinAndSelect('staff.branches', 'branches')
      .leftJoinAndSelect('staff.selected_branch', 'selected_branch')
      .leftJoinAndSelect('staff.permissions', 'permissions')
      .where('staff.is_deleted = false');

    //  Search filter
    if (searchText) {
  const search = `%${searchText.toLowerCase()}%`;
  queryBuilder.andWhere(
    `(LOWER(staff.name) LIKE :search OR LOWER(staff.phone_number) LIKE :search OR LOWER(staff.email) LIKE :search OR LOWER(branches.name) LIKE :search)`,
    { search }
  );
}


    //  Branch filter
    if (branch) {
      queryBuilder.andWhere('branches.name = :branch', { branch });
    }

    //  From Date
    if (fromDate) {
      queryBuilder.andWhere('DATE(staff.created_at) >= :fromDate', { fromDate });
    }

    //  To Date
    if (toDate) {
      queryBuilder.andWhere('DATE(staff.created_at) <= :toDate', { toDate });
    }

    queryBuilder.orderBy('staff.created_at', 'DESC');
    queryBuilder.skip(skip).take(take);

    const [staffs, total] = await queryBuilder.getManyAndCount();

    //  Format response
    const enrichedStaffs = staffs.map((staff) => ({
      ...staff,
      branchesDetailed: staff.branches?.map((b) => ({ code: b.name })) || [],
      selectedBranch: staff.selected_branch ? { code: staff.selected_branch.name } : null,
      address: staff.address
        ? {
            street: staff.address.street,
            city: staff.address.city,
            state: staff.address.state,
            zipcode: staff.address.zip_code,
          }
        : null,
      role: staff.role ? { name: staff.role.name } : null,
      permissions: staff.permissions?.map((perm) => ({
        action: perm.action,
        resource: perm.resource,
      })) || [],
      phone_number: staff.phone_number,
    }));

    logger.info(`Staff_FindAll_Exit: Found ${enrichedStaffs.length} records`);

    return {
      data: enrichedStaffs,
      total,
    };
  } catch (error) {
    logger.error(`Staff_FindAll_Error: ${JSON.stringify(error.message || error)}`);
    throw new HttpException(EM100, EC500);
  }
}




  async searchWithFilters(dto: StaffFilterDto): Promise<{ data: Staff[]; total: number }> {
  const { page = '1', limit = '10', searchText, branch, fromDate, toDate } = dto;

  try {
    const query = this.staffRepository
      .createQueryBuilder('staff')
      .leftJoinAndSelect('staff.address', 'address')
      .leftJoinAndSelect('staff.role', 'role')
      .leftJoinAndSelect('staff.branches', 'branches')
      .leftJoinAndSelect('staff.selected_branch', 'selected_branch')
      .where('staff.is_deleted = false');

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


// staff.service.ts

async findOne(id: number): Promise<Staff> {
  logger.info(` [StaffService] findOne() called with ID: ${id}`);

  try {
    logger.debug(`[StaffService] Querying staffRepository.findOne for id=${id} and is_deleted=false`);

    const staff = await this.staffRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['address', 'role', 'branches', 'selected_branch'], // Uncomment if needed
    });

    if (!staff) {
      logger.warn(` [StaffService] No staff found in DB for id=${id}`);
      throw new NotFoundException(Errors.NO_RECORD_FOUND);
    }

    logger.info(` [StaffService] Staff record fetched: ${JSON.stringify(staff)}`);
    return staff;

  } catch (error) {
    logger.error(` [StaffService] Error fetching staff by ID: ${error.message || error}`);
    throw new HttpException(error.message || EM100, error.status || EC500);
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

    // Update Address
    if (dto.address) {
      Object.assign(staff.address, dto.address);
    }

    //  Update Branches
    if (dto.branches?.length) {
      staff.branches = await this.branchRepository.findBy({
        id: In(dto.branches.map((b) => +b)),
      });
    }

    //  Update Role
    if (dto.role_id) {
      const role = await this.roleRepository.findOneBy({ id: dto.role_id });
      if (!role) throw new NotFoundException('Invalid role ID');
      staff.role = role;
    }

    //  Update Selected Branch
    if (dto.selected_branch) {
      const selectedBranch = await this.branchRepository.findOneBy({
        id: dto.selected_branch,
      });
      if (!selectedBranch) throw new NotFoundException('Invalid selected branch ID');
      staff.selected_branch = selectedBranch;
    }

    //  Update Permissions (only if provided)
    if (dto.permissions?.length) {
      const permissionConditions = dto.permissions.map((p) => ({
        action: p.action,
        resource: p.resource,
      }));

      const permissionEntities = await this.permissionRepository.find({
        where: permissionConditions,
      });

      staff.permissions = permissionEntities;
    }

    //  Update core fields (only if provided)
    Object.assign(staff, {
      ...(dto.name && { name: dto.name }),
      ...(dto.phone_number && { phone_number: dto.phone_number }),
      ...(dto.email && { email: dto.email }),
      ...(dto.gender && { gender: dto.gender }),
      ...(dto.languages && { languages: dto.languages }),
      ...(dto.description && { description: dto.description }),
      ...(dto.dob && { dob: dto.dob }),
      ...(dto.access_level && { access_level: dto.access_level }),
      ...(dto.specialization && { specialization: dto.specialization }),
      ...(dto.experience && { experience: dto.experience }),
      ...(dto.education && { education: dto.education }),
      ...(dto.registration_number && { registration_number: dto.registration_number }),
      ...(dto.certification_files && { certification_files: dto.certification_files }),
      ...(dto.availability && { availability: dto.availability }),
      ...(dto.tags && { tags: dto.tags }),
      ...(dto.status && { status: dto.status }),
      ...(dto.login_details && { login_details: dto.login_details }),
    });

    const updated = await this.staffRepository.save(staff);

    logger.info(`Staff_Update_Exit: ${JSON.stringify(updated)}`);
    return updated;

  } catch (error) {
    logger.error(`Staff_Update_Error: ${JSON.stringify(error.message || error)}`);
    throw new HttpException(error.message || EM100, error.status || EC500);
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
