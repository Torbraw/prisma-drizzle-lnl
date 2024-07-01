import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { ExceptionResponse } from './types';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger(AllExceptionsFilter.name);

  public constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  public catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let responseBody: ExceptionResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      let message = '';
      if (exception.getResponse() instanceof Object) {
        message = (exception.getResponse() as Record<string, unknown>).message as string;
      } else {
        message = exception.getResponse() as string;
      }

      responseBody = {
        statusCode: exception.getStatus(),
        message: message,
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      responseBody = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Bad Request',
        code: exception.code,
      };
    }

    if (process.env.NODE_ENV !== 'production' || responseBody.statusCode === 500) {
      this.logger.error(exception);
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}
