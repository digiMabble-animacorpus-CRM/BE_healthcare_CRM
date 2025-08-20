import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
// import { StaffService } from '../StaffType/staff.service';
import User from '../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
    // private staffService: StaffService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWTKEY'),
    });
  }

  async validate(payload: any) {
    console.log('JWT payload:', payload);

    const userId = payload.user_id;
    if (!userId) {
      throw new UnauthorizedException('Invalid JWT payload: user_id missing');
    }

    const user: User = await this.userService.findOneById(userId, {
      // relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      console.error(' User not found');
      throw new UnauthorizedException('User not found');
    }

    // const userPermissions =
    //   user.roles?.flatMap((role) => role.permissions)?.map(
    //     (p) => `${p.action}:${p.resource}`,
    //   ) || [];

    // const roleMeta = user.roles?.map((r) => ({
    //   name: r.name,
    //   role_type: r.role_type,
    // })) || [];

    console.log(' User validated:', {
      user_id: user.id,
      email: user.email_id,
      // user_type: user.user_type,
    });
    // console.log(' Roles:', roleMeta);
    // console.log(' Permissions:', userPermissions);

    // Staff enrichment
    // if (user.user_type === 'staff') {
    //   const staff = await this.staffService.findOneByEmail(user.email_id);
    //   if (!staff) {
    //     throw new UnauthorizedException('Staff not found for user');
    //   }

    //   return {
    //     user_id: user.id,
    //     email: user.email_id,
    //     user_type: user.user_type,
    //     roles: user.roles || [],
    //     permissions: userPermissions,
    //     // staff_id: staff.id,
    //     // selected_branch: staff.selectedBranch?.id || null,
    //   };
    // }

    // Non-staff users
    return {
      user_id: user.id,
      email: user.email_id,
      // user_type: user.user_type,
      // roles: user.roles || [],
      // permissions: userPermissions,
    };
  }
}
