import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { AuthService } from '../src/auth/auth.service';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const authService = app.get(AuthService);
  const configService = app.get(ConfigService);

  const email = configService.get<string>('ROOT_USER');
  const password = configService.get<string>('ROOT_PASSWORD');
  const is_admin = configService.get<boolean>('ROOT_IS_ADMIN');

  if (!email || !password || !is_admin) {
    console.error('ROOT_USER, ROOT_PASSWORD and IS_ADMIN must be defined in the .env file.');
    process.exit(1);
  }

  try {
    const user = await authService.register(email, password, is_admin);
    console.log('Root user created successfully:', user);
  } catch (error) {
    console.error('An error occurred while creating the root user:', error.message);
  } finally {
    await app.close();
  }
}

bootstrap();
