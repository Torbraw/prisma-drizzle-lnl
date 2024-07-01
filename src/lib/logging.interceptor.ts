import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);

  public intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const now = Date.now();
    this.logger.debug(`Entering ${request.method} ${request.url}`);

    return next.handle().pipe(
      tap(() => {
        this.logger.debug(
          `Completed ${request.method} ${request.url} with a time of: ${(Date.now() - now).toString()}ms`,
        );
      }),
    );
  }
}
