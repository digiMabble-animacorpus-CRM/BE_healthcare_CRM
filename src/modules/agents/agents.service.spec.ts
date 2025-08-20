// // src/modules/agents/agents.controller.spec.ts

// import { Test, TestingModule } from '@nestjs/testing';
// import { AgentsController } from './agents.controller';
// import { AgentsService } from './agents.service';
// import { NotFoundException } from '@nestjs/common';
// import { AgentQueryDto } from './dto/agent-query.dto';
// import { UpdateAgentDto } from './dto/update-agent.dto';

// const mockAgentsService = () => ({
//   getAllAgents: jest.fn(),
//   getAgentById: jest.fn(),
//   // updateAgent: jest.fn(),
//   removeAgent: jest.fn(),
// });

// const mockAgentResponse = {
//   id: 1,
//   name: 'John Agent', // Changed from user_name to name
//   email_id: 'john@agent.com',
//   mobile_no: '+1234567890',
//   properties_count: 0,
//   city: 'New York',
//   country: 'USA',
//   social_links: {
//     facebook: 'https://facebook.com/john',
//     instagram: null,
//     twitter: null,
//   },
//   created_at: new Date('2024-01-01'),
// };

// describe('AgentsController', () => {
//   let controller: AgentsController;
//   let service: AgentsService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [AgentsController],
//       providers: [
//         {
//           provide: AgentsService,
//           useFactory: mockAgentsService,
//         },
//       ],
//     }).compile();

//     controller = module.get<AgentsController>(AgentsController);
//     service = module.get<AgentsService>(AgentsService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('getAllAgents', () => {
//     it('should return paginated agents list', async () => {
//       const queryDto: AgentQueryDto = {
//         page: 1,
//         limit: 10,
//         sort_by: 'created_at',
//         order: 'desc'
//       };

//       const mockResult = {
//         data: [mockAgentResponse],
//         total: 1,
//         page: 1,
//         limit: 10,
//         totalPages: 1,
//       };

//       jest.spyOn(service, 'getAllAgents').mockResolvedValue(mockResult);

//       const result = await controller.getAllAgents(queryDto);

//       expect(service.getAllAgents).toHaveBeenCalledWith(queryDto);
//       expect(result).toEqual({
//         code: 200,
//         message: 'Data Fetched Successfully',
//         data: mockResult,
//         success: true,
//       });
//     });

//     it('should return 204 when no agents found', async () => {
//       const queryDto: AgentQueryDto = {
//         page: 1,
//         limit: 10,
//         sort_by: 'created_at',
//         order: 'desc'
//       };

//       const mockResult = {
//         data: [],
//         total: 0,
//         page: 1,
//         limit: 10,
//         totalPages: 0,
//       };

//       jest.spyOn(service, 'getAllAgents').mockResolvedValue(mockResult);

//       const result = await controller.getAllAgents(queryDto);

//       expect(result).toEqual({
//         code: 204,
//         message: 'No agents found',
//         data: mockResult,
//         success: true,
//       });
//     });

//     it('should handle service errors', async () => {
//       const queryDto: AgentQueryDto = {
//         page: 1,
//         limit: 10,
//         sort_by: 'created_at',
//         order: 'desc'
//       };

//       jest.spyOn(service, 'getAllAgents').mockRejectedValue(new Error('Database error'));

//       const result = await controller.getAllAgents(queryDto);

//       expect(result).toEqual({
//         code: 500,
//         message: 'Database error',
//         data: expect.any(Error),
//         success: false,
//       });
//     });
//   });

//   describe('getAgentById', () => {
//     it('should return agent by id', async () => {
//       // jest.spyOn(service, 'getAgentById').mockResolvedValue(mockAgentResponse);

//       const result = await controller.getAgentById(1);

//       expect(service.getAgentById).toHaveBeenCalledWith(1);
//       expect(result).toEqual({
//         code: 200,
//         message: 'Data Fetched Successfully',
//         data: mockAgentResponse,
//         success: true,
//       });
//     });

//     it('should handle not found error', async () => {
//       jest.spyOn(service, 'getAgentById').mockRejectedValue(new NotFoundException('Agent not found'));

//       const result = await controller.getAgentById(999);

//       expect(result).toEqual({
//         code: 204,
//         message: 'No record found!!',
//         data: expect.any(NotFoundException),
//         success: false,
//       });
//     });
//   });

//   describe('updateAgent', () => {
//     it('should update agent successfully', async () => {
//       const updateDto: UpdateAgentDto = {
//         name: 'Updated Agent Name', // Changed from user_name to name
//         social_links: {
//           facebook: 'https://facebook.com/updated'
//         }
//       };

//       const updatedAgent = {
//         ...mockAgentResponse,
//         name: 'Updated Agent Name', // Changed from user_name to name
//       };

//       // jest.spyOn(service, 'updateAgent').mockResolvedValue(updatedAgent);

//       const result = await controller.updateAgent(1, updateDto);

//       expect(service.updateAgent).toHaveBeenCalledWith(1, updateDto);
//       expect(result).toEqual({
//         code: 200,
//         message: 'Record updated successfully',
//         data: updatedAgent,
//         success: true,
//       });
//     });

//     it('should handle update errors', async () => {
//       const updateDto: UpdateAgentDto = {
//         name: 'Updated Agent Name', // Changed from user_name to name
//       };

//       jest.spyOn(service, 'updateAgent').mockRejectedValue(new NotFoundException('Agent not found'));

//       const result = await controller.updateAgent(999, updateDto);

//       expect(result).toEqual({
//         code: 204,
//         message: 'No record found!!',
//         data: expect.any(NotFoundException),
//         success: false,
//       });
//     });
//   });

//   describe('removeAgent', () => {
//     it('should remove agent successfully', async () => {
//       jest.spyOn(service, 'removeAgent').mockResolvedValue(undefined);

//       const result = await controller.removeAgent(1);

//       expect(service.removeAgent).toHaveBeenCalledWith(1);
//       expect(result).toEqual({
//         code: 204,
//         message: 'Record deleted successfully',
//         data: null,
//         success: true,
//       });
//     });

//     it('should handle not found error on remove', async () => {
//       jest.spyOn(service, 'removeAgent').mockRejectedValue(new NotFoundException('Agent not found'));

//       const result = await controller.removeAgent(999);

//       expect(result).toEqual({
//         code: 404,
//         message: 'No record found!!',
//         data: expect.any(NotFoundException),
//         success: false,
//       });
//     });
//   });
// });
