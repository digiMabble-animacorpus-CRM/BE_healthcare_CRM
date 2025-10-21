import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { NewChatBotHistory } from 'src/modules/chat-bot-history/entities/chat-bot-history.entity';
import { ChatBotHistoryFilterDto } from './dto/chat-bot-history-filter.dto';

@Injectable()
export class ChatBotHistoryService {
  constructor(
    @InjectRepository(NewChatBotHistory)
    private readonly historyRepository: Repository<NewChatBotHistory>,
  ) {}

  async findAll(filter?: ChatBotHistoryFilterDto) {
    const { start_date, end_date, email } = filter || {};

    const where: any = {};

    if (start_date && end_date) {
      // Add date range condition
      where.created_at = Between(
        new Date(start_date),
        new Date(new Date(end_date).setHours(23, 59, 59, 999))
      );
    } else if (start_date) {
      where.created_at = Between(
        new Date(start_date),
        new Date(new Date(start_date).setHours(23, 59, 59, 999))
      );
    } else if (end_date) {
      where.created_at = Between(
        new Date(end_date),
        new Date(new Date(end_date).setHours(23, 59, 59, 999))
      );
    }

    if (email) {
      where.email = email.toLowerCase();
    }

    return this.historyRepository.find({
      where,
      order: { id: 'DESC' },
    });
  }
}
