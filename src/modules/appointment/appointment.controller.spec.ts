import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsController } from './appointment.controller';
import { AppointmentsService } from './appointment.service';

describe('OrdersController', () => {
  let controller: AppointmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentsController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: {
            createOrder: jest.fn(),
            findAllOrders: jest.fn(),
            findOneOrder: jest.fn(),
            updateOrder: jest.fn(),
            removeOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppointmentsController>(AppointmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});