import { Controller, Body, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { EC200, EC204, EC500, EM100, EM106, EM127, EM141, EM149 } from 'src/core/constants';
import HandleResponse from 'src/core/utils/handle_response';
import { DeleteDto, LoginDto, userlogoutDto } from './dto/login-dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password-reset.dto';
import { SignupAdminDto } from './dto/signup.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req: LoginDto) {
    try {
      let data = await this.authService.loginWithEmail(req);
      return HandleResponse.buildSuccessObj(EC200, EM106, data);
    } catch (error) {
      return HandleResponse.buildErrObj(error.status, EM100, error);
    }
  }

  @Post('signup-admin')
  async signupAdmin(@Body() req: SignupAdminDto) {
    try {
      const data = await this.authService.signup(req, 'admin');
      return HandleResponse.buildSuccessObj(201, 'Admin signup successful! Please verify your email.', data);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    try {
      let data = await this.authService.forgotPassword(body.email_id);
      return HandleResponse.buildSuccessObj(EC200, EM141, data);
    } catch (error) {
      return HandleResponse.buildErrObj(error?.status || EC500, error?.message || EM100, error);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    try {
      let data = await this.authService.resetPassword(body.token, body.password);
      return HandleResponse.buildSuccessObj(EC200, 'Password reset successfully', data);
    } catch (error) {
      return HandleResponse.buildErrObj(error?.status || EC500, error?.message || EM100, error);
    }
  }

  @Post('refresh')
  async refresh(@Body() body: { token: string }) {
    try {
      const data = await this.authService.refreshToken(body.token);
      return HandleResponse.buildSuccessObj(EC200, 'Token refreshed successfully', data);
    } catch (error) {
      return HandleResponse.buildErrObj(error?.status || EC500, error?.message || EM100, error);
    }
  }

  @Post('destroy')
  async deleteUser(@Body() deleteDto: DeleteDto) {
    try {
      let data: any = await this.authService.deleteUserData(deleteDto);
      if (data && data?.code === EC204) return data;
      return HandleResponse.buildSuccessObj(EC200, EM127, null);
    } catch (error) {
      return HandleResponse.buildErrObj(EC500 || error.status, error?.message || EM100, error);
    }
  }

  @Post('logout')
  async logout(@Body() logoutDto: userlogoutDto) {
    try {
      let data = await this.authService.logout(logoutDto);
      return HandleResponse.buildSuccessObj(EC200, EM149, null);
    } catch (error) {
      return HandleResponse.buildErrObj(EC500 || error.status, error?.message || EM100, error);
    }
  }
}