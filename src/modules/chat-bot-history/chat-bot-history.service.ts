import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewChatBotHistory } from 'src/modules/chat-bot-history/entities/chat-bot-history.entity';

@Injectable()
export class ChatBotHistoryService {
  constructor(
    @InjectRepository(NewChatBotHistory)
    private readonly historyRepository: Repository<NewChatBotHistory>,
  ) {}

  findAll() {
    return this.historyRepository.find({
      order: { id: 'DESC' },
    });
  }
}
