// // src/modules/agents/agents.controller.ts

// import { Controller, Get, Put, Body, Param, Query, ParseIntPipe, Delete, Post, HttpStatus, ConflictException } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { AgentsService } from './agents.service';
// import HandleResponse from 'src/core/utils/handle_response';
// import { EC200, EC201, EC204, EC404, EC500, EM100, EM104, EM106, EM116, EM119, EM127 } from 'src/core/constants';
// import { CreateAgentDto } from './dto/create-agent.dto';
// import { AgentQueryDto } from './dto/agent-query.dto';
// import { UpdateAgentDto } from './dto/update-agent.dto';

// @Controller('agents')
// @ApiTags('Agents')
// export class AgentsController {
//     constructor(private readonly agentsService: AgentsService) { }

//     @Post()
//     async createAgent(@Body() createAgentDto: CreateAgentDto) {
//         try {
//             const data = await this.agentsService.createAgent(createAgentDto);
//             return HandleResponse.buildSuccessObj(EC201, 'Agent created successfully', data);
//         } catch (error) {
//             if (error instanceof ConflictException) {
//                 return HandleResponse.buildErrObj(HttpStatus.CONFLICT, error.message, error);
//             }
//             return HandleResponse.buildErrObj(EC500, error?.message || EM100, error);
//         }
//     }

//     @Get()
//     async getAllAgents(@Query() queryDto: AgentQueryDto) {
//         try {
//             const result = await this.agentsService.getAllAgents(queryDto);

//             if (result.total === 0) {
//                 return HandleResponse.buildSuccessObj(EC204, 'No agents found', result);
//             }

//             return HandleResponse.buildSuccessObj(EC200, EM106, result);
//         } catch (error) {
//             return HandleResponse.buildErrObj(EC500, error?.message || EM100, error);
//         }
//     }

//     @Get(':id')
//     async getAgentById(@Param('id', ParseIntPipe) id: number) {
//         try {
//             const agent = await this.agentsService.getAgentById(id);
//             return HandleResponse.buildSuccessObj(EC200, EM106, agent);
//         } catch (error) {
//             if (error.message.includes('not found')) {
//                 return HandleResponse.buildErrObj(EC204, EM119, error);
//             }
//             return HandleResponse.buildErrObj(EC500, error?.message || EM100, error);
//         }
//     }

//     @Put(':id')
//     async updateAgent(
//         @Param('id', ParseIntPipe) id: number,
//         @Body() updateDto: UpdateAgentDto
//     ) {
//         try {
//             const updatedAgent = await this.agentsService.updateAgent(id, updateDto);
//             return HandleResponse.buildSuccessObj(EC200, EM116, updatedAgent);
//         } catch (error) {
//             if (error.message.includes('not found')) {
//                 return HandleResponse.buildErrObj(EC204, EM119, error);
//             }
//             return HandleResponse.buildErrObj(EC500, error?.message || EM100, error);
//         }
//     }

//     @Delete(':id')
//     async removeAgent(@Param('id', ParseIntPipe) id: number) {
//         try {
//             await this.agentsService.removeAgent(id);
//             return HandleResponse.buildSuccessObj(EC204, EM127, null);
//         } catch (error) {
//             if (error.message.includes('not found')) {
//                 return HandleResponse.buildErrObj(EC404, EM119, error);
//             }
//             return HandleResponse.buildErrObj(EC500, error?.message || EM100, error);
//         }
//     }
// }
