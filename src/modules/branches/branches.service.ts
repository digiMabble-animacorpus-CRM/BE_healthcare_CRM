import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from './entities/branch.entity';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { EM102, EM119, EM100 } from 'src/core/constants'; // <-- Import constants

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
        throw new ConflictException("Branch Name Already Exists");
      }
      throw new InternalServerErrorException(EM100);
    }
  }

  async findAll(): Promise<Branch[]> {
    return this.branchRepository.find();
  }

  async findOne(branch_id: string): Promise<Branch> {
    const branch = await this.branchRepository.findOne({ where: { branch_id } });
    if (!branch) {
      throw new NotFoundException(EM119); 
    }
    return branch;
  }

  async update(branch_id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
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

  async remove(branch_id: string): Promise<void> {
    const branch = await this.findOne(branch_id);
    await this.branchRepository.remove(branch);
  }
}