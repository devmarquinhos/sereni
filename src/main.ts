import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setDefaultResultOrder } from 'node:dns';

async function bootstrap() {
  setDefaultResultOrder('ipv4first');
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
