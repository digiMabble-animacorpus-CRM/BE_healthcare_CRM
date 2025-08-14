import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, FindManyOptions,DeepPartial ,Between, ILike, DataSource} from 'typeorm';
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly MailUtils: MailUtils,    
    private readonly userService: UsersService, 
    private readonly dataSource: DataSource,
  ) {
    super(staffRepository.manager);
    this.repository = staffRepository;
  }

async createStaff(dto: CreateStaffDto, currentUser: any): Promise<Staff> {
  try {
    logger.info(`Staff_Create_Entry`, dto);

    // Only allowed roles
    if (!['super-admin', 'branch-admin'].includes(currentUser.user_type)) {
      throw new ForbiddenException('Only super-admin and branch-admin can create staff');
    }

    // Check duplicate email
    const exists = await this.staffRepository.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException(Errors.EMAIL_ID_ALREADY_EXISTS);

    // Save address
    const savedAddress = await this.addressRepository.save(
      this.addressRepository.create(dto.address)
    );

    // Get role
    const role = await this.roleRepository.findOne({ where: { id: +dto.roleId } });
    if (!role) throw new NotFoundException('Invalid role ID');

    // Handle selected branch (simplified)
    let selectedBranch = await this.branchRepository.findOne({ where: { id: +dto.selectedBranch } });
    if (!selectedBranch && dto.selectedBranchName) {
      selectedBranch = await this.branchRepository.findOne({ where: { name: dto.selectedBranchName } })
        ?? await this.branchRepository.save(this.branchRepository.create({
          name: dto.selectedBranchName,
          location: '',
          is_active: true,
        }));
    }
    if (!selectedBranch) throw new NotFoundException('No valid branch provided');

    // Multiple branches
    const branchEntities = await this.branchRepository.findBy({
      id: In(dto.branches || [])
    });

    // Permissions
    const permissionEntities = await Promise.all(
      (dto.permissions || []).map(async p =>
        await this.permissionRepository.findOne({ where: { action: p.action, resource: p.resource } })
      )
    ).then(res => res.filter(Boolean) as Permission[]);


  // Ensure matching user exists
    let user = await this.userService.findOneByEmail(dto.email);
    if (!user) {
      const tempPassword = await bcrypt.hash(uuidv4(), 10);
      user = await this.userService.create({
        name: dto.name,
        email_id: dto.email,
        password: tempPassword,
        user_type: 'staff',
        roles: [role],
        email_verified: false,
        is_blocked: false,
        preferences: [],
      });
      logger.debug(`User created for staff: user_id=${user.id}`);
    } else {
      logger.debug(`Existing user linked: user_id=${user.id}`);
    }

    // Create staff entity and link user
    const staffData: DeepPartial<Staff> = {
      ...dto,
      createdBy: dto.createdBy ? +dto.createdBy : currentUser.id,
      status: dto.status === 'inactive' ? Status.INACTIVE : Status.ACTIVE,
      address: savedAddress,
      role,
      selectedBranch,
      branches: branchEntities,
      permissions: permissionEntities,
      user: { id: user.id }, // ✅ Proper relation link
    };


    const savedStaff = await this.staffRepository.save(
      this.staffRepository.create(staffData)
    );

  
    // Create token for password reset
    const token = uuidv4();
    await this.tokenRepository.save(this.tokenRepository.create({
      user_email: savedStaff.email,
      token,
      type: 'password_reset',
      staff: savedStaff,
      expires_at: moment().add(1, 'day').toDate(),
    }));

    // Send email
    await MailUtils.sendEmailVerificationLink(
      savedStaff.email,
      `${process.env.FRONTEND_BASE_URL}/auth/reset-password?token=${token}`
    );

    return this.staffRepository.findOne({
      where: { id: savedStaff.id },
      relations: ['address', 'role', 'branches', 'selectedBranch', 'permissions'],
    });
  } catch (error) {
    logger.error(`Staff_Create_Error: ${error.message || error}`);
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
      .leftJoinAndSelect('staff.selectedBranch', 'selectedBranch')
      .leftJoinAndSelect('staff.permissions', 'permissions')
      .where('staff.is_deleted = false');

    //  Search filter
    if (searchText) {
  const search = `%${searchText.toLowerCase()}%`;
  queryBuilder.andWhere(
    `(LOWER(staff.name) LIKE :search OR LOWER(staff.phoneNumber) LIKE :search OR LOWER(staff.email) LIKE :search OR LOWER(branches.name) LIKE :search)`,
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
      selectedBranch: staff.selectedBranch ? { code: staff.selectedBranch.name } : null,
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
      phone_number: staff.phoneNumber,
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
      .leftJoinAndSelect('staff.selectedBranch', 'selectedBranch')
      .where('staff.is_deleted = false');

    if (searchText) {
      query.andWhere(
        `(staff.name ILIKE :search OR staff.email ILIKE :search OR staff.phone_number ILIKE :search)`,
        { search: `%${searchText}%` },
      );
    }

    if (branch) {
      query.andWhere('selectedBranch.id = :branch', { branch });
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
      relations: ['address', 'role', 'branches', 'selectedBranch'], // Uncomment if needed
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
      relations: ['address', 'role', 'branches', 'selectedBranch', 'permissions'],
    });

    if (!staff) throw new NotFoundException('Staff not found');

    // Update address if provided
    if (dto.address) {
      if (staff.address) {
        Object.assign(staff.address, dto.address);
      } else {
        staff.address = this.addressRepository.create(dto.address);
      }
    }

    // Update branches
    if (dto.branches?.length) {
      staff.branches = await this.branchRepository.findBy({
        id: In(dto.branches.map(Number)),
      });
    }

    // Update role
    if (dto.roleId) {
      const role = await this.roleRepository.findOneBy({ id: dto.roleId });
      if (!role) throw new NotFoundException('Invalid role ID');
      staff.role = role;
    }

    // Update selected branch
    if (dto.selectedBranch) {
      const branch = await this.branchRepository.findOneBy({ id: dto.selectedBranch });
      if (!branch) throw new NotFoundException('Invalid selected branch ID');
      staff.selectedBranch = branch;
    }

    // Update permissions
    if (dto.permissions?.length) {
      const permissionEntities = await this.permissionRepository.find({
        where: dto.permissions.map((p) => ({ action: p.action, resource: p.resource })),
      });
      staff.permissions = permissionEntities;
    }

    // Update other fields directly from DTO (entity & DTO must align)
    Object.assign(staff, dto);

    const updated = await this.staffRepository.save(staff);

    logger.info(`Staff_Update_Exit: ${JSON.stringify(updated)}`);
    return updated;
  } catch (error) {
    logger.error(`Staff_Update_Error: ${error.message || error}`);
    throw new HttpException(error.message || EM100, error.status || EC500);
  }
}








async removeStaff(id: number): Promise<void> {
  try {
    logger.info(`Staff_SoftDelete_Entry: id=${id}`);

    // Fetch staff with relation to user
    const staff = await this.staffRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    logger.debug(`Fetched staff: ${JSON.stringify(staff)}`);

    if (!staff) {
      throw new NotFoundException(`Staff with id=${id} not found`);
    }

    // Determine userId (from relation or FK column)
    const userId = staff.user?.id || (staff as any).user_id;
    logger.debug(`Linked userId: ${userId}`);

    await this.dataSource.transaction(async (manager) => {
      // Soft delete staff
      const staffUpdateResult = await manager.getRepository(Staff).update(id, {
        is_deleted: true,
        is_active: false,
      });
      logger.debug(`Staff update result: ${JSON.stringify(staffUpdateResult)}`);

      // Soft delete linked user (if exists)
      if (userId) {
        const userUpdateResult = await manager.getRepository(User).update(userId, {
          is_deleted: true,
          is_active: false,
        });
        logger.debug(`User update result: ${JSON.stringify(userUpdateResult)}`);
      } else {
        logger.warn(`No linked user found for staff id=${id}`);
      }
    });

    logger.info(
      `Staff_SoftDelete_Exit: Soft deleted staff (id=${id})` +
      (userId ? ` & linked user (id=${userId})` : ' (no linked user)')
    );
  } catch (error) {
    logger.error(`Staff_SoftDelete_Error: ${error.message || error}`);
    throw new HttpException(error.message || EM100, error.status || EC500);
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
