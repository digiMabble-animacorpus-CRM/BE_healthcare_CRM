import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import  User  from './entities/user.entity';
import  Otp  from './entities/token.entity';
import { Not, Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { UpdateUserDto } from './dto/user.dto';

const mockUserRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockOtpRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let userRepository;
  let otpRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: getRepositoryToken(Otp), useFactory: mockOtpRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    otpRepository = module.get<Repository<Otp>>(getRepositoryToken(Otp));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('create', () => {
  //   it('should create a new user', async () => {
  //     const user = { email_id: 'test@example.com' };
  //     const savedUser = { id: 1, ...user };

  //     userRepository.create.mockReturnValue(savedUser);
  //     userRepository.save.mockResolvedValue(savedUser);

  //     const result = await service.create(user);

  //     expect(userRepository.create).toHaveBeenCalledWith(user);
  //     expect(userRepository.save).toHaveBeenCalledWith(savedUser);
  //     expect(result).toEqual(savedUser);
  //   });
  // });

  describe('findOneById', () => {
    it('should find a user by ID', async () => {
      const user = { id: 1, email_id: 'test@example.com' };

      userRepository.findOne.mockResolvedValue(user);

      const result = await service.findOneById(1);

      expect(userRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });

    it('should return null if user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneById(1);

      expect(userRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });

  // describe('findOneByEmail', () => {
  //   it('should find a user by email', async () => {
  //     const user = { id: 1, email_id: 'test@example.com' };

  //     userRepository.findOne.mockResolvedValue(user);

  //     const result = await service.findOneByEmail('test@example.com');

  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email_id: 'test@example.com' } });
  //     expect(result).toEqual(user);
  //   });

  //   it('should return null if user is not found', async () => {
  //     userRepository.findOne.mockResolvedValue(null);

  //     const result = await service.findOneByEmail('test@example.com');

  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email_id: 'test@example.com' } });
  //     expect(result).toBeNull();
  //   });
  // });

  // describe('updateProfile', () => {
  //   it('should update an existing user profile', async () => {
  //     const updateUserDto: Partial<UpdateUserDto> = { id: 1, email_id: 'updated@example.com' };
  //     const user = { id: 1, email_id: 'test@example.com' };
  //     const updatedUser = { id: 1, email_id: 'updated@example.com' };

  //     userRepository.findOne.mockResolvedValueOnce(null); // No conflict
  //     userRepository.findOne.mockResolvedValueOnce(updatedUser); // Updated user

  //     const result = await service.updateProfile(updateUserDto as UpdateUserDto);

  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email_id: 'updated@example.com', id: Not(1) } });
  //     expect(userRepository.update).toHaveBeenCalledWith(1, updateUserDto);
  //     expect(result).toEqual(updatedUser);
  //   });

  //   it('should throw a ConflictException if email already exists', async () => {
  //     const updateUserDto:  Partial<UpdateUserDto> = { id: 1, email_id: 'existing@example.com' };
  //     const existingUser = { id: 2, email_id: 'existing@example.com' };

  //     userRepository.findOne.mockResolvedValue(existingUser);

  //     await expect(service.updateProfile(updateUserDto as UpdateUserDto)).rejects.toThrow(ConflictException);
  //     expect(userRepository.findOne).toHaveBeenCalledWith({ where: { email_id: 'existing@example.com', id: Not(1) } });
  //   });
  // });

  //   it('should create an OTP for a user', async () => {
  //     const otpRequest = { user: 'test@example.com', otp: '123456', created_at: new Date(), expires_at: new Date() };
  //     const savedOtp = { id: 1, ...otpRequest };

  //     otpRepository.create.mockReturnValue(savedOtp);
  //     otpRepository.save.mockResolvedValue(savedOtp);
  //     otpRepository.create.mockReturnValue(savedOtp);
  //     otpRepository.save.mockResolvedValue(savedOtp);

  //     const result = await service.createOtp('test@example.com', '123456');
  //     const result = await service.createOtp('test@example.com', '123456');

  //     expect(otpRepository.create).toHaveBeenCalledWith(otpRequest);
  //     expect(otpRepository.save).toHaveBeenCalledWith(savedOtp);
  //     expect(result).toEqual(savedOtp);
  //   });
  // });
  //     expect(otpRepository.create).toHaveBeenCalledWith(otpRequest);
  //     expect(otpRepository.save).toHaveBeenCalledWith(savedOtp);
  //     expect(result).toEqual(savedOtp);
  //   });
  // });

  // describe('deleteOtp', () => {
  //   it('should delete OTPs for a user', async () => {
  //     otpRepository.delete.mockResolvedValue(true);
  // describe('deleteOtp', () => {
  //   it('should delete OTPs for a user', async () => {
  //     otpRepository.delete.mockResolvedValue(true);

  //     await service.deleteOtp('test@example.com');
  //     await service.deleteOtp('test@example.com');

  //     expect(otpRepository.delete).toHaveBeenCalledWith({ user: 'test@example.com' });
  //   });
  // });
  //     expect(otpRepository.delete).toHaveBeenCalledWith({ user: 'test@example.com' });
  //   });
  // });

  // describe('findOtpById', () => {
  //   it('should find an OTP by email and OTP code', async () => {
  //     const otp = { id: 1, user: 'test@example.com', otp: '123456' };
  //     const verifyOtpDto: Partial<VerifyOtpDto> = { email_id: 'test@example.com', otp: '123456' };
  // describe('findOtpById', () => {
  //   it('should find an OTP by email and OTP code', async () => {
  //     const otp = { id: 1, user: 'test@example.com', otp: '123456' };
  //     const verifyOtpDto: Partial<VerifyOtpDto> = { email_id: 'test@example.com', otp: '123456' };

  //     otpRepository.findOne.mockResolvedValue(otp);
  //     otpRepository.findOne.mockResolvedValue(otp);

  //     const result = await service.findOtpById(verifyOtpDto as VerifyOtpDto);
  //     const result = await service.findOtpById(verifyOtpDto as VerifyOtpDto);

  //     expect(otpRepository.findOne).toHaveBeenCalledWith({ where: { user: 'test@example.com', otp: '123456' } });
  //     expect(result).toEqual(otp);
  //   });
  //     expect(otpRepository.findOne).toHaveBeenCalledWith({ where: { user: 'test@example.com', otp: '123456' } });
  //     expect(result).toEqual(otp);
  //   });

  //   it('should return null if OTP is not found', async () => {
  //     const verifyOtpDto: Partial<VerifyOtpDto> = { email_id: 'test@example.com', otp: '123456' };
  //   it('should return null if OTP is not found', async () => {
  //     const verifyOtpDto: Partial<VerifyOtpDto> = { email_id: 'test@example.com', otp: '123456' };

  //     otpRepository.findOne.mockResolvedValue(null);
  //     otpRepository.findOne.mockResolvedValue(null);

  //     const result = await service.findOtpById(verifyOtpDto as VerifyOtpDto);
  //     const result = await service.findOtpById(verifyOtpDto as VerifyOtpDto);

  //     expect(otpRepository.findOne).toHaveBeenCalledWith({ where: { user: 'test@example.com', otp: '123456' } });
  //     expect(result).toBeNull();
  //   });
  // });
  //     expect(otpRepository.findOne).toHaveBeenCalledWith({ where: { user: 'test@example.com', otp: '123456' } });
  //     expect(result).toBeNull();
  //   });
  // });
});
