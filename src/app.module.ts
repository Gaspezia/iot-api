import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entity/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RefreshToken } from './refresh-token/refresh-token.entity';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User, RefreshToken],
        synchronize: true
      })
    }),
    UserModule,
    AuthModule,
    RefreshTokenModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
