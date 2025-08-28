import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async create(dto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepository.create({
      ...dto,
      is_active: dto.is_active ?? true,
    });
    return await this.departmentRepository.save(department);
  }

// GET departments with optional branchId and search
async findAllFiltered(branchId?: number, search?: string): Promise<Department[]> {
  const query = this.departmentRepository
    .createQueryBuilder('department')
    .leftJoin('department.therapists', 't')
    .leftJoin('t.branches', 'b'); // join the branches relation

  if (branchId) {
    query.andWhere('b.branch_id = :branchId', { branchId });
  }

  if (search) {
    query.andWhere(
      '(department.name ILIKE :search OR department.description ILIKE :search)',
      { search: `%${search}%` },
    );
  }

  query.distinct(true); // avoid duplicates

  return query.getMany();
}

  
  async findAll(): Promise<Department[]> {
    return await this.departmentRepository.find();
  }

  async findOne(id: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({ where: { id } });
    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }
    return department;
  }

  async update(id: number, dto: UpdateDepartmentDto): Promise<Department> {
    const department = await this.findOne(id);
    await this.departmentRepository.update(id, dto);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const department = await this.findOne(id);
    await this.departmentRepository.remove(department);
  }
}
