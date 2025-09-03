import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './entities/team-member.entity';
import { TeamMemberService } from './team-member.service';
import { TeamMemberController } from './team-member.controller';
import { Branch } from '../branches/entities/branch.entity';
import  User  from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMember, Branch, User])],
  providers: [TeamMemberService],
  controllers: [TeamMemberController],
  exports: [TeamMemberService],
})
export class TeamMemberModule {}
