import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/mysql2';
import { ConfigService } from '@nestjs/config';
import { createConnection } from 'mysql2/promise';

@Module({
  providers: [
    {
      provide: 'Drizzle',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const connection = await createConnection({
          uri: configService.getOrThrow<string>('DATABASE_URL'),
        });
        return drizzle(connection, { logger: true });
      },
    },
  ],
  exports: [],
})
export class DrizzleModule {}
