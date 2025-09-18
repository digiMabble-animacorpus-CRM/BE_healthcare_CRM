import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatBotHistory } from 'src/modules/chat-bot-history/entities/chat-bot-history.entity';

@Injectable()
export class ChatBotHistoryService {
  constructor(
    @InjectRepository(ChatBotHistory)
    private readonly historyRepository: Repository<ChatBotHistory>,
  ) {}

  findAll() {
    return this.historyRepository.find({
      order: { created_at: 'DESC' },
    });
  }
}
