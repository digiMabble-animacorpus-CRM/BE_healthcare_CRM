import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RosaToken } from './entities/rosa-token.entity';
import { RosaTokenService } from './rosa-token.service';
import { RosaTokenController } from './rosa-token.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RosaToken])],
  controllers: [RosaTokenController],
  providers: [RosaTokenService],
  exports: [RosaTokenService],
})
export class RosaTokenModule {}
