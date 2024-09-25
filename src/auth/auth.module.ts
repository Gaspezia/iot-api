import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ACCESS_TOKEN_EXPIRE_TIME } from '../utils/const';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: ACCESS_TOKEN_EXPIRE_TIME }
      })
    }),
    RefreshTokenModule
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
