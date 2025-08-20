// import {
//   Controller,
//   Get,
//   Query,
//   UseGuards,
// } from '@nestjs/common';
// import { ApiTags, ApiOperation } from '@nestjs/swagger';
// import { StaffRoleService } from './staff-role.service';
// import { AuthGuard } from '@nestjs/passport';
// import { AES } from 'src/core/utils/encryption.util'; 

// @ApiTags('Staff Roles')
// @Controller('staff-role')
// @UseGuards(AuthGuard())
// export class StaffRoleController {
//   constructor(private readonly staffRoleService: StaffRoleService) {}

//   @Get()
//   @ApiOperation({ summary: 'Get roles or access levels by tag' })
//   async findByTag(@Query('tag') tag: string) {
//     const data = await this.staffRoleService.findByTag(tag);

//     //  Encrypt and return like this
//     return { data: AES.encrypt(data) };
//   }
// }
