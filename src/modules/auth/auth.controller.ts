import { Controller, Body, Post, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags,ApiOperation,ApiBody,ApiResponse} from '@nestjs/swagger';
import { EC200, EC204, EC500, EM100, EM106, EM127, EM141, EM149 } from 'src/core/constants';
import HandleResponse from 'src/core/utils/handle_response';
import { DeleteDto, LoginDto, userlogoutDto } from './dto/login-dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/password-reset.dto';
import { SignupAdminDto } from './dto/signup.dto';
import { AES } from 'src/core/utils//encryption.util';
import { plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

@Post('login')
@ApiOperation({ summary: 'Login with email and password' })
@ApiBody({
  description: 'AES-encrypted LoginDto payload in the `data` field.',
  schema: {
    type: 'object',
    properties: {
      data: {
        type: 'string',
        example: 'U2FsdGVkX1+ANOTHER_ENCRYPTED_STRING==',
      },
    },
  },
})
@ApiResponse({ status: 200, description: 'Login success. Returns JWT tokens.' })
@ApiResponse({ status: 401, description: 'Invalid credentials' })
async login(@Body() reqBody: any) {
  try {
    console.log('Encrypted login body:', reqBody);

    // 1. Decrypt the data (support both encrypted and plain input)
    let decryptedObject;
    if (reqBody.data) {
      // Encrypted input from frontend
      const decryptedString = AES.decrypt(reqBody.data); // Your decrypt method
      decryptedObject = JSON.parse(decryptedString);
      console.log('Decrypted login body:', decryptedString, decryptedObject);
    } else {
      // Plain input (e.g., Postman testing)
      decryptedObject = reqBody;
      console.log('Plain login body:', decryptedObject);
    }

    // 2. Transform to DTO and validate
    const dto = plainToClass(LoginDto, decryptedObject);
    await validateOrReject(dto);

    // 3. Login logic
    const data = await this.authService.loginWithEmail(dto);
    return HandleResponse.buildSuccessObj(EC200, EM106, data);

  } catch (error) {
    console.error('Login error:', error);
    return HandleResponse.buildErrObj(error.status || 500, EM100, error);
  }
}


  @Post('signup-admin')
  @ApiOperation({ summary: 'Signup as admin' })
  @ApiBody({
    description: 'AES-encrypted SignupAdminDto payload, sent in the `data` field.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          example: 'U2FsdGVkX1+ENCRYPTED_DATA_HERE==',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Signup successful' })
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
}