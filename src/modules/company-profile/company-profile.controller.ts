// import { Controller, Get, Put, Body, Req } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { CompanyProfileService } from './company-profile.service';
// import { UpdateCompanyProfileDto } from './dto/company-profile.dto';
// import HandleResponse from 'src/core/utils/handle_response';
// import { EC200, EC500, EM100, EM106, EM116 } from 'src/core/constants';

// @Controller('company-profile')
// @ApiTags('Company Profile')
// export class CompanyProfileController {
//   constructor(private readonly companyProfileService: CompanyProfileService) {}

//   @Get()
//   async getCompanyProfile(@Req() req: any) {
//     try {
//       const data = await this.companyProfileService.getCompanyProfile(req);
//       return HandleResponse.buildSuccessObj(EC200, EM106, data);
//     } catch (error) {
//       return HandleResponse.buildErrObj(EC500, error.message || EM100, error);
//     }
//   }

//   @Put()
//   async updateCompanyProfile(@Req() req: any, @Body() updateCompanyProfileDto: UpdateCompanyProfileDto) {
//     try {
//       const data = await this.companyProfileService.updateCompanyProfile(req, updateCompanyProfileDto);
//       return HandleResponse.buildSuccessObj(EC200, EM116, data);
//     } catch (error) {
//       return HandleResponse.buildErrObj(EC500, error.message || EM100, error);
//     }
//   }
// }
