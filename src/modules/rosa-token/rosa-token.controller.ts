import { Controller, Post, Get, Body } from '@nestjs/common';
import { RosaTokenService } from './rosa-token.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('rosa-token')
export class RosaTokenController {
  constructor(private readonly service: RosaTokenService) {}

  @Public() 
  @Post()
  async saveToken(@Body('token') token: string) {
    return await this.service.saveToken(token);
  }

  @Public() 
  @Get()
  async getToken() {
    return await this.service.getActiveToken();
  }
}
