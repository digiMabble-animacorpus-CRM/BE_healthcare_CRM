import { Controller, Get, Query } from '@nestjs/common';
import { ChatBotHistoryService } from './chat-bot-history.service';
import { ChatBotHistoryFilterDto } from './dto/chat-bot-history-filter.dto';

@Controller('chat-bot-history')
export class ChatBotHistoryController {
  constructor(private readonly chatBotHistoryService: ChatBotHistoryService) {}

  @Get()
  async getAllHistory(@Query() filter: ChatBotHistoryFilterDto) {
    return await this.chatBotHistoryService.findAll(filter);
  }
}
