import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtExceptionFilter } from './auth/jwt-exception.filter';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new JwtExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get('Reflector')));
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
