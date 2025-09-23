import { PartialType } from '@nestjs/swagger';
import { CreateTherapistMemberDto } from './create-therapist-team.dto';

export class UpdateTherapistTeamDto extends PartialType(CreateTherapistMemberDto) {}
