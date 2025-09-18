import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatBotHistory } from './entities/chat-bot-history.entity';
import { ChatBotHistoryService } from './chat-bot-history.service';
import { ChatBotHistoryController } from './chat-bot-history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChatBotHistory])],
  controllers: [ChatBotHistoryController],
  providers: [ChatBotHistoryService],
  exports: [ChatBotHistoryService], // export if you want to use it in other modules
})
export class ChatBotHistoryModule {}
