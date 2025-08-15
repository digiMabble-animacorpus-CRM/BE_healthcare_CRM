import { Controller, Body, Post, HttpException, HttpStatus,BadRequestException,UnauthorizedException ,NotFoundException} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags,ApiOperation,ApiBody,ApiResponse} from '@nestjs/swagger';
import { EC200, EC204, EC500, EM100, EM106, EM127, EM141, EM149 ,EC400} from 'src/core/constants';
import HandleResponse from 'src/core/utils/handle_response';
import { DeleteDto, LoginDto, userlogoutDto } from './dto/login-dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password-reset.dto';
import { SignupAdminDto } from './dto/signup.dto';
import { AES } from 'src/core/utils//encryption.util';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UsersService } from 'src/modules/users/users.service';
// import { Public } from 'src/common/decorators/public.decorator';
import { Logger } from '@nestjs/common';

const logger = new Logger('AuthController');

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

@Post('login')
@ApiOperation({ summary: 'Login with email and password (AES encrypted or plain JSON)' })
@ApiBody({ type: LoginDto })
@ApiResponse({ status: 200, description: 'Login success. Returns JWT tokens.' })
@ApiResponse({ status: 400, description: 'Validation failed or bad request' })
@ApiResponse({ status: 401, description: 'Invalid credentials' })
async login(@Body() reqBody: any) {
  try {
    this.logger.debug(' Encrypted login request received:');
    this.logger.debug('Object:', reqBody);

    let decryptedObject;

    if (reqBody.data) {
      // AES-encrypted body from frontend
      const decrypted = AES.decrypt(reqBody.data); // Already returns an object
      decryptedObject = typeof decrypted === 'string' ? JSON.parse(decrypted) : decrypted;
      this.logger.debug(' Decrypted login body:', decryptedObject);
    } else {
      // Plain JSON (for Postman testing)
      decryptedObject = reqBody;
      this.logger.debug(' Plain login body:', decryptedObject);
    }

    const dto = plainToClass(LoginDto, decryptedObject);
    await validateOrReject(dto);

    const data = await this.authService.loginWithEmail(dto);
    return HandleResponse.buildSuccessObj(EC200, EM106, data);

  } catch (error) {
    this.logger.error(' Login failed:');
    this.logger.error(error);
    return HandleResponse.buildErrObj(error.status || 500, EM100, error);
  }
}


async signupByRole(reqBody: any, userType: 'staff' | 'branch-admin' | 'super-admin') {
  try {
    console.log(`Encrypted body for ${userType}:`, reqBody);

    let decryptedObject;
    if (reqBody.data) {
      const decryptedString = AES.decrypt(reqBody.data);
      decryptedObject = JSON.parse(decryptedString);
      console.log('Decrypted body:', decryptedString, decryptedObject);
    } else {
      decryptedObject = reqBody;
    }

    const dto = plainToClass(SignupAdminDto, decryptedObject);
    await validateOrReject(dto);

    const data = await this.authService.signup(dto, userType);

    return HandleResponse.buildSuccessObj(201, `Signup successful as ${userType}`, data);
  } catch (error) {
    console.error(`Signup ${userType} Error:`, error);

    if (error instanceof HttpException) throw error;

    throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Post('signup-staff')
// @ApiOperation({ summary: 'Signup as staff (plain JSON or encrypted)' })
// @ApiBody({ type: SignupAdminDto })
// @ApiResponse({ status: 201, description: 'Signup successful' })
async signupStaff(@Body() reqBody: any) {
  console.log('signup-staff endpoint hit');
  return this.signupByRole(reqBody, 'staff');
}


// signup for branch-admin

@Post('signup-branch-admin')
// @ApiOperation({ summary: 'Signup as branch admin (plain JSON or encrypted)' })
// @ApiBody({ type: SignupAdminDto })
// @ApiResponse({ status: 201, description: 'Signup successful' })
async signupBranchAdmin(@Body() reqBody: any) {
  return this.signupByRole(reqBody, 'branch-admin');
}

// signup for super-admin

@Post('signup-super-admin')
@ApiOperation({ summary: 'Signup as super admin (plain JSON or encrypted)' })
@ApiBody({ type: SignupAdminDto })
@ApiResponse({ status: 201, description: 'Signup successful' })
async signupSuperAdmin(@Body() reqBody: any) {
  console.log('/signup-super-admin HIT');
  return this.signupByRole(reqBody, 'super-admin');
}


  @Post('signup-admin')
// @ApiOperation({ summary: 'Signup as admin (plain JSON only)' })
// @ApiBody({ type: SignupAdminDto })
// @ApiResponse({ status: 201, description: 'Signup successful' })
@ApiResponse({ status: 400, description: 'Validation failed or data is missing' })
async signupAdmin(@Body() reqBody: any) {
  try {
    console.log('Encrypted body:', reqBody);

    let decryptedObject;

    //  Handle AES-encrypted or plain request body
    if (reqBody.data) {
      const decryptedString = AES.decrypt(reqBody.data); // AES decryption function
      decryptedObject = JSON.parse(decryptedString);
      console.log('Decrypted body:', decryptedString, decryptedObject);
    } else {
      decryptedObject = reqBody; // Plain request (e.g., Postman or dev)
      console.log('Plain body:', decryptedObject);
    }

    //  Transform and validate
    const dto = plainToClass(SignupAdminDto, decryptedObject);
    await validateOrReject(dto);

    //  Call service
    const data = await this.authService.signup(dto, 'admin');

    return HandleResponse.buildSuccessObj(201, 'Admin signup successful! Please verify your email.', data);

  } catch (error) {
    console.error('Signup Admin Error:', error);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}




  @Post('forgot-password')
    @ApiOperation({ summary: 'Send password reset link to email' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Reset link sent if user exists' })
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    try {
      let data = await this.authService.forgotPassword(body.email_id);
      return HandleResponse.buildSuccessObj(EC200, EM141, data);
    } catch (error) {
      return HandleResponse.buildErrObj(error?.status || EC500, error?.message || EM100, error);
    }
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  async resetPassword(@Body() body: ResetPasswordDto) {
    try {
      let data = await this.authService.resetPassword(body.token, body.password);
      return HandleResponse.buildSuccessObj(EC200, 'Password reset successfully', data);
    } catch (error) {
      return HandleResponse.buildErrObj(error?.status || EC500, error?.message || EM100, error);
    }
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiBody({ schema: { example: { token: 'jwt-refresh-token-here' } } })
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


@Post('verify-email')
async verifyEmail(@Body() body: VerifyOtpDto) {
  const { email_id, otp } = body;

  console.log(' Incoming verify-email body:', body);

  const result = await this.usersService.verifyToken(otp, 'email_verification');
  console.log(' Token check result:', result);

  if (!result.valid) {
    console.log(' Token is invalid or expired');
    throw new UnauthorizedException('Invalid or expired verification token');
  }

  if (result.email !== email_id) {
    console.log(' Token email mismatch:', result.email, email_id);
    throw new UnauthorizedException('Token does not match provided email');
  }

  const user = await this.usersService.findOneByEmail(email_id);
  if (!user) {
    console.log(' User not found for email:', email_id);
    throw new NotFoundException('User not found');
  }

  if (user.email_verified) {
    console.log(' Email already verified');
    return { message: 'Email is already verified' };
  }

  user.email_verified = true;
  await this.usersService.update(user.id, user);

  await this.usersService.deleteTokensByEmailAndType(email_id, 'email_verification');

  console.log(' Email verification successful for:', email_id);
  return { message: 'Email verified successfully' };
}



}