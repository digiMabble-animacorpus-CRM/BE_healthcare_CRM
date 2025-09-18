import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewChatBotHistory } from './entities/chat-bot-history.entity';
import { ChatBotHistoryService } from './chat-bot-history.service';
import { ChatBotHistoryController } from './chat-bot-history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NewChatBotHistory])],
  controllers: [ChatBotHistoryController],
  providers: [ChatBotHistoryService],
  exports: [ChatBotHistoryService], // export if you want to use it in other modules
})
export class ChatBotHistoryModule {}
