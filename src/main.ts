require('dotenv').config()

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common'

async function bootstrap() {
  const logger = new Logger('App')
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 8080

  await app.listen(PORT);

  logger.log(`Application listening on http://localhost:${PORT}/graphql`)
}
bootstrap();
