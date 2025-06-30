// src/modules/auth/auth.module.ts

import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersController } from '../users/users.controller';
import { MailUtils } from 'src/core/utils/mailUtils';
import { HomeService } from '../users/home.service';
import { AddressesModule } from '../addresses/addresses.module';
import { AgentsModule } from '../agents/agents.module';

@Module({
  imports: [
    PassportModule,
    AddressesModule,
    UsersModule,
    forwardRef(() => AgentsModule),
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, MailUtils, HomeService],
  controllers: [AuthController, UsersController],
  exports: [AuthService],
})
export class AuthModule {}
