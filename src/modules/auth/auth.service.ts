import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import User from 'src/modules/users/entities/user.entity';
import { logger } from 'src/core/utils/logger';
import { DeleteDto, LoginDto, userlogoutDto } from './dto/login-dto';
import { Errors } from 'src/core/constants/error_enums';
import { MailUtils } from 'src/core/utils/mailUtils';
import Encryption from 'src/core/utils/encryption';
import { AddressesService } from '../addresses/addresses.service';
import { SignupAdminDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService, 
    private readonly jwtService: JwtService,
    private readonly addressesService: AddressesService
  ) { }

  async signup(signupData: SignupAdminDto, user_type: 'admin'): Promise<any> {
    logger.info(`Signup_Entry: Email=${signupData.email_id} | UserType=${user_type}`);

    const existingUser = await this.userService.findOneByEmail(signupData.email_id);
    if (existingUser) {
      logger.warn(`Signup_Failure: Email=${signupData.email_id} | Reason=EmailAlreadyExists`);
      throw new ConflictException(Errors.EMAIL_ID_ALREADY_EXISTS);
    }

    try {
      const userData: Partial<User> = {
        ...signupData,
        user_type,
        email_verified: false,
        last_login: new Date(),
        is_blocked: false,
        preferences: [],
        company_name: null,
        website: null,
        tax_id: null,
      };
      
      const newUser = await this.userService.create(userData);

      const { access_token, refresh_token } = await this.generateTokens({
        user_id: newUser.id,
        user_type: newUser.user_type,
        email: newUser.email_id,
      });
      
      const { password, ...userResponse } = newUser;


      return {
        ...userResponse,
        access_token,
        refresh_token
      };
    } catch (error) {
      throw error;
    }
  }





  async loginWithEmail({ email_id, password, device_token, remember_me }: LoginDto): Promise<{ user: Partial<User>, accessToken: string, refreshToken: string }> {
    logger.info(`Login_Entry: ` + JSON.stringify({ email_id, remember_me }));

    const user: User = await this.userService.findOneByEmail(email_id);

    if (!user) {
      logger.info(`Login_User_Not_Found: ${email_id}`);
      throw new NotFoundException(Errors.USER_NOT_EXISTS);
    }

    if (!user.password) {
      logger.info(`Login_Password_Missing: ${email_id}`);
      throw new UnauthorizedException(Errors.INVALID_USER_DETAILS);
    }

    if (!Encryption.comparePassword(password, user.password)) {
      logger.info(`Login_Invalid_Password: ${email_id}`);
      throw new UnauthorizedException(Errors.INCORRECT_USER_PASSWORD);
    }

    await this.userService.update(user.id, {
        last_login: new Date(),
        ...(device_token && { device_token }),
    });

    const { access_token, refresh_token } = await this.generateTokens({ user_id: user.id }, remember_me);
    
    const { password: _, ...userResponse } = user;

    logger.info(`Login_Success: ${email_id}`);

    return {
      user: userResponse,
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }





  public async generateTokens(payload: any, remember_me = false): Promise<{ access_token: string, refresh_token: string }> {
    const accessTokenPayload = { ...payload };
    const refreshTokenPayload = { ...payload, remember_me };

    const access_token = await this.generateToken(accessTokenPayload, false, remember_me);
    const refresh_token = await this.generateToken(refreshTokenPayload, true, remember_me);
    return { access_token, refresh_token };
  }

  public async generateToken(payload: any, isRefreshToken = false, remember_me = false) {
    const expiresIn = isRefreshToken
      ? remember_me ? '30d' : '2h'
      : '1h';    
      
      console.log(expiresIn,` expiresIn`);
      
      
    
    return this.jwtService.signAsync(payload, {
      secret: process.env.JWTKEY,
      expiresIn,
    });
  }

  async refreshToken(token: string): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWTKEY });
      const user = await this.userService.findOneById(decoded.user_id);
      if (!user) throw new NotFoundException(Errors.USER_NOT_EXISTS);
      
      const shouldRemember = decoded.remember_me || false;

      const { access_token, refresh_token } = await this.generateTokens({ user_id: user.id }, shouldRemember);
      return { accessToken: access_token, refreshToken: refresh_token };
    } catch (error) {
      throw new NotFoundException(Errors.INVALID_TOKEN);
    }
  }

  async forgotPassword(email_id: string) {
    const user: User = await this.userService.findOneByEmail(email_id);

    if (!user) {
      logger.warn(`Forgot password attempt for non-existent email: ${email_id}`);
      throw new NotFoundException(Errors.USER_NOT_EXISTS);
    }

    try {
      logger.debug(`User found: ${user.email_id}`);
      const resetToken = await this.generateToken({
        user_id: user.id,
        email: user.email_id,
        purpose: 'password_reset'
      }, true);
  logger.debug(`Token generated: ${resetToken}`);
      await this.userService.createPasswordResetToken(email_id, resetToken);
logger.debug(`Token saved to DB`);
      const resetUrl = `${process.env.FRONTEND_BASE_URL}/auth/reset-password?token=${resetToken}`;
    logger.debug(`Reset URL: ${resetUrl}`);
      await MailUtils.sendPasswordResetEmail(email_id, resetUrl);
       logger.debug(`Email sent`);
      return { message: 'If a user with that email exists, a password reset link has been sent.' };
    } catch (error) {
      logger.error(`Error processing password reset for ${email_id}: ${error.message}`);
       logger.error(error.stack); 
      throw new HttpException('An unexpected error occurred while processing your request.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async resetPassword(token: string, password: string) {
    const { valid, email } = await this.userService.verifyToken(token, 'password_reset');

    if (!valid || !email) {
      logger.warn(`ResetPassword_Failure: Token invalid or expired`);
      throw new NotFoundException('Invalid or expired password reset token');
    }

    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      logger.warn(`ResetPassword_Failure: User not found for email ${email}`);
      throw new NotFoundException(Errors.USER_NOT_EXISTS);
    }

    try {
      await this.userService.update(user.id, {
        password: Encryption.hashPassword(password)
      });

      await this.userService.deleteTokensByEmailAndType(email, 'password_reset');

      logger.info(`ResetPassword_Success: User=${user.id} | Email=${email}`);

      return { message: 'Password has been reset successfully' };
    } catch (error) {
      logger.error(`ResetPassword_Error: Email=${email} | Error=${error.message}`);
      throw error;
    }
  }

  async deleteUserData(req_data: DeleteDto) {
    return this.userService.destroy(req_data.identity);
  }

  async logout(req: userlogoutDto) {
    return this.userService.update(req.user_id, { device_token: null });
  }


}