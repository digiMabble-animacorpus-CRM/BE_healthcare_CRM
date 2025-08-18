// import { Injectable, Inject, ConflictException } from '@nestjs/common';

// import { OTP_REPOSTIORY, USER_REPOSITORY } from '../../core/constants';

// import { ModelCtor } from 'sequelize-typescript';
// import { BaseService } from 'src/base.service';
// import { Op } from 'sequelize';
// import { VerifyOtpDto } from '../auth/dto/verify-otp.dto';
// import { UpdateUserDto } from './dto/user.dto';
// import { Errors } from 'src/core/constants/error_enums';
// import { logger } from 'src/core/utils/logger';
// import Otp from 'src/modules/users/entities/Otp';
// import Helpers from 'src/core/utils/helpers';
// import User from 'src/modules/users/entities/User';
// import moment from 'moment';
// import { Repository } from 'typeorm';

// @Injectable()
// export class UsersService extends BaseService<User> {
//   protected repository: Repository<User>;
//   // protected model: ModelCtor<User>;
//   area_filter: Array<string>;
//   constructor(
//     @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
//     @Inject(OTP_REPOSTIORY) private readonly otp_repo: typeof Otp,
//   ) {
//     super();
//     this.repository = this.userRepository;
//   }
//   init() {}

//   //Insert new user record
//   async create(user: User): Promise<User> {
//     return await super.create(user);
//   }

//   //TODO need to pass id directly instead of passing object
//   async findOneById(id: any): Promise<any> {
//     let user = await super.findOne(id);
//     return user;
//   }
//   //Insert otp

//   //Find user using email
//   async findOneByEmail(email_id: string): Promise<User> {
//     return await super.findOne(null, {
//       where: { email_id: email_id },
//     });
//   }

//   //Update already registered user
//   public async updateProfile(body: UpdateUserDto | VerifyOtpDto) {
//     logger.info(`User_UpdateProfile_Entry: ` + JSON.stringify(body));
//     let user_id: string = 'id' in body ? body.id : body.user_id;
//     let user: User;
//     if ('email_id' in body) {
//       user = await Helpers.findOne(this.userRepository, {
//         where: { email_id: body.email_id, id: { [Op.ne]: user_id } },
//       });
//       if (user) throw new ConflictException(Errors.EMAIL_ID_ALREADY_EXISTS);
//     }

//     // create the user
//     let newUser: any = await Helpers.update(this.userRepository, { where: { id: user_id } }, { ...body });
//     logger.info(`User_UpdateProfile_Exit: ` + JSON.stringify(newUser));
//     return newUser;
//   }

//   async createOtp(email: string, otp: string): Promise<Otp> {
//     let otpRequest = {
//       user: email,
//       otp: otp,
//       created_at: moment().utc().format(),
//       expires_at: moment().add(5, 'minutes').utc().format(),
//     };
//     return await Otp.create<Otp>(otpRequest);
//   }
//   //Remove otp`
//   async deleteOtp(user: string) {
//     return Otp.destroy<Otp>({
//       where: {
//         user: user,
//       },
//     });
//   }
//   //Get otp using id
//   async findOtpById(request: VerifyOtpDto): Promise<Otp> {
//     return await Helpers.findOne(this.otp_repo, {
//       where: { user: request.email, otp: request.otp },
//     });
//   }
// }

import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { Not, Repository ,FindOneOptions } from 'typeorm';
import { BaseService } from 'src/base.service';
import { VerifyOtpDto } from '../auth/dto/verify-otp.dto';
import { UpdateUserDto } from './dto/user.dto';
import { Errors } from 'src/core/constants/error_enums';
import { logger } from 'src/core/utils/logger';
import User from 'src/modules/users/entities/user.entity';
import moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';
import { Address } from '../addresses/entities/address.entity';

@Injectable()
export class UsersService extends BaseService<User> {
  protected repository: Repository<User>;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Token) private readonly tokenRepository: Repository<Token>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {
    super(userRepository.manager);
    this.repository = userRepository;
  }

  /**
   * Create a new user record.
   */
  async create(user: Partial<User>): Promise<User> {
    return await super.create(user);
  }

  /**
   * Find a user by ID.
   */
  // async findOneById(id: string | number): Promise<User | null> {
  //   return await super.findOne(id);
  // }
async findOneById(id: string | number, options?: FindOneOptions<User>): Promise<User | null> {
  const userId = typeof id === 'string' ? parseInt(id, 10) : id;
  return await this.repository.findOne({
    where: { id: userId },
    ...(options || {}),
  });
}
  /**
   * Find a user by email.
   */
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({
      where: { email_id: email }
    });
  }

  /**
   * Update an existing user's profile.
   */
  async updateProfile(body: UpdateUserDto | VerifyOtpDto): Promise<User> {
    logger.info(`User_UpdateProfile_Entry: ${JSON.stringify(body)}`);

    const userId = 'id' in body ? Number(body.id) : Number(body.user_id);

    if ('email_id' in body) {
      const existingUser = await this.repository.findOne({
        where: { email_id: body.email_id, id: Not(userId) },
      });
      if (existingUser) {
        throw new ConflictException(Errors.EMAIL_ID_ALREADY_EXISTS);
      }
    }

    await super.update(userId, body);

    const updatedUser = await this.findOneById(userId);
    logger.info(`User_UpdateProfile_Exit: ${JSON.stringify(updatedUser)}`);
    return updatedUser!;
  }





  /**
  * Create a password reset token for a user
  */
  async createPasswordResetToken(email: string, token: string): Promise<Token> {
    // First delete any existing reset tokens for this email
    await this.deleteTokensByEmailAndType(email, 'password_reset');

    // Create new token
    const tokenData = {
      user_email: email,
      token: token,
      type: 'password_reset',
      created_at: moment().utc().toDate(),
      expires_at: moment().add(30, 'minutes').utc().toDate(),
    };

    const newToken = this.tokenRepository.create(tokenData);
    return await this.tokenRepository.save(newToken);
  }

  /**
   * Find a token by token string and type
   */
  async findTokenByTokenAndType(token: string, type: string): Promise<Token | null> {
    return await this.tokenRepository.findOne({
      where: { token, type }
    });
  }

  /**
   * Delete tokens by email and type
   */
  async deleteTokensByEmailAndType(email: string, type: string): Promise<void> {
    await this.tokenRepository.delete({ user_email: email, type });
  }

  /**
   * Verify if a token is valid (exists and not expired)
   */
  async verifyToken(token: string, type: string): Promise<{ valid: boolean; email?: string }> {
    const tokenRecord = await this.findTokenByTokenAndType(token, type);

    if (!tokenRecord) {
      return { valid: false };
    }

    const now = moment().utc();
    const expiresAt = moment(tokenRecord.expires_at).utc();

    if (now.isAfter(expiresAt)) {
      // Token expired, clean it up
      await this.tokenRepository.delete({ id: tokenRecord.id });
      logger.info(`Token expired and deleted: ${token}`);
      return { valid: false };
    }

    return { valid: true, email: tokenRecord.user_email };
  }

  async findOneByIdForAddress(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['address'],
    });
  }

  async createCompanyProfile(userId: number, dto: UpdateCompanyProfileDto): Promise<User> {
    console.log('dto', dto);

    const user = await this.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (user.company_name) {
      throw new Error('Company profile already exists. Use PUT to update.');
    }

    const { address, ...rest } = dto;
    Object.assign(user, rest);
    user.address = this.addressRepository.create(address);

    await this.addressRepository.save(user.address);
    await this.userRepository.save(user);

    return user;
  }

  async updateCompanyProfile(userId: number, dto: UpdateCompanyProfileDto): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');

    const { address, ...rest } = dto;
    Object.assign(user, rest);

    if (!user.address) {
      user.address = this.addressRepository.create(address);
    } else {
      this.addressRepository.merge(user.address, address);
    }

    await this.addressRepository.save(user.address);
    await this.userRepository.save(user);

    return user;
  }

  async updateLogo(userId: number, logo: string): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.logo = logo;
    return this.userRepository.save(user);
  }

  async findOneByRole(roleName: string): Promise<User | undefined> {
  return this.userRepository
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.roles', 'role')
    .where('role.name = :roleName', { roleName })
    .getOne();
}

/**
 * Create an email verification token for a user
 */
// async createEmailVerificationToken(email: string, token: string): Promise<Token> {
//   // Delete any previous verification tokens for this user
//   await this.deleteTokensByEmailAndType(email, 'email_verification');

//   const tokenData = {
//     user_email: email,
//     token: token,
//     type: 'email_verification',
//     created_at: moment().utc().toDate(),
//     expires_at: moment().add(10, 'minutes').utc().toDate(),
//   };

//   const newToken = this.tokenRepository.create(tokenData);
//   return await this.tokenRepository.save(newToken);
// }


}
