import { Controller, Get } from '@nestjs/common';
import { ChatBotHistoryService } from './chat-bot-history.service';


@Controller('chat-bot-history')
export class ChatBotHistoryController {
  constructor(private readonly chatBotHistoryService: ChatBotHistoryService) {}


  @Get()
  async getAllHistory() {
    return await this.chatBotHistoryService.findAll();
  }
}
