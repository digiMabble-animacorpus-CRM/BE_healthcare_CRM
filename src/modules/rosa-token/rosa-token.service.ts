import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RosaToken } from './entities/rosa-token.entity';

@Injectable()
export class RosaTokenService {
  constructor(
    @InjectRepository(RosaToken)
    private tokenRepo: Repository<RosaToken>,
  ) {}

  async saveToken(token: string) {
    // deactivate old token
    await this.tokenRepo.update({ is_active: true }, { is_active: false });

    // save new token
    const newToken = this.tokenRepo.create({ token });
    return await this.tokenRepo.save(newToken);
  }

  async getActiveToken() {
    const token = await this.tokenRepo.findOne({ where: { is_active: true } });
    if (!token) throw new NotFoundException('Rosa token not found');
    return token;
  }
}
