// profile.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import  User  from 'src/modules/users/entities/user.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(userId: number) {
    return this.userRepository.findOne({
      where: { id: userId },
      relations: ['therapistTeamMembers'], // join with therapist_team_members
    });
  }
}
