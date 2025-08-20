// profile.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { ProfileService } from './profile.service';
import { ProfileDto } from './dto/profile.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

//   @UseGuards(JwtAuthGuard)
@Get()
@UseGuards(AuthGuard('jwt')) // Ensure the user is authenticated
@ApiOkResponse({ description: 'Fetch logged-in user profile', type: ProfileDto })
async getProfile(@Req() req): Promise<ProfileDto> {
  const userId = req.user.user_id;
  const user = await this.profileService.getProfile(userId);
  return new ProfileDto(user, user?.team);
}

}
