import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UsePipes,
    ValidationPipe,
    HttpException
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import HandleResponse from 'src/core/utils/handle_response';
import {
    EC200, EC201, EC204, EC500,
    EM100, EM104, EM106, EM116, EM127
} from 'src/core/constants';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    @Post()
    @UsePipes(new ValidationPipe())
    async create(@Body() createLeadDto: CreateLeadDto) {
        try {
            const data = await this.leadsService.createLead(createLeadDto);
            return HandleResponse.buildSuccessObj(EC201, EM104, data);
        } catch (error) {
            const status = error instanceof HttpException ? error.getStatus() : EC500;
            const message = error instanceof HttpException ? error.message : EM100;
            return HandleResponse.buildErrObj(status, message, error);
        }
    }

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(@Query() queryDto: LeadQueryDto) {
        try {
            const { pagNo = 1, limit = 10, status, searchText } = queryDto;

            const { data, total } = await this.leadsService.findLeadsWithPagination(
                pagNo, limit, searchText, status
            );

            return HandleResponse.buildSuccessObj(EC200, EM106, {
                data, total, page: pagNo, limit,
                filters: { status, searchText }
            });
        } catch (error) {
            const status = error instanceof HttpException ? error.getStatus() : EC500;
            const message = error instanceof HttpException ? error.message : EM100;
            return HandleResponse.buildErrObj(status, message, error);
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        try {
            const data = await this.leadsService.findOne(+id);
            return HandleResponse.buildSuccessObj(EC200, EM106, data);
        } catch (error) {
            const status = error instanceof HttpException ? error.getStatus() : EC500;
            const message = error instanceof HttpException ? error.message : EM100;
            return HandleResponse.buildErrObj(status, message, error);
        }
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
    async update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
        try {
            await this.leadsService.update(+id, updateLeadDto);
            const data = await this.leadsService.findOne(+id);
            return HandleResponse.buildSuccessObj(EC200, EM116, data);
        } catch (error) {
            const status = error instanceof HttpException ? error.getStatus() : EC500;
            const message = error instanceof HttpException ? error.message : EM100;
            return HandleResponse.buildErrObj(status, message, error);
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        try {
            await this.leadsService.remove(+id);
            return HandleResponse.buildSuccessObj(EC204, EM127, null);
        } catch (error) {
            const status = error instanceof HttpException ? error.getStatus() : EC500;
            const message = error instanceof HttpException ? error.message : EM100;
            return HandleResponse.buildErrObj(status, message, error);
        }
    }
}
