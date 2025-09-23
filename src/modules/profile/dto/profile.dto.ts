// profile.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import  User  from 'src/modules/users/entities/user.entity';
import { TeamMember } from 'src/modules/team-member/entities/team-member.entity';
import { TherapistMember } from 'src/modules/therapists-team/entities/therapist-team.entity';

export class ProfileDto {
  constructor(user: User, therapist: TherapistMember) {
    this.user = user;
    this.therapistTeamMembers = therapist;
  }

  @ApiProperty({ type: () => User })
  user: User;

  // @ApiProperty({ type: () => TeamMember })
  // team: TeamMember;

    @ApiProperty({ type: () => TherapistMember })
  therapistTeamMembers: TherapistMember;
}
