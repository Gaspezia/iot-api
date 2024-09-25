import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { ACCESS_TOKEN_EXPIRE_TIME, REFRESH_TOKEN_EXPIRE_TIME } from '../utils/const';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: ACCESS_TOKEN_EXPIRE_TIME });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: REFRESH_TOKEN_EXPIRE_TIME });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await this.refreshTokenService.createToken(user, refreshToken, expiresAt);

    await this.userService.updateLastLogin(user.id);

    return {
      access: accessToken,
      refresh: refreshToken,
      expiresAt: expiresAt
    };
  }

  async register(email: string, password: string, is_admin: boolean) {
    const createUserDto: CreateUserDto = {
      email,
      password,
      is_admin
    };

    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('error.email.already.exists');
      } else {
        throw new InternalServerErrorException('An error occurred during registration');
      }
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findByEmail(payload.email);

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const storedRefreshToken = await this.refreshTokenService.findToken(refreshToken, user.id);

      if (!storedRefreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.jwtService.sign(
        { email: payload.email, sub: payload.sub },
        { expiresIn: ACCESS_TOKEN_EXPIRE_TIME }
      );

      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
