import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamMember } from './entities/team-member.entity';
import { TeamMemberService } from './team-member.service';
import { TeamMemberController } from './team-member.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TeamMember])],
  providers: [TeamMemberService],
  controllers: [TeamMemberController],
})
export class TeamMemberModule {}
