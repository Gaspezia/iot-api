import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';
import { User } from '../user/entity/user.entity';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>
  ) {}

  async createToken(user: User, token: string, expiresAt: Date): Promise<RefreshToken> {
    const refreshToken = this.refreshTokenRepository.create({
      token,
      user,
      expiresAt
    });
    return this.refreshTokenRepository.save(refreshToken);
  }

  async findToken(token: string, userId: number): Promise<RefreshToken | undefined> {
    return this.refreshTokenRepository.findOne({ where: { token, user: { id: userId } } });
  }

  async revokeToken(token: string): Promise<void> {
    await this.refreshTokenRepository.delete({ token });
  }

  async removeExpiredTokens() {
    await this.refreshTokenRepository.delete({ expiresAt: LessThan(new Date()) });
  }
}
