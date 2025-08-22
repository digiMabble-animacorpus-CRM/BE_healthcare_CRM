// profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import  User  from 'src/modules/users/entities/user.entity';
import { TeamMember } from 'src/modules/team-member/entities/team-member.entity';

export class ProfileDto {
  constructor(user: User, team: TeamMember) {
    this.user = user;
    this.team = team;
  }

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => TeamMember })
  team: TeamMember;
}
