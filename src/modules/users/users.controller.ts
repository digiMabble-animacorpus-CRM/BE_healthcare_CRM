import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import HandleResponse from 'src/core/utils/handle_response';
import { EC200, EM100, EM106, EM116 } from 'src/core/constants';
import { HomeService } from './home.service';
import { AuthGuard } from '@nestjs/passport';

// @ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly homeService: HomeService,
  ) {}

  // @Get(':user_id')
  // async profile(@Param('user_id') id: number) {
  //   try {
  //     let data = await this.userService.findOneById(id);
  //     return HandleResponse.buildSuccessObj(EC200, EM106, data);
  //     // return HandleResponse.buildSuccessObj(EC200, EM106);

  //   } catch (error) {
  //     return HandleResponse.buildErrObj(null, EM100, error);
  //   }
  // }
  // // @UseGuards(DoesUserExist)
  // @Post('updateProfile')
  // async updateUser(@Body() user: UpdateUserDto) {
  //   try {
  //     let data = await this.userService.updateProfile(user);
  //     return HandleResponse.buildSuccessObj(EC200, EM116, data);
  //           // return HandleResponse.buildSuccessObj(EC200, EM116);

  //   } catch (error) {
  //     return HandleResponse.buildErrObj(error?.status || null, error.message, error);
  //   }
  // }
}
