import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { EM102, EM119, EM100 } from 'src/core/constants';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    try {
      const branch = this.branchRepository.create(createBranchDto);
      return await this.branchRepository.save(branch);
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException('Branch with this email already exists');
      }
      throw new InternalServerErrorException(EM100);
    }
  }

  async findAll(
    page: number,
    limit: number,
    search?: string,
  ): Promise<{ data: Branch[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = search
      ? [
          { name: ILike(`%${search}%`) },
          { email: ILike(`%${search}%`) },
          { phone: ILike(`%${search}%`) },
        ]
      : {};

    const [data, total] = await this.branchRepository.findAndCount({
      where,
      skip,
      take: limit,
    });

    return { data, total };
  }

  async findOne(branch_id: number): Promise<Branch> {
    const branch = await this.branchRepository.findOne({ where: { branch_id } });
    if (!branch) {
      throw new NotFoundException(EM119);
    }
    return branch;
  }

  async update(
    branch_id: number,
    updateBranchDto: UpdateBranchDto,
  ): Promise<Branch> {
    const branch = await this.findOne(branch_id);

    try {
      this.branchRepository.merge(branch, updateBranchDto);
      return await this.branchRepository.save(branch);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('A branch with this email already exists.');
      }
      throw new InternalServerErrorException(EM100);
    }
  }

  async remove(branch_id: number): Promise<void> {
    const branch = await this.findOne(branch_id);
    await this.branchRepository.remove(branch);
  }
}