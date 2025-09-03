// src/modules/auth/auth.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersController } from '../users/users.controller';
import { MailUtils } from 'src/core/utils/mailUtils';
import { HomeService } from '../users/home.service';
import { AddressesModule } from '../addresses/addresses.module';
// import { AgentsModule } from '../agents/agents.module';
import { Role } from 'src/modules/roles/entities/role.entity';
// import {StaffModule} from '../StaffType/staff.module';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { Staff } from 'src/modules/StaffType/entities/staff.entity';
import { Token } from 'src/modules/users/entities/token.entity';
import { TeamMemberModule } from '../team-member/team-member.module';
import { TeamMember } from '../team-member/entities/team-member.entity';


@Module({
  imports: [
    PassportModule,
    AddressesModule,
    UsersModule,
    TeamMemberModule,
    // StaffModule,
    TypeOrmModule.forFeature([Role, Token,TeamMember]),
    // forwardRef(() => AgentsModule),
    // JwtModule.register({
    //   secret: process.env.JWTKEY,
    //   signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    // }),
    JwtModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (config: ConfigService) => ({
    secret: config.get('JWTKEY'),
    // signOptions: { expiresIn: config.get('TOKEN_EXPIRATION') || '48h' },
  }),
  inject: [ConfigService],
}),

    TypeOrmModule.forFeature([Role]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, MailUtils, HomeService
     ,{
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
  controllers: [AuthController, UsersController],
  exports: [AuthService],
})
export class AuthModule {}
