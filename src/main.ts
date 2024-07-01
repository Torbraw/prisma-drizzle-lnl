import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './lib/all-exception.filter';
import { LoggingInterceptor } from './lib/logging.interceptor';
import { LogLevel } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    logger: (process.env.NEST_LOGGER_LEVELS?.split(',') as LogLevel[]) ?? ['error'],
  });

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));

  if (process.env.NODE_ENV !== 'production') {
    app.useGlobalInterceptors(new LoggingInterceptor());
  }

  await app.listen(3000);
}

void (async () => {
  await bootstrap();
})();
